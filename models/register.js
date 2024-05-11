const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const registerSchema=Schema ({
    name: {
        type:String,
        required:true
    },
    contactNumber: {
        type:Number,
        required:true,
    },
    active:{
        type:String,
        required:true
    },
    registerNumber: {
        type:Number,
        required:true,
    },
    registerDate : {
        type:Date,
        required: true,
    },
    activeFrom : {
        type:Date,
        required: true,
    },
    activeTo : {
        type:Date,
        required: true,
    },
    email: {
        type:String,
        required:true
    },
    photo : {
        url:String,
        filename:String  
    },
    specialisation:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    startTime:{
        type: String,
        required:true,
    },
    endTime: {
        type: String,
        required:true,
    },
    shouldMakeVisible:{
        type:String,
        default: "no",
    }
})

registerSchema.plugin(passportLocalMongoose);

const Register=mongoose.model('Register',registerSchema);

module.exports=Register;