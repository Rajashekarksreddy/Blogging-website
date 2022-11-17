const express = require('express')
const authorcontroller = require('../Controllers/AuthorController')
const router = express.Router()

router.post('/post',authorcontroller.createAuthor )


module.exports = router