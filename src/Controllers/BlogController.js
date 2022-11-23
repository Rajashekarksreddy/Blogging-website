const BlogModel = require('../Models/BlogModel')
const AuthorModel = require('../Models/AuthorModel')
const validator = require('../Utils/Validation')


const createBlog = async function(req,res){
    let requestBody = req.body
    let auth = req.authorId


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
  try {
    let authorIdFromToken = req.authorId;
    let blogId = req.params.blogId;
    let requestBody = req.body;
    const { title, body, tags, subcategory } = requestBody;

    if (!validator.isValidObjectId(blogId)) {
      return res
        .status(400)
        .send({ status: false, message: `BlogId is invalid.` });
    }

    if (!validator.isValidString(title)) {
      return res
        .status(400)
        .send({ status: false, message: "Title is required for updatation." });
    }

    if (!validator.isValidString(body)) {
      return res
        .status(400)
        .send({ status: false, message: "Body is required for updatation." });
    }

    if (tags) {
      if (tags.length === 0) {
        return res
          .status(400)
          .send({ status: false, message: "tags is required for updatation." });
      }
    }

    if (subcategory) {
      if (subcategory.length === 0) {
        return res.status(400).send({
          status: false,
          message: "subcategory is required for updatation.",
        });
      }
    }

    let Blog = await BlogModel.findOne({ _id: blogId });
    if (!Blog) {
      return res.status(400).send({ status: false, msg: "No such blog found" });
    }
    if (Blog.authorId.toString() !== authorIdFromToken) {
      res.status(401).send({
        status: false,
        message: `Unauthorized access! author's info doesn't match`,
      });
      return;
    }
    if (
      req.body.title ||
      req.body.body ||
      req.body.tags ||
      req.body.subcategory
    ) {
      const title = req.body.title;
      const body = req.body.body;
      const tags = req.body.tags;
      const subcategory = req.body.subcategory;
      const isPublished = req.body.isPublished;

      const updatedBlog = await BlogModel.findOneAndUpdate(
        { _id: req.params.blogId },
        {
          title: title,
          body: body,
          $addToSet: { tags: tags, subcategory: subcategory },
          isPublished: isPublished,
        },
        { new: true }
      );
      if (updatedBlog.isPublished == true) {
        updatedBlog.publishedAt = new Date();
      }
      if (updatedBlog.isPublished == false) {
        updatedBlog.publishedAt = null;
      }
      return res.status(200).send({
        status: true,
        message: "Successfully updated blog details",
        data: updatedBlog,
      });
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide blog details to update" });
    }
  } catch (err) {
    res.status(500).send({
      status: false,
      Error: err.message,
    });
  }
};

const deleteBlogId = async function(req,res){
  try{
    let id = req.params.blogId
    if(!validator.isValidObjectId(id)){
        return res.status(400).send({status:false, message:"blogId is invalid"})
    }

    let Blog = await BlogModel.findOne({_id:id})
    if(!Blog){
        return res.status(400).send({status:false, message:"No blog found"})
    }

    if(Blog.isDeleted === false){
        let updateAndDelete = await BlogModel.findOneAndUpdate({_id:id}, {isDeleted:true, deletedAt:Date()}, {new:true})
      return res.status(200).send({message: 'sucessfully deleted'})
    } else {
        res.status(400).send({message:"Blog already deleted"})
    }
}catch(error){
    res.status(500).send({status:false, Error:error.message})
}
}


const deleteBlogByquery = async function(req,res){
    try {
        const filterQuery = { isDeleted: false, deletedAt: null };
        const queryParams = req.query;
        const authorIdFromToken = req.authorId;
    
        if (!validator.isValidObjectId(authorIdFromToken)) {
          res.status(400).send({
            status: false,
            message: `${authorIdFromToken} is not a valid token id`,
          });
          return;
        }
    
        if (!validator.isValidRequestBody(queryParams)) {
          res.status(400).send({
            status: false,
            message: `No query params received. Aborting delete operation`,
          });
          return;
        }
    
        const { authorId, category, tags, subcategory, isPublished } = queryParams;
    
        if (validator.isValid(authorId) && validator.isValidObjectId(authorId)) {
          filterQuery["authorId"] = authorId;
        }
    
        if (validator.isValid(category)) {
          filterQuery["category"] = category.trim();
        }
    
        if (validator.isValid(isPublished)) {
          filterQuery["isPublished"] = isPublished;
        }
    
        if (validator.isValid(tags)) {
          const tagsArr = tags
            .trim()
            .split(",")
            .map((tag) => tag.trim());
          filterQuery["tags"] = { $all: tagsArr };
        }
    
        if (validator.isValid(subcategory)) {
          const subcatArr = subcategory
            .trim()
            .split(",")
            .map((subcat) => subcat.trim());
          filterQuery["subcategory"] = { $all: subcatArr };
        }
    
        const findBlogs = await BlogModel.find(filterQuery);
    
        if (Array.isArray(findBlogs) && findBlogs.length === 0) {
          res
            .status(404)
            .send({ status: false, message: "No matching blogs found" });
          return;
        }
    
        let blogToBeDeleted = [];
        findBlogs.map((blog) => {
          if (
            blog.authorId.toString() === authorIdFromToken &&
            blog.isDeleted === false
          ) {
            blogToBeDeleted.push(blog._id);
          }
        });
    
        if (blogToBeDeleted.length === 0) {
          res
            .status(404)
            .send({ status: false, message: "No blogs found for deletion." });
          return;
        }
    
        await BlogModel.updateMany(
          { _id: { $in: blogToBeDeleted } },
          { $set: { isDeleted: true, deletedAt: new Date() } }
        );
    
        return res
          .status(200)
          .send({ status: true, message: "Blog deleted successfully" });
      } catch (err) {
        return res.status(500).send({ status: false, Error: err.message });
      }
    };

module.exports.deleteBlogByquery = deleteBlogByquery
module.exports.deleteBlogId = deleteBlogId
module.exports.updateBlogById = updateBlogById
module.exports.getBlogs = getBlogs
module.exports.createBlog = createBlog