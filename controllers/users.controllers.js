import userModel from "../model/user.model";
import multer from "multer";
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import authmiddleware from "../middleware/auth.middleware";
 import otpmodel from "../model/otpmodel";
 import otpGenerator from 'otp-generator'



export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("uploads/")) {
      cb(null, "uploads/");
    } else {
      fs.mkdirSync("uploads/");
      cb(null, "uploads/");
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const orgName = file.originalname;
    const imgArr = orgName.split('.') 
    imgArr.pop();
    const fname = imgArr.join('.')
    const ext = path.extname(orgName)


    cb(null, fname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage: storage });

export const addUser = (req, res) => {
  try {
    const { name, email, contact, password } = req.body;
    console.log(req.body);
    const saveUser = new userModel({
      name: name,
      email: email,
      password: password,
      contact: contact, 
    });
    saveUser.save();
    if (saveUser) {
      return res.status(201).json({
        data: saveUser,
        message: "Created",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const getUserData = await userModel.find();

    if (getUserData) {
      return res.status(200).json({
        data: getUserData,
        message: "Data get successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const userID = req.params.user_id;
    const getuser = await userModel.findOne({ _id: userID });
    if (getuser) {
      return res.status(200).json({
        data: getuser,
        message: "fetched",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const updateUser = async (req, res) => {
  try {

    const uploaduserdata = upload.single("avatar");
     uploaduserdata (req,res,async function(error){
      if(error){
          return res.status(400).json({
              message:error.message
          })
      }

      const userID = req.params.user_id;
     const existUserID = await userModel.findOne({_id : userID})
    //  console.log(existUserID);

     let img = existUserID.avatar;
        console.log('img-',img);
     
        
     if(req.file){
        img = req.file.filename
        console.log(img);
        if(fs.existsSync('uploads/' + existUserID.avatar)){
            fs.unlinkSync('uploads/' + existUserID.avatar)
        }
     }

    const { name, email, password, contact } = req.body;

    const updateData = await userModel.updateOne(
      { _id: userID },
      {
       $set: {
          name: name,
          email: email,
          password: password,
          contact: contact,
          avatar:img
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


export const softDelete = async (req,res)=>{
    try {
        const userID = req.params.user_id;

        const softDatadelete = await userModel.updateOne({_id:userID},{
            $set:{status:0}
        })
        if(softDatadelete.acknowledged){
            return res.status(200).json({
                message:"delted sucessfully"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
          });
    }
}
// 7021582963 p
// 7777048621 a
export const hardDelete = async (req,res)=>{
        try {
            const userID =req.params.user_id;

            const existUserID = await userModel.findOne({_id:userID})

            const deleted = await userModel.deleteOne({_id: userID})

            if(fs.existsSync('uploads/' + existUserID.avatar)){
              fs.unlinkSync('uploads/' + existUserID.avatar)
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

export const signUp = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;

    const existUser = await userModel.findOne({ email: email });
    if (existUser) {
      return res.status(200).json({
        message: "User already exist.",
      });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const saveUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      contact: contact,
    });
    saveUser.save();

    if (saveUser) {
      return res.status(200).json({
        message: "Successfully signup",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password,contact } = req.body;
    const conemial = {
      $or:[
        {email:email},
      {contact:contact}

      ]
    }
    const existUser = await userModel.findOne(conemial);
    if (!existUser) {
      return res.status(400).json({
        message: "User doesn't exist",
      });
    }

    const checkPassword = bcrypt.compareSync(password, existUser.password); // tru
    if(!checkPassword){
        return res.status(400).json({
            message:"Invalid credential"
        })
    }
    const token = jwt.sign(
      {
        id: existUser._id,
        email: existUser.email,
      },
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // console.log(token)

    res.cookie("userdata", existUser);


    return res.status(200).json({
        data:existUser,
        token:token,
        message:'Login success'
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const otp = async (req,res)=>{
  try {
    const{email}= req.body
    
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets:false  });
    console.log("otp",otp)
    const transporter = nodemailer.createTransport({
     service:"gmail",
      auth: {
        user: "vikaskumaryadav2511@gmail.com",
        pass: "",
      },
    });
    
      const info = await transporter.sendMail({
        from:"vikaskumaryadav2511@gail.com",
        to: email, // list of receivers
        subject: "your otp has been sent", // Subject line
        text: otp, // plain text body
      });

      console.log("info",info)
    
     
      // const saveotp = new otpmodel({
      //     otp:otp,
      //     email:email
      // })
      // saveotp.save();

      // if(saveotp){
      //   return res.status(200).json({
      //     message:"opt saved"
      //   })
      // }
    
  } catch (error) {
    return res.status(400).json({
      message:"otp failed"
    })
  }
};



