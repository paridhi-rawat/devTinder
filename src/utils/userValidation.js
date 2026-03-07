const validator = require("validator")

const validateUserEdit = (req) =>{
    const isAllowedFields = ['skills',"gender","age","about","photo"]
    isAllowed = Object.keys(req.body).every(field => isAllowedFields.includes(field))
    return isAllowed

}
module.exports = {validateUserEdit}