const jwt = require('jsonwebtoken');

const db = require('../db')
const {User} = db
const bcrypt = require('bcrypt');
const saltRounds = 11;
const tools = require('../helper/tools')
const errors = require('../errors')
const {DefaultError} = errors
const {Op} = require('sequelize');
const  async =  require('async') ;
const { CompanyType } = require('../db');

exports.index = async(req,res,next)=>{
    var {page,limit,user_type,approve_status,search} = req.query;
    // console.log(req.query.user_type)
    try{
        // console.log(req.cookies)
        var where ={}

        if(search){
            var or = []
            or.push({username : {[Op.like] : '%'+search+'%' } })
            where[Op.or] = or
            // where[Op.or].push({email : {[Op.like] : '%'+search+'%' } })
        }
        if(user_type) where.user_type = user_type;
        if(approve_status) where.approve_status = approve_status;


        const include = [
            {model : CompanyType}
        ]

        var order = [['license_expired_date','asc']]


        var options = {where,attributes: {exclude: ['password']},order,include}

        if(!isNaN(page) && page > 1){
            options.offset = (page-1)*limit;
            
            options.limit = limit;
        }
        if(!isNaN(limit)){
            options.limit = parseInt(limit);
        }

        

        const users = await User.findAndCountAll(options )
        res.json(users)
    }
    catch(err){
        next(err);
    }
}

exports.getOne = async(req,res,next)=>{
    var id = req.params.id
    var {with_around} = req.query;
    try{
        // var options = {attributes: {exclude: ['password']}}

        const include = [
            {model : CompanyType}
        ]

        const user = await User.findOne({where :{id},attributes: {exclude: ['password']},include })

        if(!user){
            throw new DefaultError(errors.NOT_FOUND);
        }

        var data = {...user.toJSON()}

        if(with_around == 1){
            const [_prev,_next] = await Promise.all([
                User.findOne({where : {approve_status : 0,user_type:'partner',createdAt : { [Op.lt] : user.createdAt} } ,
                    order: [['createdAt','desc']] , attributes:['id']

                }),
                User.findOne({where : {approve_status : 0,user_type:'partner',createdAt : { [Op.gt] : user.createdAt} } ,
                    order: [['createdAt','asc']] , attributes:['id']
                }),
            ])

            data.prev_id = _prev ? _prev.id : null
            data.next_id = _next ? _next.id : null
        }

        res.json(data)
    }
    catch(err){
        next(err);
    }
}

exports.login = async(req,res,next)=>{
    var data = req.body;
    var {username,password} = data;
    try{
        if(!username || !password){
            throw new DefaultError(errors.FILEDS_INCOMPLETE);
        }

        const user = await User.findOne({where : { username}})

        if(!user){
            throw new DefaultError(errors.INVALID_EMAIL);
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            throw new DefaultError(errors.INVALID_PASSWORD);
        }
        if(user.approve_status == 0){
            throw new DefaultError(errors.PENDING_APPROVE);
        }
        if(user.approve_status == 2){
            throw new DefaultError(errors.NOT_APPROVE);
        }

        const token = generateToken(user)
        res.json({success :true , token ,user_id : user.id})

    }
    catch(err){
        next(err);
    }
}



exports.register = async(req,res,next)=>{
    var data = req.body;
    var {id,username,password,company_type,user_type,company_name_en} = data;
    var files = req.files || {}
    // var image_logo,image_license;
    try{
        
        if(files.image_logo && files.image_logo.name){
            //console.log(req.files);
            let file = files.image_logo;
            let fileName = await tools.moveFileWithPath(file,'images')
            data.image_logo = tools.genFileUrl(fileName,'images')
        }
        if(files.image_license && files.image_license.name){
            let file = files.image_license;
            let fileName = await tools.moveFileWithPath(file,'images')
            data.image_license = tools.genFileUrl(fileName,'images')
        }

        if(!username || !password || !user_type ){
            throw new DefaultError(errors.FILEDS_INCOMPLETE);
        }

        if(await checkEmail(username)){
            throw new DefaultError(errors.DUPLICATED_EMAIL);
        }

        if(user_type === 'fit'){
            data.id = await tools.genUserId(user_type)
            data.approve_status = 1;
        }


        if(id && !(await tools.isValidUserId(id))){
            throw new DefaultError(errors.DUPLICATED_EMAIL);
        }
        
        const hash = await bcrypt.hash(password, saltRounds)

        data.password = hash

        const user = await User.create(data)

        res.json({success:true})
    }
    catch(err){
        next(err);
    }
}

exports.loginFacebook = async(req,res,next)=>{
    var _user = req.user;
    try{

    }
    catch(err){
        next(err);
    }
}

// bcrypt.hash('123456', saltRounds).then(result => console.log(result))



