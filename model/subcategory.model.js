import mongoose from 'mongoose';
import categoryModel from './category.model';

const Schema = mongoose.Schema;

const SubcatgeorySchema = new Schema({
    title:{
        type:String,
        required:true
    },
    category:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:categoryModel
      },

    description:{
        type:String,
        required:true
    },

    image:{
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

export default mongoose.model('subcategory',SubcatgeorySchema);