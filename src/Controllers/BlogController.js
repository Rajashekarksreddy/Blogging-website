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


let getBlogs = async function(req,res){

 let filterquery = {isDeleted:false, deletedAt:null, isPublished:true}
 let queryparams = req.query

 let {authorId, tags, category, subcategory} = queryparams

 if(!validator.isValidString(authorId)){
   return res.status(400).send({status:false, message:"authorId is not valid"})
 }

 if(!validator.isValidString(tags)){
    return res.status(400).send({status:false, message:"tags cannot be empty while fetching"})
 }

 if(!validator.isValidString(category)){
    return res.status(400).send({status:false, message:"category cannot be empty while category"})
 }

 if(!validator.isValidString(subcategory)){
    return res.status(400).send({status:false, message:"subcategory cannot be empty while fetching"})
 }


 if(validator.isValid(queryparams)){
    let {authorId, tags, category, subcategory} = queryparams


    if(validator.isValid(authorId) && validator.isValidObjectId(authorId)){
        filterquery['authorId'] = authorId
    }

    if(validator.isValid(category)){
     filterquery['category']=category
    }

    if(validator.isValid(tags)){
        let tagarr = tags
        .trim()
        .split(',')
        .map((x) => x.trim())
        filterquery['tags'] = tagarr
    }
    
    if(validator.isValid(subcategory)){
        let subcatarr = subcategory
        .trim()
        .split(',')
        .map((x) => x.trim())
        filterquery['subcategory'] = subcatarr
    }

    let blog = await BlogModel.find(filterquery)
  
    if(Array.isArray(blog) && blog.length === 0){
        return res.status(400).status({status:false, message:"no blogs found"})
    }
    return res.status(201).send({status:true, message:"bloglist", data:blog})
 }
}




module.exports.getBlogs = getBlogs
module.exports.createBlog = createBlog