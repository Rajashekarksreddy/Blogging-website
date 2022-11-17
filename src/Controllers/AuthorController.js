        const AuthorModel = require('../Models/AuthorModel')
        const validator = require('../Utils/Validation')

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
    
    module.exports.createAuthor = createAuthor
    