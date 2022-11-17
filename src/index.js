const express = require('express')
const bodyperser = require('body-parser')
const mongoose = require('mongoose')
const route = require('./routes/route')

const app = express()

app.use(bodyperser.json())
app.use(bodyperser.urlencoded({extended:true}))

mongoose.connect("mongodb+srv://jaganreddy-functionup:ORj2ygJHT7jbS3y8@cluster0.nduth.mongodb.net/Blog-website?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use('/',route)
app.listen(process.env.PORT || 3000, function(){
    console.log('express app running on' + (process.env.PORT || 3000))
})