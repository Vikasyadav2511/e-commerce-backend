import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const otpSchema = new Schema({
    otp:{
        type:String,
        required:true
    },

    email:{
        type:String,
        default:null
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    status:{
        type:Number,
        default:1
    }
});

export default mongoose.model('otp',otpSchema);