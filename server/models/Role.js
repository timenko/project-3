const {Schema, model} = require('mongoose')


const Role = new Schema({
    value: {type: String,required: true, unique: true,default:"test"},
})

module.exports = model('Role', Role)