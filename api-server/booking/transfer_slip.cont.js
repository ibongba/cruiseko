const {sequelize,TransferSlip,Booking} = require('../db')
const tools = require('../helper/tools')
const errors = require('../errors')
const {DefaultError} = errors


exports.getAll = async(req,res,next)=>{
  var {page=1,limit=25,no_limit,status} = req.query;
  var {orderby='createdAt' ,op='desc'} = req.query;
  try{
    var where = {}

    if(status) where.status = status;

    const include = [
      {model :Booking }
    ]

    var order = [[orderby,op]];
    var options = {where,include,order}

    if(!isNaN(page) && page > 1){
      options.offset = (page-1)*limit;
      
      options.limit = limit;
    }
    if(!isNaN(limit)){
        options.limit = parseInt(limit);
    }

    if(no_limit == 1){
      delete options.no_limit
    }
    const slips = await TransferSlip.findAndCountAll(options);
    res.json(slips)
  }
  catch(err){
      next(err);
  }
}

exports.getOne = async(req,res,next)=>{
  const id = req.params.sid
  try{
      const item = await TransferSlip.findOne({where : {id}});
      res.json(cate)
  }
  catch(err){
      next(err);
  }
}

exports.create = async(req,res,next)=>{
  var data = req.body;
  var {} = data;
  var files = req.files || {}
  const user = req.user;
  try{
    if(files.image && files.image.name){
      let file = files.image;
      let fileName = await tools.moveFileWithPath(file,'images')
      data.image = tools.genFileUrl(fileName,'images')
    }

    data.user_id = user.id
    await TransferSlip.create(data)
    res.json({success:true})
  }
  catch(err){
    next(err);
  }
}

exports.update = async(req,res,next)=>{
  const id = req.params.sid
  var data = req.body;
  var files = req.files || {}
  var {status} = data;
  var transaction;
  try{
    if(files.image && files.image.name){
      let file = files.image;
      let fileName = await tools.moveFileWithPath(file,'images')
      data.image = tools.genFileUrl(fileName,'images')
    }

    const slip = await TransferSlip.findOne({where : {id}})

    if(!slip){
      throw new DefaultError(errors.NOT_FOUND)
    }
    const {transfer_date,booking_id} = slip;

    transaction = await sequelize.transaction()
    if(status == 2){
      //Update booking status
      var prep = {
        payment_status : 2,
        payment_date : transfer_date,
        payment_type : "TRANSFER"
      }
      await Booking.update(prep,{where : {booking_id},transaction})
    }


    await TransferSlip.update(data,{where : {id},transaction})
    await transaction.commit()
    res.json({success:true})
  }
  catch(err){
    next(err)
    if(transaction) await transaction.rollback()
  }
}

exports.delete = async(req,res,next)=>{
  const id = req.params.sid
  try{
    await TransferSlip.destroy({where : {id}})
    res.json({success:true})
  }
  catch(err){
    next(err)
  }
}