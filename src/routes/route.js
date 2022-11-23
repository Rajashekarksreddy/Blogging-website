const express = require('express')
const authorcontroller = require('../Controllers/AuthorController')
const BlogController = require('../Controllers/BlogController')
const middleware =require('../Middleware/Middleware')
const router = express.Router()

router.post('/post',authorcontroller.createAuthor )
router.post('/loginAuthor', authorcontroller.loginAuthor)
router.post('/createBlog',middleware.aunthetication,middleware.autherization,BlogController.createBlog)
router.get('/filterblogs', middleware.aunthetication, BlogController.getBlogs)
router.put('/blogs/:blogId',middleware.aunthetication,middleware.autherization ,BlogController.updateBlogById)
router.delete('/blogs/:blogId', middleware.aunthetication, middleware.autherization, BlogController.deleteBlogId)
router.delete('/blogs', middleware.aunthetication, middleware.autherization, BlogController.deleteBlogByquery)


module.exports = router