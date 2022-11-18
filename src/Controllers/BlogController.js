const BlogModel = require('../Models/BlogModel')
const AuthorModel = require('../Models/AuthorModel')
const validator = require('../Utils/Validation')


const createBlog = async function(req,res){
    let requestBody = req.body
    let auth = requestBody.authorId


    if(!validator.isValid(requestBody)){
        return res.status(400).send({status:true, message:"please provide details in the request body"})
    }
    
    let {title, body, authorId,category,subcategory, tags} = requestBody

    if(!validator.isValid(title)){
     res.status(400).send({status:false, message:'please provide valid title'})
    }

    if(!validator.isValid(body)){
        return res.status(400).send({status:false, message:"please provide valid body"})
    }
    
    if(!validator.isValidObjectId(authorId)){
        return res.status(400).send({status:true, message:"please provide valid authorId"})
    }

    if(auth !== authorId){
        return res.status(400).send({status:false, message:'unauthorized access, authId doesnt match to authorId'})
    }
 
    if(!validator.isValid(category)){
        return res.status(400).send({status:true, message:'please provide valid category'})
    }

    const findId = await AuthorModel.findById(authorId)
    if(!findId){
        return res.status(400).send({status:true, message:'authorId not found in author model'})
    }

    let Blogdata = {
        title,
        body,
        authorId,
        category,
        subcategory,
        tags, 
    }

    if(Array.isArray(tags)){
        let tagArr = [... new Set(tags)]
        Blogdata['tags'] = tagArr
    }

    if(Array.isArray(subcategory)){
        let subCatArr = [... new Set(subcategory)]
        Blogdata['subcategory'] = subCatArr
    }
    
    const saveBlog = await BlogModel.create(Blogdata)
    if (saveBlog.isPublished) {
        saveBlog.publishedAt = new Date(Date.now())
        saveBlog.save()
      }
  
      //add deleted date if its deleted
      if (saveBlog.isDeleted) {
        saveBlog.deletedAt = new Date(Date.now())
        saveBlog.save()
      }
    return res.status(201).send({status:true, data:saveBlog})

}

module.exports.createBlog = createBlog