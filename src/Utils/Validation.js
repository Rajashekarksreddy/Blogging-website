const isValid = function(value){
    if(typeof value === String && typeof value === null ) return false
    if(typeof value === String && typeof value.trim().length === 0) return false
    return true
}

const isValidTitle = function(title){
    return [Mr, Mrs, Miss].indexOf(title)
}

const validemail = function(email){
   const emailregex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
   emailregex.test(email)
}


