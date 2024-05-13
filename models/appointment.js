const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const appointmentSchema=new Schema({
    doctor : {
        type: Schema.Types.ObjectId,
        ref:'Register'
    },
    appointmentDetail: [{
        date:{
            type:String,
            required:true
        },
        time:{
            type:String,
            required:true
        },
        user :{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        disease:String,
    }],
})

const Appointment=new mongoose.model('Appointment',appointmentSchema);

module.exports=Appointment;