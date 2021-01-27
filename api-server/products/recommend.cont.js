const {Product,RecommendCate,RecommendProduct} = require('../db')
const errors = require('../errors')
const {DefaultError} = errors
const {Op} = require('sequelize')

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
  var {page=1,limit=25,no_limit,cate_key,exclude_product_id} = req.query;
  var {orderby='createdAt' ,op='desc'} = req.query;
  try{
    const include = [
      {model : Product}
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
    var options = {where,include,order}

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
    request.ok(res);
  }
  catch(err){
      next(err);
  }
}