exports.profile = async(req,res,next)=>{
    const user = req.user;
    try{
        const include = [
            {model : CompanyType}
        ]
        const _user = await User.findOne({where : { id : user.id},attributes: {exclude: ['password']},include })
        res.json(_user)
    }
    catch(err){
        next(err);
    }
}

exports.updateProfile = async(req,res,next) => {
    var data= req.body;
    const actor = req.user
    data.id = actor.id
    var files = req.files || {}
    try{
        await updateUser(actor,data,files)
        res.json({success:true})
    }
    catch(err){
        next(err);
    }
}



exports.update = async(req,res,next)=>{
    var data= req.body;
    const actor = req.user
    console.log('data',data)
    var id = req.params.id
    try{
        data.id = id;
        const addt =  await updateUser(actor,data)

        var response_data = {success:true}
        if(addt) response_data = {...response_data,...addt}
        res.json(response_data)
    }
    catch(err){
        next(err);
    }
}

exports.delete = async(req,res,next)=>{
    var id = req.params.id
    try{
        await User.destroy({where :{ id}})
        res.json({success:true})
    }
    catch(err){
        next(err);
    }
}





exports.checkEmail = async(req,res,next)=>{
    const {email} = req.body;
    try{
        if(!email){
            throw new DefaultError(errors.FILEDS_INCOMPLETE);
        }

        const found = await checkEmail(email)

        res.json({duplicated : !!found })
    }
    catch(err){
        next(err);
    }
}
// var q = async.queue(function(task, callback) {
//     task.do(...task.val).then(res => callback(null,res)).catch(err => callback(err))
// }, 1);

exports.genUserId = async(req,res,next)=>{
    //type is company_id
    var {company_type_id='fit',company_name_en} = req.body;
    console.log(req.body)
    try{
        if(!company_type_id ){
            throw new DefaultError(errors.FILEDS_INCOMPLETE);
        }
        

        const id = await tools.genUserId(company_type_id,company_name_en)

        // const task= {do : tools.genUserId,val : [company_type_id,company_name_en] }
        // const id = await new Promise((resolve,reject)=>{
        //     q.push(task, (err,result) => {
        //         if(err) return reject(err)
        //         resolve(result)
        //     });
        // })

        res.json({id  })
    }
    catch(err){
        next(err);
    }
}



async function updateUser  (actor,data,files={}){
    var {id,password,approve_status,license_expired_date,with_next} = data;

    if(!id){
        throw new DefaultError(errors.FILEDS_INCOMPLETE);
    }

    delete data.id;
    delete data.username

    if(files.image_logo && files.image_logo.name){
        //console.log(req.files);
        let file = files.image_logo;
        let fileName = await tools.moveFileWithPath(file,'images')
        data.image_logo = tools.genFileUrl(fileName,'images')
    }
    if(files.image_license && files.image_license.name){
        let file = files.image_license;
        let fileName = await tools.moveFileWithPath(file,'images')
        data.image_license = tools.genFileUrl(fileName,'images')
    }

    if(password){
        data.password = await bcrypt.hash(password, saltRounds)
    }
    else{
        delete data.password
    }
    const user = await User.findOne({where : {id}})

    if(!user){
        throw new DefaultError(errors.NOT_FOUND);
    }

    const now = new Date();
    if(approve_status == 1){
        if(actor.type === 'admin'){
            data.approve_date = now;
            data.approve_by = actor.username || actor.id
        }
        else {
            //if users try to approve themself
            throw new DefaultError(errors.PERMISSION_ERROR);
        }
    }
    else if(approve_status == 2){
        data.problem_date = now;
        data.problem_by = actor.username || actor.id;
    }



    //Check user can't update other users
    if(actor.type === 'user' && user.id !== actor.id){
        throw new DefaultError(errors.PERMISSION_ERROR);
    }

    if(license_expired_date){
        data.license_expired_date = new Date(license_expired_date)
    }

    if(actor.type === 'admin'){
        data.updated_by_admin_date = now;
        data.updated_by_admin = actor.username || actor.id
        
    }


    var addt = {next_id : null};
    if(with_next == 1){
        const next_user = await User.findOne({where : { 
            approve_status : 0,user_type:'partner',id : {[Op.ne] : user.id}
        }
        ,attributes:['id']})

        if(next_user) addt = {next_id : next_user.id}
    }


    await User.update(data,{where : { id}});
    return addt
}


async function checkEmail (email){
    const user = await User.findOne({where : {email },attributes : ['email']})
    return !!user
}

function generateToken(user){
    // console.log('generating token user  :'+user.id);
    return jwt.sign({ id: user.id, email: user.email,user_type : user.user_type,type:'user'}, process.env.USER_SECRET_KEY );
    //return token = jwt.sign({ id: user.id, email: user.email}, config.SECRET_KEY, { expiresIn: config.token_expire });
}

