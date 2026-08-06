const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentData = new Schema({
    event:{type: String,required : true},
    name:{type: String,required: true},
    roll:{type: Number,required: true},
    certificateid:{type: String,required: true},
    date:{type: String,required: true},
    blockchainHash: {type:String},
    transactionHash: {type:String}
})

module.exports = mongoose.model("Student",studentData)