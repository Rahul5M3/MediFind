const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    doctor :{
        type:Schema.Types.ObjectId,
        ref:'Register'
    },
    reviewRating: [{
        review:String,
        rating:Number,
        user : {
            type: Schema.Types.ObjectId,
            ref:'User'
        },
        date : String,
    }],
})

const Review=new mongoose.model('Review',reviewSchema);

module.exports=Review;