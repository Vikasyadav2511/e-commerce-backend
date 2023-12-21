import subcategoryModel from "../model/subcategory.model";
import multer from "multer";
import path from 'path';
import fs from 'fs';


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        if(fs.existsSync('uploads/subcategories')){
            cb(null,"uploads/subcategories")
        }else{
            fs.mkdirSync('uploads/subcategories')
            cb(null,'uploads/subcategories')
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


export const addSubcategory = (req,res)=>{
    try {
    //   console.log('abc')

        const uploadSubcategoryData = upload.single("image");
        uploadSubcategoryData(req, res, function (err) {
            if (err) {
              return res.status(400).json({
                message: err.message,
              });
            }
            const { title, description,category } = req.body;
            let img = null;
            if (req.file) {
              img = req.file.filename;
            }
      
      
            const catData = new subcategoryModel({
              title:title,
              description: description,
              category:category,
              image:img
            });
            catData.save();

            if (catData) {
              return res.status(201).json({
                data: catData,
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

export const getSubCategories = async (req, res) => {
    try {
      const categoriesData = await subcategoryModel.find();
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

  export const getSubCategory = async (req, res) => {
    try {
      const subcategoryID = req.params.subcategory_id;
      const categoryData = await subcategoryModel.findOne({ status: 1,_id:subcategoryID });
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

  export const updateSubCategory = async (req, res) => {
    try {
  
      const uploadSubCategorydata = upload.single("image");
       uploadSubCategorydata (req,res,async function(error){
        if(error){
            return res.status(400).json({
                message:error.message
            })
        }
  
        const subcategory_id = req.params.subcategory_id;
       const existSubCategoryID = await subcategoryModel.findOne({_id : subcategory_id})
       console.log(existSubCategoryID);
  
        let img = existSubCategoryID.image;
          console.log('img-',img);
       
          
       if(req.file){
          img = req.file.filename
          console.log(img);
          if(fs.existsSync('uploads/subcategories' + existSubCategoryID.image)){
              fs.unlinkSync('uploads/subcategories' + existSubCategoryID.image)
          }
       }
  
      const { title, email, password, contact } = req.body;
  
      const updateData = await subcategoryModel.updateOne(
        { _id: subcategory_id },
        {
         $set: {
            title: title,
            email: email,
            password: password,
            contact: contact,
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

  export const softDeletesubCat = async (req,res)=>{
    try {
        const subcategory_id = req.params.subcategory_id;
  
        const softSubCatdatadelete = await subcategoryModel.updateOne({_id:subcategory_id},{
            $set:{status:0}
        })
        if(softSubCatdatadelete.acknowledged){
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


  export const hardDeletesubcat = async (req,res)=>{
    try {
        const subcategoryID =req.params.subcategory_id;
  
        const existSubCategoryID = await subcategoryModel.findOne({_id:subcategoryID})
  
        const deleted = await subcategoryModel.deleteOne({_id: subcategoryID})
  
        if(fs.existsSync('uploads/' + existSubCategoryID.image)){
          fs.unlinkSync('uploads/' + existSubCategoryID.image)
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
  