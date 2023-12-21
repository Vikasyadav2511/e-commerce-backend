import categoryModel from "../model/category.model";
import multer from "multer";
import path from 'path';
import fs from 'fs';


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        if(fs.existsSync('uploads/categories')){
            cb(null,"uploads/categories")
        }else{
            fs.mkdirSync('uploads/categories')
            cb(null,'uploads/categories')
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

export const addCategory = (req,res)=>{
    try {
        const uploadCategoryData = upload.single("image");
        uploadCategoryData(req, res, function (err) {
            if (err) {
              return res.status(400).json({
                message: err.message,
              });
            }
            const { title, description } = req.body;
      
            let img = null;
            if (req.file) {
              img = req.file.filename;
            }
      
      
            const catData = new categoryModel({
              title:title,
              description: description,
              image:img
            });
            catData.save();
            if (catData) {
              return res.status(201).json({
                data: catData,
                message: "Created",
              });
            }
          });




    } catch (error) {
        return res.status(400).json({
            Message:error.Message
        })
    }
}

export const getCategories = async (req, res) => {
  try {
    const categoriesData = await categoryModel.find();
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


export const getCategory = async (req, res) => {
  try {
    const categoryID = req.params.category_id;
    const categoryData = await categoryModel.findOne({ status: 1,_id:categoryID });
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

export const updateCategory = async (req, res) => {
  try {

    const uploadCategorydata = upload.single("image");
     uploadCategorydata (req,res,async function(error){
      if(error){
          return res.status(400).json({
              message:error.message
          })
      }

      const category_id = req.params.category_id;
     const existCategoryID = await categoryModel.findOne({_id : category_id})
    //  console.log(existUserID);

     let img = existCategoryID.image;
        console.log('img-',img);
     
        
     if(req.file){
        img = req.file.filename
        console.log(img);
        if(fs.existsSync('uploads/categories' + existCategoryID.image)){
            fs.unlinkSync('uploads/categories' + existCategoryID.image)
        }
     }

    const { name, email, password, contact } = req.body;

    const updateData = await categoryModel.updateOne(
      { _id: category_id },
      {
       $set: {
          name: name,
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

export const softDeleteCat = async (req,res)=>{
  try {
      const category_id = req.params.category_id;

      const softCatdatadelete = await categoryModel.updateOne({_id:category_id},{
          $set:{status:0}
      })
      if(softCatdatadelete.acknowledged){
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

export const hardDeletecat = async (req,res)=>{
  try {
      const categoryID =req.params.category_id;

      const existCategoryID = await categoryModel.findOne({_id:categoryID})

      const deleted = await categoryModel.deleteOne({_id: categoryID})

      if(fs.existsSync('uploads/' + existCategoryID.avatar)){
        fs.unlinkSync('uploads/' + existCategoryID.avatar)
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


