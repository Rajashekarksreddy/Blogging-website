const mongoose = require('mongoose')

const BlogModel = new mongoose.Schema({
    title:String,
    body:String,
    authorId:{
        type:String,
        ref:'Author'
    },
    tags:[{type:String, trim:true}],
    category:String,
    subcategory:[{type:String}],
    isDeleted:{
        type:Boolean,
        default:false
    },
    isPublished:{
     type:Boolean,
     default:true
    },

    publishedAt:{
        type:Date,
        default:null
    },
   
    deletedAt:{
        type:Date,
        default:null
    }

},{timestamps:true})


module.exports = mongoose.model('Blog', BlogModel)