const {Boat,BoatCategory,BoatImage,sequelize} = require('../../db')
const tools = require('../../helper/tools')
const errors = require('../../errors')
const {DefaultError} = errors

exports.getAll = async(req,res,next)=>{
  try{
      const include = [
        {model : BoatImage , attributes : ['id','image']},
        {model : BoatCategory}
      ]
      var where = {deleted : 0}
      var options = {where,include}
      const cates = await Boat.findAll(options);
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
  var {} = data;
  var files = req.files || {}
  var image_urls = []
  var transaction;
  try{

    if(files.picture && files.picture){
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
    transaction = await sequelize.transaction()
    const boat = await Boat.create(data,{transaction})
    var task = [];
    for(const image of image_urls){
      task.push(BoatImage.create({boat_id : boat.boat_id , image},{transaction}) )
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
  var files = req.files || {}
  var image_urls = []
  var transaction;
  try{
    if(files.picture && files.picture){
      let file = files.picture;
      let fileName = await tools.moveFileWithPath(file,'images')
      data.picture = tools.genFileUrl(fileName,'images')
    }
    await Boat.update(data,{where : {boat_id}})
    res.json({success:true})
  }
  catch(err){
    next(err)
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