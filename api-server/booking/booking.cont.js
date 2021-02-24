const { Product,sequelize,PriceDate,
  CompanyType,ProductBoat,Booking,BookingDetail,
  BookingBoat,BookingAddress,User,ProductAddon,BookingAddon,
  PriceCompanyType,PriceDateDetail, Boat, BoatCategory,TransferSlip} = require('../db')
const tools = require('../helper/tools')
const errors = require('../errors')
const {DefaultError} = errors
const {Op} = require('sequelize')
const {getOneProduct} = require('../products/products.cont')
const {calPackagePrice,calDuration} = require('../helper/packageHelper')



exports.getAll = async(req,res,next)=>{
  var {page=1,limit=25,orderby='createdAt' ,op='desc',user_id,payment_status,start_date,end_date} = req.query
  const user = req.user
  try{
    var where = {[Op.and] : []}


    if(user_id){
      if(user.id !== user_id ){
        throw new DefaultError(errors.PERMISSION_ERROR);
      }

      where.user_id = user_id;
    }
    if(payment_status) where.payment_status = payment_status;

    if(start_date){
      // start_date = new Date(start_date)
      // start_date.setDate(start_date.getDate()-1)
      where[Op.and].push({createdAt : {[Op.gte] : start_date} })
    }
    if(end_date){
      end_date = new Date(end_date)
      end_date.setDate(end_date.getDate() + 1)
      end_date = tools.toDateISO(end_date)
      where[Op.and].push({createdAt : {[Op.lt] : end_date} })
    }


    var order = [[orderby,op]];



    var options = {where,order/* ,logging:console.log */}

    


    if(!isNaN(page) && page > 1){
      options.offset = (page-1)*limit;
      
      options.limit = limit;
    }
    if(!isNaN(limit)){
        options.limit = parseInt(limit);
    }
    const bookings = await Booking.findAndCountAll(options)
    res.json(bookings)
  } 
  catch(err){
    next(err);
  }
}

exports.getOne = async(req,res,next)=>{
  const id  = req.params.id;
  try{

    const detail_inc = [
      {model : Product}
    ]
    const boat_inc = [
      {model : Boat ,include : [BoatCategory]}
    ]
    const addon_inc = [
      {model : ProductAddon ,as :'addon'}
    ]
    const include = [
      {model : BookingDetail ,include : detail_inc},
      {model : BookingBoat ,include : boat_inc},
      {model : BookingAddon ,include : addon_inc},
      {model : User},
      {model : BookingAddress},
      {model : TransferSlip,as :'slips'}
    ]
    const order = [
      [{model:TransferSlip,as:'slips' },'createdAt','desc']
    ]

    const booking = await Booking.findOne({where : {id},include,order})
    res.json(booking)
  } 
  catch(err){
    next(err);
  }
}

