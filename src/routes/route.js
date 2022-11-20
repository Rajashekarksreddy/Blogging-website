const express = require('express')
const authorcontroller = require('../Controllers/AuthorController')
const BlogController = require('../Controllers/BlogController')
const router = express.Router()

router.post('/post',authorcontroller.createAuthor )
router.post('/createBlog',BlogController.createBlog)
router.get('/filterblogs', BlogController.getBlogs)
router.put('/blogs/:blogId', BlogController.updateBlogById)
router.delete('/blogs/:blogId', BlogController.deleteBlogId)


module.exports = router