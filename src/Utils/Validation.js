const { default: mongoose } = require("mongoose");

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };

const isValidTitle = function(title){
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

const isValidemail = function(email){
   const emailregex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
   return emailregex.test(email)
}

const isValidRequestBody = function(requestBody){
   return Object.keys(requestBody).length > 0;
}

const isValidString = function(value){
   if(typeof value === "string" && value.trim().length === 0) return false
   return true
}


const isValidObjectId = function(ObjectId){
   return mongoose.Types.ObjectId.isValid(ObjectId)
}


module.exports = {isValid,isValidTitle,isValidemail,isValidRequestBody,isValidObjectId,isValidString}