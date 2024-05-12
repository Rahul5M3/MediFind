const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=new Schema({
    email: {
        type:String,
        required:true,
    },
    name: {
        type:String,
        required:true,
    },
    contactNumber: {
        type:Number,
        required:true,
    },
    gender: {
        type:String,
        required:true,
    },
    mobile: {
        type:Number,
        required:true,
    },
    dob: {
        type:Date,
        required:true,
    },
    country: {
        type:String,
    },
    city : {
        type:String,
    },
    location : {
        type:String,
    }
});

userSchema.plugin(passportLocalMongoose);

const User= new mongoose.model('User',userSchema);

module.exports=User;