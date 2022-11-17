const mongoose = require('mongoose')

const AuthorModel = new mongoose.Schema({
    firstname:String,
    lastname:String,
    title:{
        type:String,
        enum:['Mr', 'Mrs',"Miss"]
    },
    email:{
    type:String,
    unique:true
    },
    password:{
        type:String
    }
})


module.exports = mongoose.model('Author', AuthorModel)