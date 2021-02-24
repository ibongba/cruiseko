const {sequelize,Product,RecommendCate,RecommendProduct,PriceCompanyType,
PriceDateDetail,Boat,PriceDate,ProductBoat,ProductCategory,Location} = require('../db')
const errors = require('../errors')
const {DefaultError} = errors
const {Op} = require('sequelize')

const review_sql = '(select avg(rating) as rating from review where product_id = rec_products.product_id and deleted = 0 and status = 1)'
const review_count_sql = '(select count(product_id) as rating from review where product_id = rec_products.product_id and deleted = 0 and status = 1)'

exports.getAllCate = async(req,res,next)=>{
  try{
      const cates = await RecommendCate.findAll();
      res.json(cates)
  }
  catch(err){
      next(err);
  }
}

exports.getOneCate = async(req,res,next)=>{
  const key = req.params.key
  try{
      const cate = await RecommendCate.findOne({where : {key}});
      res.json(cate)
  }
  catch(err){
      next(err);
  }
}

exports.createCate = async(req,res,next)=>{
  var data = req.body;
  var {} = data;
  try{
    await RecommendCate.create(data)
    res.json({success:true})
  }
  catch(err){
    next(err);
  }
}

exports.updateCate = async(req,res,next)=>{
  const key = req.params.key
  var data = req.body;
  try{
    await RecommendCate.update(data,{where : {key}})
    res.json({success:true})
  }
  catch(err){
    next(err)
  }
}

exports.deleteCate = async(req,res,next)=>{
  const key = req.params.key
  try{
    await RecommendCate.destroy({where : {key}})
    await RecommendProduct.destroy({where : {cate_key : key}})
    res.json({success:true})
  }
  catch(err){
    next(err)
  }
}

exports.getAllProduct = async(req,res,next)=>{
  // const cate_key = req.params.key
  var {page=1,limit,no_limit,cate_key,exclude_product_id,active,full_detail = 1} = req.query;
  var {orderby='order' ,op='asc'} = req.query;
  try{
    var where_product = {}
    var where_date = {}
    var required_price = false;

    if(active == 1){
      where_product.publish_status = 1;
      where_product.is_draft = 0;
      required_price= true;
    }

    
    const now = new Date();
    where_date[Op.and] = [
      {start_date : {[Op.lte] : now}  },
      {end_date : {[Op.gte] : now}  }
    ]


    const attributes = {
      include : [...Object.keys(RecommendProduct.rawAttributes),[sequelize.literal(review_sql),'rating'],[sequelize.literal(review_count_sql),'review_count']],
    }


    const price_include = [
      {model : PriceCompanyType , include : [
        {model : PriceDateDetail}
      ]}
    ]
    const boat_include = [
      {model : Boat,required:true }
    ]


    
    const product_include = [
      {model : PriceDate ,include :price_include,where : where_date,required:required_price },
      // {model : ProductImage , attributes:['id','image','type','order']},
      // {model : Event},
      {model : ProductBoat, include : boat_include},
      {model : ProductCategory},
      {model : Location , as :'pickup' },
      // {model : Review ,separate: true, attributes :  [[sequelize.fn('AVG', sequelize.col('rating')),'rating']]}
    ]
    const include = [
      {
        model : Product ,
        include : product_include,
        where : where_product, 
        required:true
      }
    ]

    
   

    var where = {}
    if(cate_key){
      where.cate_key = cate_key
    }

    if(exclude_product_id){
      if(!Array.isArray(exclude_product_id)) exclude_product_id = [exclude_product_id]
      where.product_id = {[Op.ne] : exclude_product_id}
    }

    var order = [[orderby,op]];

    

    var options = {where,include,order,distinct : true,attributes/* ,logging:console.log */}

    if(full_detail == 0){
      delete include[0].include
      delete options.attributes
    }

    // if(!isNaN(page) && page > 1){
    //   options.offset = (page-1)*limit;
      
    //   options.limit = limit;
    // }
    if(!isNaN(limit)){
        options.limit = parseInt(limit);
    }

    if(no_limit == 1){
      delete options.no_limit
    }



    const items = await RecommendProduct.findAndCountAll(options)

    res.json(items);

  }
  catch(err){
    next(err)
  }
}

exports.addProduct = async (req,res,next)=>{
  var {product_id,cate_key} = req.body;
  try{
    if(!product_id || !cate_key){
      throw new DefaultError(errors.FILEDS_INCOMPLETE);
    }

    if(await RecommendProduct.findOne({where : {product_id,cate_key}}) ){
      throw new DefaultError(errors.DUPLICATED_EMAIL);
    }

    await RecommendProduct.create({product_id,cate_key})
    res.json({success:true})
  }
  catch(err){
    next(err);
  }
}

exports.deleteProduct = async (req,res,next)=>{
  const id = req.params.id
  try{
    await RecommendProduct.destroy({where : { id}})
    res.json({success:true})
  }
  catch(err){
    next(err);
  }
}

exports.updateProductOrder = async(req,res,next)=>{
  let {orders} = req.body;
  try{
    if(!orders){
      throw new DefaultError(errors.FILEDS_INCOMPLETE);
    }
    let task = []
    orders.forEach((val)=>{
        task.push(RecommendProduct.update({order : val.order },{where : {id : val.id}}))
    } )
    await Promise.all(task);
    res.json({success:true})
  }
  catch(err){
      next(err);
  }
}