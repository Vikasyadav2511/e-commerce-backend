import brandModel from "../model/brand.model";
import multer from "multer";
import path from 'path';
import fs from 'fs';
import productModel from "../model/product.model";


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        if(fs.existsSync('uploads/products')){
            cb(null,"uploads/products")
        }else{
            fs.mkdirSync('uploads/products')
            cb(null,'uploads/products')
        }
    },
    filename: function(req,file,cb){
        const uniquesuufix = Date.now();
        const orgName = file.originalname;
        const imagarr = orgName.split('.');
        imagarr.pop();

        const fName = imagarr.join('.');
        const ext = path.extname(orgName);
        cb(null,fName + "-" + uniquesuufix + ext);
    }
});
       
const upload = multer({ storage: storage });


export const addProduct = async (req, res) => {
    try {
      const uploadMiddleware = upload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "images", maxCount: 10 },
      ]);
  
      uploadMiddleware(req, res, async function (err) {
        if (err) {
          return res.status(400).json({
            message: err.message,
          });
        }
  
        let thumbnailImage = null;
        let imageArr = [];
  
        if (req.files["thumbnail"]) {
          thumbnailImage = req.files["thumbnail"][0].filename;
        }
  
        if (req.files["images"]) {
          req.files["images"].forEach((image) => {
            imageArr.push(image.filename);
          });
        }
  
        const product = await productModel.create({
          ...req.body,
          thumbnail: thumbnailImage,
          images: imageArr,
        });
  
        if (product) {
          return res.status(201).json({
            data: product,
            message: "Created",
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };

  export const getProducts = async (req, res) => {
    try {
      const { page, size, search } = req.query;
      console.log(page, size, search);
  
      const skipno = (page - 1) * size;
  
      const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
      const searchRgx = rgx(search);
  
      let filter = { status: 1 };
      if (search) {
        filter = {
          ...filter,
          $or: [
            { title: { $regex: searchRgx, $options: "i" } },
            { shortDescription: { $regex: searchRgx, $options: "i" } },
            { description: { $regex: searchRgx, $options: "i" } },
          ],
        };
      }
  
      const products = await productModel.find(filter)
        .populate("category")
        .limit(size)
        .skip(skipno);
      if (products) {
        return res.status(200).json({
          data: products,
          message: "Fetched",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };  


  export const UpdateProduct = async (req, res) => {
    try {
      const uploadProductData = upload.single("images");
  
      uploadProductData(req, res, async function (err) {
        if (err) {
          return res.status(400).json({
            message: err.message,
          });
        }
        const productId = req.params.product_id
        const { name, description,quantity,price } = req.body;
  
        const existProductCategory = await productModel.findOne({_id:productId});
  
        let img = existProductCategory.images;
        if (req.file) {
          img = req.file.filename;
          if(fs.existsSync('./uploads/'+existProductCategory.images)){
            fs.unlinkSync('./uploads/'+existProductCategory.images)
          }
        }
  
        const UpdateProduct = await productModel.updateOne({_id:productId},{$set:{
          name: name,
          description: description,
          images:img,
          quantity:quantity,
          price:price,
        }})
  
        if (UpdateProduct.matchedCount) {
          return res.status(200).json({
            message: "Updated",
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };

  export const softDeleteCat = async (req,res)=>{
    try {
        const productId = req.params.product_id;
  
        const softproductdatadelete = await productModel.updateOne({_id:productId},{
            $set:{status:0}
        })
        if(softproductdatadelete.acknowledged){
            return res.status(200).json({
                message:"delted sucessfully"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
          });
    }
  };

  export const hardDeleteproducts = async (req,res)=>{
    try {
        const productID =req.params.product_id;
  
        const existProductID = await productModel.findOne({_id:productID})
  
        const deleted = await productModel.deleteOne({_id: productID})
  
        if(fs.existsSync('uploads/' + existProductID.avatar)){
          fs.unlinkSync('uploads/' + existProductID.avatar)
      }
  
        if(deleted.acknowledged){
            return res.status(200).json({
                message:"deleted permanently"
            })
  
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
          });
    }
  }