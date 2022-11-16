const mongoose = require('mongoose')

const AuthorSchema = new mongoose.Schema({

fname: { 
type:String,
required:true
}, 
lname: {
type:String,
required:true
}, 
title:{
required:true,
enum:[Mr, Mrs, Miss]},
email:{
type:String,
required:true,
unique:true
},
password:{
type:String,
required:true
}

})

module.module = mongoose.model('Author', AuthorSchema)