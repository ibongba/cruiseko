const {Boat,BoatCategory,BoatImage,sequelize} = require('../../db')
const tools = require('../../helper/tools')
const {createProduct} = require('../products.cont')
const errors = require('../../errors')
const {DefaultError} = errors

exports.getAll = async(req,res,next)=>{
  var {page=1,limit=25,no_limit} = req.query;
  var {orderby='createdAt' ,op='desc'} = req.query;
  try{
      const include = [
        {model : BoatImage , attributes : ['id','image']},
        {model : BoatCategory}
      ]
      var where = {deleted : 0}

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
        delete options.limit
      }
      const cates = await Boat.findAndCountAll(options);
      res.json(cates)
  }
  catch(err){
      next(err);
  }
}

exports.getOne = async(req,res,next)=>{
  const boat_id = req.params.id
  try{
      const include = [
        {model : BoatImage , attributes : ['id','image']},
        {model : BoatCategory}
      ]
      var where = {boat_id,deleted : 0}
      var options = {where,include}
      const cate = await Boat.findOne(options);
      res.json(cate)
  }
  catch(err){
      next(err);
  }
}

exports.create = async(req,res,next)=>{
  var data = req.body;
  var {name,cate_id,min_hr} = data;
  var files = req.files || {}
  var image_urls = []
  var transaction;
  try{

    if(!cate_id || !name){
      throw new DefaultError(errors.FILEDS_INCOMPLETE);
    }

    if(files.picture && files.picture.name){
      let file = files.picture;
      let fileName = await tools.moveFileWithPath(file,'images')
      data.picture = tools.genFileUrl(fileName,'images')
    }

    if(files.images){
      var images = files.images
      if(!Array.isArray(files.images))  images = [images]
      images = images.filter(val => val && val.name)
      for(const file of images){
        let fileName = await tools.moveFileWithPath(file,'images')
        if(fileName) image_urls.push(tools.genFileUrl(fileName,'images'))
      }
    }

    if(min_hr && parseInt(min_hr) % 30 !== 0 ){
      data.min_hr = parseInt(parseInt(value)  / 30) *30   ;
    }

    const boat_cate = await BoatCategory.findOne({where :{ cate_id},attributes:['type']})

    if(!boat_cate){
      throw new DefaultError(errors.INVALID_INPUT);
    }

    transaction = await sequelize.transaction()
    const boat = await Boat.create(data,{transaction})
    var task = [];
    for(const image of image_urls){
      task.push(BoatImage.create({boat_id : boat.boat_id , image},{transaction}) )
    }

    if(boat_cate.type === 'charter'){
      var pkg_data = {
        name,
        is_boat : 1,
        by_boat_id : boat.boat_id,
        boat_id : boat.boat_id,
        picture : data.picture
      }
      task.push(createProduct({isDraft:true,data:pkg_data,transaction}))
    }

    await Promise.all(task)
    await transaction.commit()
    
    res.json({success:true})
  }
  catch(err){
    next(err);
    if(transaction) await transaction.rollback()
  }
}

exports.update = async(req,res,next)=>{
  const boat_id = req.params.id
  var data = req.body;
  var {min_hr} = data;
  var files = req.files || {}
  var image_urls = []
  var transaction;
  try{
    const boat = await Boat.findOne({where : {boat_id}})
    if(!boat){
      throw new DefaultError(errors.NOT_FOUND)
    }
    if(files.picture && files.picture){
      let file = files.picture;
      let fileName = await tools.moveFileWithPath(file,'images')
      data.picture = tools.genFileUrl(fileName,'images')
    }

    if(min_hr && parseInt(min_hr) % 30 !== 0 ){
      data.min_hr = parseInt(parseInt(value)  / 30) *30   ;
    }

    transaction = await sequelize.transaction()
    await Boat.update(data,{where : {boat_id},transaction})
    await transaction.commit()
    res.json({success:true})
  }
  catch(err){
    next(err)
    if(transaction) await transaction.rollback()
  }
}

exports.delete = async(req,res,next)=>{
  const boat_id = req.params.id
  try{
    await Boat.update({deleted : 1},{where : {boat_id}})
    res.json({success:true})
  }
  catch(err){
    next(err)
  }
}


//Boat Image***************


exports.createImage = async(req,res,next)=>{
  // var data = req.body;
  // var {} = data;
  var {boat_id} = req.params
  var files = req.files || {}
  try{
    if(files.image && files.image.name){
      //console.log(req.files);
      let file = files.image;
      let fileName = await tools.moveFileWithPath(file,'images')
      data.image = tools.genFileUrl(fileName,'images')
    }
    data.boat_id = boat_id
    if(!data.image) {
      throw new DefaultError(errors.FILEDS_INCOMPLETE);
    }

    await BoatImage.create(data)
    res.json({success:true})
  }
  catch(err){
    next(err);
  }
}

exports.updateImage = async(req,res,next)=>{
  const {boat_id,id} = req.params
  var data = req.body;
  var files = req.files || {}
  try{
    if(files.image && files.image.name){
      //console.log(req.files);
      let file = files.image;
      let fileName = await tools.moveFileWithPath(file,'images')
      data.image = tools.genFileUrl(fileName,'images')
    }
    if(!data.image) {
      throw new DefaultError(errors.FILEDS_INCOMPLETE);
    }
    await BoatImage.update(data,{where : {boat_id , id}})
    res.json({success:true})
  }
  catch(err){
    next(err)
  }
}

exports.deleteImage = async(req,res,next)=>{
  const {boat_id,id} = req.params
  try{
    await BoatImage.destroy({where : {boat_id,id}})
    res.json({success:true})
  }
  catch(err){
    next(err)
  }
}