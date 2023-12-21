import brandModel from "../model/brand.model";
import multer from "multer";
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        if(fs.existsSync('uploads/brands')){
            cb(null,"uploads/brands")
        }else{
            fs.mkdirSync('uploads/brands')
            cb(null,'uploads/brands')
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


export const addbrand = (req,res)=>{
    try {
    //   console.log('abc')

        const uploadbrand = upload.single("image");
        uploadbrand(req, res, function (err) {
            if (err) {
              return res.status(400).json({
                message: err.message,
              });
            }
            const { title, description, } = req.body;
            let img = null;
            if (req.file) {
              img = req.file.filename;
            }
      
      
            const brandData = new brandModel({
              title:title,
              description: description,
              image:img
            });
            brandData.save();

            if (brandData) {
              return res.status(201).json({
                data: brandData,
                message: "Created subcategory",
              });
            }
          });




    } catch (error) {
        return res.status(400).json({
            Message:error.Message
        })
    }
}

export const getbrands = async (req, res) => {
    try {
      const categoriesData = await brandModel.find();
      if (categoriesData) {
        return res.status(200).json({
          data: categoriesData,
          message: "Success",
          filepath:"http://localhost:8001/uploads"
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };

  export const getbrand = async (req, res) => {
    try {
      const categoryID = req.params.brandcategory_id;
      const categoryData = await brandModel.findOne({ status: 1,_id:categoryID });
      if (categoryData) {
        return res.status(200).json({
          data: categoryData,
          message: "Success",
          filepath:"http://localhost:8001/uploads"
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };

  export const updatebrand = async (req, res) => {
    try {
  
      const uploadbrandData = upload.single("image");
      uploadbrandData (req,res,async function(error){
        if(error){
            return res.status(400).json({
                message:error.message
            })
        }
  
        const brand_id = req.params.brandcategory_id;
       const existBrandID = await brandModel.findOne({_id : brand_id})
       console.log(existBrandID);
  
        let img = existBrandID.image;
          console.log('img-',img);
       
          
       if(req.file){
          img = req.file.filename
          console.log(img);
          if(fs.existsSync('uploads/brands' + existBrandID.image)){
              fs.unlinkSync('uploads/brands' + existBrandID.image)
          }
       }
  
      const { title, description } = req.body;
  
      const updateData = await brandModel.updateOne(
        { _id: brand_id },
        {
         $set: {
            title: title,
            description:description,
             image:img
          },
        })
        if(updateData.acknowledged){
          return res.status(200).json({
              message: "Updated"
          })
        }
       })
  
       
      
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };

  export const softDeleteBrand = async (req,res)=>{
    try {
        const brand_id = req.params.brand_id;
  
        const softBrandDelete = await brandModel.updateOne({_id:brand_id},{
            $set:{status:0}
        })
        if(softBrandDelete.acknowledged){
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

  export const hardDeletebrand = async (req,res)=>{
    try {
        const BrandID =req.params.brand_id;
  
        const brandID = await brandModel.findOne({_id:BrandID})
  
        const deleted = await brandModel.deleteOne({_id: BrandID})
  
        if(fs.existsSync('uploads/' + brandID.avatar)){
          fs.unlinkSync('uploads/' + brandID.avatar)
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