const { Product,ProductImage,sequelize,PriceDate,
  CompanyType,ProductBoat,Event,Location,
  PriceCompanyType,PriceDateDetail, Boat, BoatCategory, ProductCategory,ProductAddon,Review} = require('../db')
const tools = require('../helper/tools')
const errors = require('../errors')
const {DefaultError} = errors
const {Op} = require('sequelize')

const review_sql = '(select avg(rating) as rating from review where product_id = products.id and deleted = 0 and status = 1)'
const review_count_sql = '(select count(product_id) as rating from review where product_id = products.id and deleted = 0 and status = 1)'

exports.getAll = async(req,res,next)=>{
  var {page=1,limit=25,is_draft=1,publish_status,is_boat,price_today=1} = req.query
  var {price_start_date,price_end_date,total_person,active} = req.query
  var {cate_id,search} = req.query

  var {orderby='createdAt' ,op='desc'} = req.query;
  try{

    var where = {deleted : 0}
    var where_date = {}
    var required_price = false;

    if(is_draft) where.is_draft = is_draft; 
    if(publish_status) where.publish_status = publish_status;
    if(is_boat !== undefined) where.is_boat = is_boat;

    if(active == 1){
      where.publish_status = 1;
      where.is_draft = 0;
      required_price= true;
      // where_date[Op.and] = [
      //   {start_date : {[Op.lte] : now}  },
      //   {end_date : {[Op.gte] : now}  }
      // ]
    }
    if(search){
      where.name = {[Op.like] : `%${search}%` }
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

    
    const now = new Date();
    
    
    if(price_today == 1){
      where_date[Op.and] = [
        {start_date : {[Op.lte] : now}  },
        {end_date : {[Op.gte] : now}  }
      ]
    }
    var where_price_detail ={}
    if(price_start_date && price_end_date){
      where_date[Op.or] = [
        {[Op.and] : [{start_date : {[Op.lte] : price_start_date}  },{end_date : {[Op.gte] : price_start_date}  } ]},
        {[Op.and] : [{start_date : {[Op.lte] : price_end_date}  },{end_date : {[Op.gte] : price_end_date}  } ]},
      ]
      required_price = true;

    }
    // if(total_person){
    //   where_price_detail.range_start = {[Op.and] : [{[Op.lte] : total_person} ,{[Op.gte] : total_person}] }
    // }

    var where_boat = {}

    
    if(cate_id){
      where_boat.cate_id = cate_id
    }


    const price_include = [
      {model : PriceCompanyType , include : [
        {model : PriceDateDetail}
      ]}
    ]
    const boat_include = [
      {model : Boat,required:true ,where : where_boat,/*  include : [{model : BoatCategory ,attributes :['cate_id'],where:where_cate,required:true}] */}
    ]

    
    const include = [
      {model : PriceDate ,include :price_include,where : where_date,required:required_price },
      // {model : ProductImage , attributes:['id','image','type','order']},
      // {model : Event},
      {model : ProductBoat, include : boat_include/* ,required:true */ },
      {model : ProductCategory},
      {model : Location , as :'pickup' },
      // {model : Review ,separate: true, attributes :  [[sequelize.fn('AVG', sequelize.col('rating')),'rating']]}
    ]

    // if(cate_id){
    //   include.push({model : ProductBoat, include : boat_include,required:true })
    // }

    // console.log(Object.keys(Product.rawAttributes))
    const attributes = {
      include : [...Object.keys(Product.rawAttributes),[sequelize.literal(review_sql),'rating'],[sequelize.literal(review_count_sql),'review_count']],
      exclude : ['meta_title','meta_description','meta_keyword','meta_image']
    }

    const products = await Product.findAndCountAll({...options,include,attributes,distinct:true/* ,logging:console.log */})
    res.json(products)
  }
  catch(err){
    next(err);
  }
}

exports.getOne = async(req,res,next)=>{
  const id = req.params.id
  try{
    const price_include = [
      {model : PriceCompanyType , include : [PriceDateDetail,CompanyType]}
    ]
    const boat_include = [
      {model : Boat ,/*  include : [{model : BoatCategory ,attributes :['cate_id'],where:where_cate,required:true}] */}
    ]
    const include = [
      {model : PriceDate ,include :price_include},
      {model : ProductImage , attributes:['id','image','type','order']},
      {model : Event},
      {model : ProductAddon},
      {model : ProductBoat,include : boat_include},
      {model : ProductCategory},
      {model : Location , as :'pickup' },
    ]

    var where = {id,deleted : 0}
    var order =  [
      [ProductImage, 'order', 'asc'],
      [PriceDate ,'start_date','asc']
    ]
    const attributes = [...Object.keys(Product.rawAttributes),[sequelize.literal(review_sql),'rating'],[sequelize.literal(review_count_sql),'review_count']]
    const product = await Product.findOne({where,include,order,attributes})
    res.json(product)
  }
  catch(err){
    next(err);
  }
}

exports.create = async(req,res,next)=>{
  var data = req.body;
  var {method = 'draft',price_date_list,events,addons} = data;
  var files = req.files || {}
  console.log('data',data)
  console.log('files',files)
  var transaction;
  var images_urls = []
  try{
    images_urls = await handleProductImages(files)
    if(files.picture && files.picture.name){
      //console.log(req.files);
      let file = files.picture;
      let fileName = await tools.moveFileWithPath(file,'images')
      data.picture = tools.genFileUrl(fileName,'images')
    }
    if(files.meta_image && files.meta_image.name){
      //console.log(req.files);
      let file = files.meta_image;
      let fileName = await tools.moveFileWithPath(file,'images')
      data.meta_image = tools.genFileUrl(fileName,'images')
    }
    transaction = await sequelize.transaction()

    data.equal_draft = method === 'publish' ? 1 : 0;
    data.publish_status = method === 'publish' ? 1 : 0;

    const product_draft = await createProduct({isDraft : true,data,images_urls,
      events,price_date_list,transaction,files,addons
    })
    if(method === 'publish'){
      
      await createProduct({isDraft : false,data,images_urls,events,
        price_date_list,transaction,draft_ref :product_draft.id, files,addons
      })
    }


    await transaction.commit()
    res.json({success:true,product_id : product_draft.id})
  }
  catch(err){
    next(err);
    if(transaction) await transaction.rollback()
  }
}

exports.update = async(req,res,next)=>{
  const id = req.params.id
  const product_id = id;
  var data = req.body;
  var {method = 'draft',price_date_list,images_order,images_deleted,events,boat_id,addons} = data;
  var files = req.files || {}
  var images_urls = []
  var transaction;
  console.log(data)
  console.log('files',files)
  try{
    images_urls = await handleProductImages(files)

    if(files.picture && files.picture.name){
      //console.log(req.files);
      let file = files.picture;
      let fileName = await tools.moveFileWithPath(file,'images')
      data.picture = tools.genFileUrl(fileName,'images')
    }

    if(files.meta_image && files.meta_image.name){
      //console.log(req.files);
      let file = files.meta_image;
      let fileName = await tools.moveFileWithPath(file,'images')
      data.meta_image = tools.genFileUrl(fileName,'images')
    }
    const pkg = await Product.findOne({where : {id},raw:true})
    var product_boats = await ProductBoat.findAll({where : {product_id},attributes:{exclude:['id'] },raw:true}) 
    product_boats = product_boats.map(val => ({...val,id:undefined}))
    

    var pkg_live = method === 'publish' ? await Product.findOne({where : {draft_ref : id}}) : null

    transaction = await sequelize.transaction()
    let task = [];

    if(price_date_list){
      await clearPriceData(id,transaction)
      await createPriceData(price_date_list,id,transaction)
    }

    if(events){
      await clearEvents(id,transaction)
      await createEvents(events,id,files,transaction)
    }
    if(addons){
      await clearAddons(id,transaction)
      await createAddons(addons,id,transaction)
    }
    var new_boats = [...product_boats]
    
    if(boat_id){
      const checkIndex = product_boats.findIndex(val => val.boat_id == boat_id)
      if(checkIndex === -1){
        task.push(ProductBoat.destroy({where : {product_id},transaction}))
        task.push(ProductBoat.create({product_id,boat_id},{transaction}))
        new_boats = [{product_id,boat_id}]
        // new_boats.push({product_id,boat_id})
      }
      // else{
      //   new_boats.splice(checkIndex,1)
      // }
    }


    if(images_order){
      images_order = JSON.parse(images_order);
      let sub_task = [];
      for(const im of images_order){
        sub_task.push(ProductImage.update({order : im.order},{where : {id : im.id},transaction}))
      }
      await Promise.all(sub_task)
    }
    if(images_deleted){
      images_deleted = JSON.parse(images_deleted);
      await ProductImage.destroy({where : {id :images_deleted },transaction})
      // task.push(ProductImage.destroy({where : {id :images_deleted },transaction}))
    }

    // console.log(images_urls)
    if(images_urls.length){
      var images_data = images_urls.map(val => ({...val,product_id}) )
      await ProductImage.bulkCreate(images_data,{transaction})
      // task.push(ProductImage.bulkCreate(images_data,{transaction}))
    }

    data.equal_draft = 0;
    // data.publish_status = method === 'publish' ? 1 : 0;

    if(method === 'publish'){
      var prep = {
        ...pkg,
        ...data,
        equal_draft : 1,
        publish_status : 1,
        id : null
      }
      data.equal_draft = 1;
      // data.publish_status = 1;
      if(!pkg_live){
        pkg_live = await createProduct({isDraft:false,data : prep,price_date_list,transaction,draft_ref:id})
        // console.log('prep',prep)
      }
      else {
        // console.log('ttttt')
        if(!data.picture){
          data.picture = pkg.picture
        }

        task.push(Product.update(data,{where : {draft_ref : id},transaction}))
        await clearPriceData(pkg_live.id,transaction)
        await clearEvents(pkg_live.id,transaction)
        await clearAddons(pkg_live.id,transaction)
        await ProductBoat.destroy({where : {product_id  :pkg_live.id},transaction,logging:console.log})
        task.push(createPriceData(price_date_list,pkg_live.id,transaction))
        task.push(createEvents(events,pkg_live.id,files,transaction))
        task.push(createAddons(addons,pkg_live.id,transaction))
        console.log(new_boats.map(val => ({...val,product_id : pkg_live.id})))
        task.push(ProductBoat.bulkCreate(new_boats.map(val => ({...val,product_id : pkg_live.id})),{transaction}))
      }
      const live_id = pkg_live.id
      var draft_images = await ProductImage.findAll({where : {product_id : id},attributes:['image','order','type'],transaction,raw:true})
      draft_images = draft_images.map(val => ({...val,product_id : live_id}) )
      // console.log(draft_images)

      
      task.push(clearImages(live_id,transaction))
      task.push(ProductImage.bulkCreate(draft_images,{transaction}))
    }



    await Promise.all(task)

    await Product.update(data,{where : {id},transaction})
    await transaction.commit()

    // throw new Error();
    res.json({success:true})
  }
  catch(err){
    next(err)
    if(transaction) await transaction.rollback()
  }
}

exports.updatePublishStatus = async(req,res,next)=>{
  var {id,publish_status} = req.body;
  var transaction;
  console.log('updatePublishStatus',req.body)
  try{
    if(!publish_status && publish_status !== 0 || !id){
      throw new DefaultError(errors.FILEDS_INCOMPLETE);
    }

    const product = await Product.findOne({where :{id}});
    if(!product){
      throw new DefaultError(errors.NOT_FOUND);
    }

    transaction = await sequelize.transaction()
    var equal_draft = product.equal_draft;
    if(publish_status == 1){
      equal_draft = 1;
      const pkg_live = await Product.findOne({where : {draft_ref : id},transaction});

      if(!pkg_live){
        // throw new DefaultError(errors.NOT_PUBLISHED);
        await copyProduct({draft_id:id,transaction})
      }
      else if(product.equal_draft !== 1){
        await equalizeProduct({draft_id:id,live_id:pkg_live.id,transaction})
      }
    }

    
    

    await Product.update({publish_status,equal_draft },{where : {[Op.or] : [{id },{draft_ref : id} ] },transaction})
    await transaction.commit()
    res.json({success:true})
  }
  catch(err){
    next(err);
    if(transaction) await transaction.rollback()
  }
}

exports.delete = async(req,res,next)=>{
  const id = req.params.id
  try{
    await Product.update({deleted : 1},{where : {id}})
    await Product.update({deleted : 1},{where : {draft_ref : id}})
    res.json({success:true})
  }
  catch(err){
    next(err);
  }
}



exports.duplicateProduct = async(req,res,next)=>{
  var {product_id} = req.body;
  var transaction;
  try{
    if(!product_id){
      throw new DefaultError(errors.FILEDS_INCOMPLETE);
    }
    transaction = await sequelize.transaction()
    await copyProduct({draft_id:product_id,isNew:true,transaction})
    await transaction.commit()
    res.json({success:true})
  }
  catch(err){
    next(err);
    if(transaction) await transaction.rollback()
  }
}


exports.getRelatedProduct = async(req,res,next)=>{
  var {limit=12} = req.query 
  const product_id = req.params.id
  try{

    const pb = await ProductBoat.findOne({where : { product_id},include :  [{model : Boat , required:true}]})
    var data = []
    if(pb){
      var where = {deleted : 0,is_draft:0,publish_status : 1,id : {[Op.ne] : product_id}}
      var where_date = {}


      const now = new Date();
      // Query for today price
      where_date[Op.and] = [
        {start_date : {[Op.lte] : now}  },
        {end_date : {[Op.gte] : now}  }
      ]

      const price_include = [
        {model : PriceCompanyType , include : [
          {model : PriceDateDetail}
        ]}
      ]
      const boat_include = [
        {model : Boat,required:true ,where : {company : pb.boat.company},}
      ]
  
      
      const include = [
        {model : PriceDate ,include :price_include,where : where_date,required:true },
        // {model : ProductImage , attributes:['id','image','type','order']},
        // {model : Event},
        {model : ProductBoat, include : boat_include/* ,required:true */ },
        {model : ProductCategory},
        {model : Location , as :'pickup' },
        // {model : Review ,separate: true, attributes :  [[sequelize.fn('AVG', sequelize.col('rating')),'rating']]}
      ]

      if(!isNaN(limit)) limit = parseInt(limit)

      const attributes = {
        include : [...Object.keys(Product.rawAttributes),[sequelize.literal(review_sql),'rating'],[sequelize.literal(review_count_sql),'review_count']],
        exclude : ['meta_title','meta_description','meta_keyword','meta_image']
      }

      data = await Product.findAll({where , include ,limit,attributes})
    }
    res.json(data)
  }
  catch(err){
    next(err);
  }
}

async function handleProductImages (files){
  var images_urls = []
  if(files.images){
    var images = files.images
    if(!Array.isArray(files.images))  images = [images]
    images = images.filter(val => val.name)
    for(const file of images){
      let fileName = await tools.moveFileWithPath(file,'images')
      if(fileName) images_urls.push({image : tools.genFileUrl(fileName,'images'),type:'gallery'})
    }
  }
  if(files.banners){
    var images = files.banners
    if(!Array.isArray(files.banners))  images = [images]
    images = images.filter(val => val.name)
    for(const file of images){
      let fileName = await tools.moveFileWithPath(file,'images')
      if(fileName) images_urls.push({image : tools.genFileUrl(fileName,'images'),type:'banner'})
    }
  }
  return images_urls;
}

exports.createProduct = createProduct;
async function createProduct({isDraft,data,images_urls,events,addons,price_date_list,transaction,draft_ref,files}){
    var _data ={...data}
    const {boat_id} = _data;
    if(!isDraft){
      _data.is_draft = 0
      _data.draft_ref = draft_ref;
    }
    else{
      _data.is_draft = 1
    }

    const product = await Product.create(_data,{transaction})
    const product_id = product.id


    if(images_urls && images_urls.length){
      var images_data = images_urls.map(val => ({...val,product_id,id : null}) )
      await ProductImage.bulkCreate(images_data,{transaction})
    }

    if(boat_id){
      await ProductBoat.create({product_id,boat_id},{transaction})
    }

    await createPriceData(price_date_list,product_id,transaction)
    await createEvents(events,product_id,files,transaction)
    await createAddons(addons,product_id,transaction)

    return product
}


async function createPriceData (price_date_list,product_id,transaction) {
  if(price_date_list){
    if(typeof price_date_list === 'string') price_date_list = JSON.parse(price_date_list)
    var price_date_arr = price_date_list.map(val =>  ({...val,product_id}) )

    for(const date of  price_date_arr){
      const {pricing_type,user_type} = date
      const price_date = await PriceDate.create(date,{transaction} )
      const {id : price_date_id} = price_date;
      for(const ut of user_type){
        const ut_item = await PriceCompanyType.create({...ut,price_date_id,id:null},{transaction})
        const {id : price_company_type_id} = ut_item;
        var details = []
        const {tiers,company_type_id,tier_start} = ut;
        if(pricing_type === 'tier' ){
          
          details = tiers.map((val,i) => {
            const {number} = val;
            var range_start = i === 0 ? tier_start : parseInt(tiers[i-1].number) +1 ;
            var range_end = number;
            return {...val,range_start,range_end,price_date_id,price_company_type_id,company_type_id,id : null}
          })
        }
        else{
          const {price_list} = ut;
          details = price_list.map((val,i) => {
            return {...val,price_date_id,price_company_type_id,company_type_id,id : null}
          })
        }
        let task = [];
        for(const item of details){
          task.push(PriceDateDetail.create(item,{transaction}))
          await tools.delay(20)
        }
        await Promise.all(task)
      }
      
    }
  }
}

async function createEvents(events,product_id,files,transaction){
  if(!events) return;
  if(typeof events === 'string')
    events = JSON.parse(events)

  for(let i = 0 ; i < events.length && files  ; i++){
    var img_name = 'event_img'+i;
    if(files[img_name] && files[img_name].name ){
      
      let file = files[img_name];
      let fileName = await tools.moveFileWithPath(file,'images')
      if(fileName) events[i].image = tools.genFileUrl(fileName,'images');
    }
  }
  
  events = events.map((val,index) => {

    return {...val,product_id,id:null}
  })
  let task = []
  for(const item of events){
    task.push(Event.create(item,{transaction}))
    await tools.delay(20)
  }
  await Promise.all(task)
  // await Event.bulkCreate(events,{transaction})
}

async function createAddons(addons,product_id,transaction){
  if(!addons) return;
  if(typeof addons === 'string')
    addons = JSON.parse(addons)
  
  addons = addons.map((val) => {

    return {...val,product_id,id:null}
  })
  let task = []
  for(const item of addons){
    task.push(ProductAddon.create(item,{transaction}))
    await tools.delay(20)
  }
  await Promise.all(task)
}

async function clearEvents(product_id,transaction){
  await Event.destroy({where : {product_id},transaction})
}

async function clearAddons(product_id,transaction){
  await ProductAddon.destroy({where : {product_id},transaction})
}

async function clearPriceData(product_id,transaction){
  const price_dates = await PriceDate.findAll({where : {product_id},transaction,raw:true})
  const date_ids = price_dates.map(val => val.id)
  return Promise.all([
    PriceDate.destroy({where : {product_id},transaction}),
    PriceCompanyType.destroy({where : {price_date_id :date_ids },transaction}),
    PriceDateDetail.destroy({where : {price_date_id :date_ids },transaction})
  ])
}

async function clearImages(product_id,transaction){
  return ProductImage.destroy({where : {product_id},transaction})
}

async function copyPriceProduct(product_id,price_dates,transaction){
  for(const date of price_dates){
    const price_date = await PriceDate.create({...date.toJSON(),id:null,product_id},{transaction})
    const price_date_id = price_date.id
    const {price_company_types} = date
    for(const cp of price_company_types ){
      const cp_item = await PriceCompanyType.create({...cp.toJSON(),price_date_id,id : null},{transaction})
      const {price_date_details} = cp
      const detail = price_date_details.map(val => ({...val.toJSON(),price_company_type_id:cp_item.id,price_date_id,id:null}))
      
      let task = [];
      for(const item of detail){
        task.push(PriceDateDetail.create(item,{transaction}))
        await tools.delay(20)
      }
      await Promise.all(task)
    }
  }
}


async function copyProduct({draft_id,isNew=false,transaction}){
  const draft = await getOneProduct(draft_id,transaction)
  const {products_images,price_dates,products_boats} = draft;
  var {events,products_addons} = draft
  events = events.map(val => val.toJSON())
  products_addons = products_addons.map(val => val.toJSON())
  var boat_id = products_boats.map(val => val.boat_id)
  var data = {...draft.toJSON(),id:null,draft_ref : draft_id,equal_draft:1,boat_id}

  if(isNew){
    data.name = '(COPY) '+data.name;
    data.draft_ref = null;
    data.duplicate_ref = draft_id;
    data.equal_draft = 0;
    data.publish_status = 0;
    data.createdAt = null;
    data.updatedAt = null;
  }

  const new_product =  await createProduct({isDraft:isNew,data,transaction,draft_ref: !isNew ? draft_id : null})
  const product_id = new_product.id
  var task = [];
  if(products_images.length)
    task.push(ProductImage.bulkCreate(products_images.map(val => ({...val.toJSON(),product_id})),{transaction}))
  
  await Promise.all(task)
  await copyPriceProduct(product_id,price_dates,transaction)
  await createEvents(events,product_id,null,transaction)
  await createAddons(products_addons,product_id,transaction)
}

async function equalizeProduct({draft_id,live_id,transaction}){
  const product_id = live_id;
  const draft = await getOneProduct(draft_id,transaction)
  const {products_images,price_dates} = draft;
  var {events,products_boats,products_addons} = draft
  events = events.map(val => val.toJSON())
  products_addons = products_addons.map(val => val.toJSON())
  products_boats = products_boats.map(val => ({...val.toJSON(),product_id}))
  var draft_images = products_images.map(val => ({...val.toJSON(),product_id : live_id,id:null}) )
  // console.log(price_dates)
  var task = [];
  task.push(clearImages(live_id,transaction))
  if(draft_images.length){
    task.push(ProductImage.bulkCreate(draft_images,{transaction}))
  }

  var data = {...draft.toJSON(),id:undefined,is_draft:0,draft_ref : draft_id,equal_draft:1}
  task.push(Product.update(data,{where : {id : product_id},transaction}))
  
  task.push(clearPriceData(live_id,transaction))
  task.push(clearEvents(live_id,transaction))
  task.push(clearAddons(product_id,transaction))
  task.push(ProductBoat.destroy({where : {product_id},transaction}))

  await Promise.all(task)
  await copyPriceProduct(product_id,price_dates,transaction)
  await createEvents(events,live_id,null,transaction)
  await createAddons(products_addons,product_id,transaction)
  await ProductBoat.bulkCreate(products_boats,{transaction})
}
exports.getOneProduct = getOneProduct;
async function getOneProduct(product_id,transaction){
  const price_include = [
    {model : PriceCompanyType , include : [PriceDateDetail]}
  ]
  const include = [
    {model : PriceDate ,include :price_include, attributes:{exclude : ['id']}},
    {model : ProductImage , attributes:{exclude : ['id']}},
    {model : Event},
    {model : ProductBoat , attributes:{exclude : ['id']},include : [Boat]},
    {model : ProductAddon}
  ]
  const draft = await Product.findOne({where : {id : product_id},include,transaction})

  return draft;
}