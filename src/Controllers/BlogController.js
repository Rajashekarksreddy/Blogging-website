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
        return res.status(404).status({status:false, message:"no blogs found"})
    }
    return res.status(201).send({status:true, message:"bloglist", data:blog})
 }
}


const updateBlogById =  async function(req,res){
    let blogId = req.params.blogId;
    let data = req.body;

     if(!validator.isValidObjectId(blogId)){
        return res.status(400).send({status:false, message:"BlogId is invalid"})
     }
     let {title,body,tags,subcategory} = data

     if(!validator.isValidString(title)){
        return res.status(400).send({status:false, message:"title is required for updating"})
     }

     if(!validator.isValidString(body)){
        return res.status(400).send({status:false, message:"body is required for updating"})
     }

     if(tags){
        if(tags.length === 0){
            return res.status(400).send({status:false, message:"tag is required for updation"})
        }
     }

     if(subcategory){
        if(subcategory.length === 0){
            return res.status(400).send({message:"subcategory is for required for upation"})
        }
     }
     let Blog = await BlogModel.findOne({_id:blogId})
     if(!Blog){
        return res.status(404).send({status:false, message:"no such blog found"})
     }


    if(req.body.title || req.body.body || req.body.tags ||req.body.subcategory ){

        const title = req.body.title
        const body = req.body.body
        const tags = req.body.tags
        const subcategory = req.body.subcategory

    }

    let updateblog = await BlogModel.findOneAndUpdate({_id:req.params.blogId}, 
    {title:title, body:body, $addToSet:{tags:tags, subcategory:subcategory}},{new:true})
   
    if(updateblog.isPublished === true){
        updateblog.publishedAt = new Date()
    }

    if(updateblog.isPublished === false){
        updateblog.publishedAt = null
    }
    return res.status(201).send({status:true, message:"update list", data:updateblog})
}    

module.exports.updateBlogById = updateBlogById
module.exports.getBlogs = getBlogs
module.exports.createBlog = createBlog