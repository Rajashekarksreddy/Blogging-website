        const AuthorModel = require('../Models/AuthorModel')
        const validator = require('../Utils/Validation')
        const jwt = require('jsonwebtoken')

        const createAuthor = async function(req,res){
        let requestBody = req.body

        if(!validator.isValidRequestBody(requestBody)){
          return res.status(400).send({status:false, message:"request body is empty please provide author details"})
        }

        let {firstname,lastname,title,email,password} = requestBody

        if(!validator.isValid(firstname)){
            return res.status(400).send({status:false, message:"please provide firstname in the req.body"})
        }
         
        if(!validator.isValid(lastname)){
            return res.status(400).send({status:false, message:'please provide lastname in the req.body'})
        }

        if(!validator.isValidTitle(title)){
            return res.status(400).send({status:false, message:'please provide valid title'})
        }

        if(!validator.isValidemail(email)){
            return res.status(400).send({status:false, message:'please provide valid email'})
        }

        if(!validator.isValid(password)){
            return res.status(400).send({status:false, message:'please provide valid password'})
        }

        let create = await AuthorModel.create(requestBody)
        return res.status(201).send({status:true, message:"successfully created author", data:create})
    }


    const loginAuthor = async function(req,res){

        const requestBody = req.body

        if(!validator.isValidRequestBody(requestBody)){
            return res.status(400).send({status:false, message:"invalid details, please provide login details"})
        }

        let {email, password} = requestBody


        if(!validator.isValid(email)){
          return res.status(400).send({status:false, message:"please provide valid email, for login"})
        }

        if(!validator.isValid(password)){
            return res.status(400).send({status:false, message:"password is mandatory is for login"})
        }

        
        const findAuthor = await AuthorModel.findOne({email, password})

        if(!findAuthor){
            return res.status(400).send({status:false, message:"please provide valid details for login"})
        }


        let token = jwt.sign({
            authorId: findAuthor._id,
            iat:Math.floor(Date.now() /1000),
            exp:Math.floor(Date.now()/1000) + 10 * 60 * 60
        },"uranium")

        res.header('x-api-key',token )

        return res.status(200).send({status:true, message:"author login successfully", data:{token}})


    }
    
    module.exports.createAuthor = createAuthor
    module.exports.loginAuthor = loginAuthor
    