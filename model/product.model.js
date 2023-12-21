import mongoose from "mongoose";
import subcategoryModel from "./subcategory.model";
import categoryModel from "./category.model";

const Schema= mongoose.Schema;

const productSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    
    category:{
        type:Schema.Types.ObjectId,
        default:null,
        ref:categoryModel,
      },

    subcategory:{
        type:Schema.Types.ObjectId,
        default:null,
        ref:subcategoryModel
      },
      brand:{
        type:Schema.Types.ObjectId,
        default:null,
        ref:subcategoryModel
      },

    images:{
        type:String,
        default:null
    },
    price:{
        type:Number,
        required:true
      },
    quantity:{
        type:Number,
        required:true
      },
    shortDescription:{
        type:String,
        default:null
      },
    description:{
        type:String,
        default:null,
      },
    thumbnail:{
        type:String,
        default:null
      },
    images:{
        type:Array,
        default:[]
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

export default mongoose.model('product',productSchema);