exports.create = async(req,res,next)=>{
  var data = req.body;
  var {product_id,adult,children,date} = data;
  var {user_firstname,user_lastname,user_email,user_phone,addons} = data;
  var {address,sub_district,district,province,postal_code} = data;
  var {start_time,end_time} = data;
  const _user = req.user;
  var transaction;
  console.log('booking ->',data)
  try{
    if(!date || (!product_id && product_id !== 0)){
      throw new DefaultError(errors.FILEDS_INCOMPLETE);
    }

    if(!_user){
      throw new DefaultError(errors.INVALID_INPUT);
    }
    const [product,user] = await Promise.all([
      getOneProduct(product_id),
      User.findOne({where : {id : _user.id}})
    ])
    if(!product || !user){
      throw new DefaultError(errors.INVALID_INPUT);
    }
    const {products_boats,is_boat} = product

    if(is_boat == 1){
      if(!start_time || !end_time){
        throw new DefaultError(errors.FILEDS_INCOMPLETE);
      }
    }
    else {
      start_time = product.start_time;
      end_time = product.end_time
    }

    var duration ,rental_start,rental_end,booking_boat_data;

    
      
    var [hour_start,min_start] = start_time.split(':')
    var [hour_end,min_end] = end_time.split(':')
    rental_start = new Date(date) 
    rental_end = new Date(date) 
    rental_start.setHours(hour_start,min_start)
    rental_end.setHours(hour_end,min_end)
    
    duration = calDuration(start_time,end_time)

    /*  
      start_date is between x_start_date and end_date
      end is between x_start_date and end_date
    */

    const ua_boat = await BookingBoat.findAll({where  : {
      boat_id : products_boats[0].boat_id,
      status : 1,
      [Op.or] : [
        {[Op.and] : [{rental_start : {[Op.lte] : rental_start}  },{rental_end : {[Op.gte] : rental_start}  }] },
        {[Op.and] : [{rental_start : {[Op.lte] : rental_end}  },{rental_end : {[Op.gte] : rental_end}  }] }
      ]
    },attributes:['boat_id','amount'] ,raw:true})

    const unavailable_boat = ua_boat.reduce((total,item) => total+item.amount ,0 )
    console.log('Unavailable Boat',unavailable_boat)
    const remain_boat = products_boats[0].amount - unavailable_boat;

    if(remain_boat <= 0){
      throw new DefaultError(errors.INVALID_INPUT);
    }

    booking_boat_data ={
      boat_id : products_boats[0].boat_id,
      rental_start,
      rental_end,
    }
    
    

    const {price,boat_amt} = calPackagePrice(product,user,date,adult,children,duration)
    if(price === -1){
      throw new DefaultError(errors.INVALID_INPUT);
    }


    var total_price_addons = 0;
    var addons_dt = [] ;
    if(addons && addons.length){
      addons_dt = await ProductAddon.findAll({where : {id : addons.map(val => val.id) },raw:true})
      addons_dt = addons_dt.map(val => {
        const item = addons.find(item =>  item.id === val.id)
        const quantity = item ? item.quantity : 1
        return {...val,quantity}
      })
      total_price_addons = addons_dt.reduce((total,current) => total+ parseInt(current.price)*current.quantity  , 0)
      
    }
    
    
    var net_price = price + total_price_addons;

    // const boats = await Boat.findAll({where : {boat_id : products_boats.map(val=> val.boat_id) }})

    
    const booking_id = await tools.genBookingId()

    transaction = await sequelize.transaction()

    var booking_data = {
      id : booking_id,
      adult,
      children,
      total_person : parseInt(adult) + parseInt(children),
      user_id : user.id,
      user_type : user.user_type,
      user_firstname,
      user_lastname,
      user_email,
      user_phone,
      net_price ,
      addon_price : total_price_addons,
      payment_status : 1,
      start_date : rental_start,
      end_date : rental_end,
      duration,
      // payment_type : 'CREDIT',
      // payment_date : new Date(),

    }

    console.log('result',booking_data)

    // throw new Error();

    const booking = await Booking.create(booking_data,{transaction})

    if(booking_boat_data){
      booking_boat_data.booking_id = booking.id;
      booking_boat_data.amount = boat_amt;
      await BookingBoat.create(booking_boat_data,{transaction})
    }

    var booking_detail = {
      booking_id : booking.id,
      product_id,
      price ,
      amount : boat_amt

    }
    var booking_addons;
    


    await BookingDetail.create(booking_detail,{transaction})
    if(addons_dt.length){
      var booking_addons = addons_dt.map(val => {
        // const quantity = addons.find(item =>  item.id === val.id)?.quantity || 1
        return {...val,id : null,product_id,booking_id : booking.id,addon_id : val.id}
      })
      // console.log('booking_addons',booking_addons)
      await BookingAddon.bulkCreate(booking_addons,{transaction})

    }

    if(address){
      var address_data = {
        booking_id : booking.id,
        user_id : user.id,
        address,
        sub_district,
        district,
        province,
        postal_code
      }
  
      await BookingAddress.create(address_data,{transaction})
    }
    

    // throw new Error()
    

    await transaction.commit()
    res.json({success : true,booking : {...booking.toJSON(),name : product.name}})
  }
  catch(err){
    next(err);
    if(transaction) await transaction.rollback()
  }
}

exports.update = async(req,res,next)=>{
  var data = req.body;
  const id  = req.params.id;
  var {method,adult,children,status,payment_type,payment_status} = data
  // var transaction;
  try{
    if(method === 'detail'){
      var tmp = {}
      if(adult && children){
        tmp = {adult,children ,total_person : parseInt(adult) + parseInt(children)}
      }
      if(status ){
        tmp.status = status
      }
      if(payment_status && payment_type){
        tmp.payment_status = payment_status
        tmp.payment_date = new Date();
        tmp.payment_type = payment_type
      }

      await Booking.update(tmp,{where : {id}})
    }

    res.json({success : true})
    // transaction = await sequelize.transaction()

    
    // await transaction.commit()
  }
  catch(err){
    next(err);
    // if(transaction) await transaction.rollback()
  }
}

exports.checkAvailableBoat = async(req,res,next)=>{
  var {boat_id,date,start_time,end_time} = req.query;
  try{

    if(!boat_id || !start_time || !end_time ){
      throw new DefaultError(errors.FILEDS_INCOMPLETE);
    }
    const boat = await Boat.findOne({where : {boat_id}})

    if(!boat){
      throw new DefaultError(errors.NOT_FOUND);
    }
    // var [hour_start,min_start] = start_time.split(':')
    // var [hour_end,min_end] = end_time.split(':')
    var rental_start = new Date(start_time) 
    var rental_end = new Date(end_time) 
    // rental_start.setHours(hour_start,min_start)
    // rental_end.setHours(hour_end,min_end)
    const ua_boat = await BookingBoat.findAll({where  : {
      boat_id : boat.boat_id,
      status : 1,
      [Op.or] : [
        {[Op.and] : [{rental_start : {[Op.lte] : rental_start}  },{rental_end : {[Op.gte] : rental_start}  }] },
        {[Op.and] : [{rental_start : {[Op.lte] : rental_end}  },{rental_end : {[Op.gte] : rental_end}  }] }
      ]
    },attributes:['boat_id','amount'] ,raw:true})

    const unavailable_boat = ua_boat.reduce((total,item) => total+item.amount ,0 )
    // console.log('Unavailable Boat',unavailable_boat)
    const available_boat = boat.amount - unavailable_boat;

    res.json({success:true,available_boat})
  }
  catch(err){
    next(err);
  }
}