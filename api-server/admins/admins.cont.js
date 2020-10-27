const jwt = require('jsonwebtoken');

const db = require('../db')
const {Admin,Role,RoleHasPermission,Permission} = db
const bcrypt = require('bcrypt');
const saltRounds = 11;
const errors = require('../errors')
const tools = require('../helper/tools');
const { Op } = require('sequelize/types');
const {DefaultError} = errors


exports.getAll = async(req,res,next)=>{
    var {page=1,limit=30,search} = req.query;
    // console.log(req.query.user_type)
    try{
        // console.log(req.cookies)
        var where ={[Op.or] : []}

        if(search){
            where[Op.or].push({username : {[Op.like] : '%'+search+'%' } })
            where[Op.or].push({email : {[Op.like] : '%'+search+'%' } })
        }
        // if(user_type) where.user_type = user_type;
        // if(accept_status) where.accept_status = accept_status;
        var options = {where,attributes: {exclude: ['password']}}
        if(!isNaN(page) && page !=0){
            if(parseInt(page) > 1)
                options.offset = (parseInt(page) -1)* parseInt(limit);
            
            options.limit = parseInt(limit);
        }
        if(!isNaN(limit)){
            options.limit = parseInt(limit);
        }
        const admins = await Admin.findAndCountAll(options )
        res.json(admins)
    }
    catch(err){
        next(err);
    }
}

exports.getOne = async(req,res,next)=>{

    var id = req.params.id
    try{
        // var options = {attributes: {exclude: ['password']}}
        const admin = await Admin.findOne({where :{id},attributes: {exclude: ['password']} })
        res.json(admin)
    }
    catch(err){
        next(err);
    }
}


exports.create = async(req,res,next)=>{
    var data = req.body;
    var {username,email,password} = data;
    try{
        if(!username || !email || !password){
            throw new DefaultError(errors.FILEDS_INCOMPLETE);
        }

        const [check_email,check_username] = await Promise.all([checkEmail(email),checkUsername(username) ])

        if(check_email){
            throw new DefaultError(errors.DUPLICATED_EMAIL);
        }
        if(check_username){
            throw new DefaultError(errors.DUPLICATED_USERNAME);
        }

        const hash = await bcrypt.hash(password, saltRounds)

        data.password = hash

        await Admin.create(data)

        res.json({success:true})

    }
    catch(err){
        next(err);
    }
}


exports.update = async(req,res,next)=>{
    var id = req.params.id
    var data = req.body;
    var {password} = data;
    try{
        if(password){
            data.password = await bcrypt.hash(password, saltRounds);
        }
        
        delete data.email
        delete data.username

        const user = await Admin.update(data,{where:{id}})
        res.json(user);
    }
    catch(err){
        next(err);
    }
}


exports.delete = async(req,res,next)=>{
    var id = req.params.id
    try{
        await Admin.destroy({where : { id}})
        res.json({success:true})
    }
    catch(err){
        next(err);
    }
}


// exports.getAll = async(req,res,next)=>{
//     try{

//     }
//     catch(err){
//         next(err);
//     }
// }


exports.getRole = async(req,res,next)=>{
    try{
        const roles = await Role.findAll();
        res.json(roles)
    }
    catch(err){
        next(err);
    }
  }
  
  exports.getRoleOne = async(req,res,next)=>{
    const id = req.params.id;
    try{
        const roles = await Role.findOne({where:{id},include:[RoleHasPermission]});
        res.json(roles)
    }
    catch(err){
        next(err);
    }
  }
  
  exports.createRole = async(req,res,next)=>{
    const {name,permission} = req.body;
    // console.log(permission);
    try{

        const roles = await Role.create({name});
        const {id} = roles
        let role_id = id
        for (const item of permission) {
           await RoleHasPermission.create({role_id,permission_id:item})
        }
        res.json({});
    }
    catch(err){
        next(err);
    }
  }
  
  
exports.updateRole = async(req,res,next)=>{
    const {id,name,permission} = req.body;
    // let task=[]
    try{
        // console.log('id', id)
        await Role.update({name},{where:{id}})
        // task.push(roles)
        await RoleHasPermission.destroy({where:{role_id:id}})
        // task.push(rolesPermission)
        for (const item of permission) {
            await RoleHasPermission.create({role_id:id,permission_id:item})
        }
        res.json({});
    }
    catch(err){
        next(err);
    }
}
  
exports.delRole = async(req,res,next)=>{
    const id = req.params.id;
    try{
        await Role.destroy({where:{id}})
        request.ok(res);
    }
    catch(err){
        next(err);
    }
}


exports.getPermission = async(req,res,next)=>{
    try{
        const permissions = await Permission.findAll();
        res.json(permissions)
    }
    catch(err){
        next(err);
    }
}
  
exports.getPermissionOne = async(req,res,next)=>{
    const id = req.params.id;
    try{
        const permissions = await Permission.findOne({where:{id}});
        res.json(permissions)
    }
    catch(err){
        next(err);
    }
}
  
exports.createPermission = async(req,res,next)=>{
    const data = req.body;
    // console.log(data);
    try{
        const permissions = await Permission.create(data);
        res.json(permissions);
    }
    catch(err){
        next(err);
    }
}
  
  
exports.updatePermission = async(req,res,next)=>{
    const data = req.body;
    const id = data.id;
    try{
        const permissions = await Permission.update(data,{where:{id}})
        res.json(permissions);
    }
    catch(err){
        next(err);
    }
}
  
exports.delPermission = async(req,res,next)=>{
    const id = req.params.id;
    try{
        await Permission.destroy({where:{id}})
        request.ok(res);
    }
    catch(err){
        next(err);
    }
}


async function checkEmail (email){
    const admin = await Admin.findOne({where : {email },attributes : ['email']})
    return !!admin
}
async function checkUsername (username){
    const admin = await Admin.findOne({where : {username },attributes : ['username']})
    return !!admin
}