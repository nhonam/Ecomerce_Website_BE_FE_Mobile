const ADMIN = require("../models/Admin");
const argon2 = require("argon2");
const { ACCESS_TOKEN_SECRET } = require("../models/index");
const jwtService = require("./jwt.service");
const Speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const { use } = require("../routes/aiRoute");
const cloudinary = require("cloudinary");

const register = async (body) => {
  try {

    // if(body.repassword !== body.password){
    //   return {
    //     message: "Password Error",
    //     success: false,
    //   };
    // };
    const existUser = await ADMIN.findOne({
      username: body.username,
    });
    if (existUser) {
      return {
        message: "User already ",
        success: false,
      };
    }

    const imageUrl = "https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.30497-1/84687230_2222103328096112_4091110349787365376_n.png?stp=c43.0.148.148a_dst-png_p148x148&_nc_cat=1&ccb=1-7&_nc_sid=20dd50&_nc_ohc=pQ1z097-h-IAX9EYl0p&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfAHzzRDf9_eMeinSG9uW3u26ip7oFdwwwd7RVHsFVIbZw&oe=64623E97";

    const myCloud = await cloudinary.v2.uploader.upload(imageUrl, {
      folder: "avatars",
      width: 320,
      height: 320,
      crop: "scale",
    });
   
    const avt = {
      url: myCloud.secure_url,
      public_id: myCloud.public_id,
    };
 
 
    const hashedPassword = await argon2.hash(body.password);
    const newUser = new ADMIN({
      avt: avt,
      username: body.username,
      password: hashedPassword,
      identity_card:Math.floor(Math.random() * 9999999) + 1000000
    });
    await newUser.save();
    return {
      data:newUser,
      message: "Create Seller successfully!",
      success: true,
    };
  } catch (error) {
    return {
      message: "An error occurred!",
      success: false,
    };
  }
};
const login = async (body) => {
  try {
    // const { username, password } = body;
    const username = body.username;
    const password = body.password;

    const admin = await ADMIN.findOne({
      username: body.username,
    });
   
    if (!admin)
      return {
        message: "Invalid account!",
        success: false,
      };
    const PasswordValid = await argon2.verify(admin.password, password);
    if (!PasswordValid) {
      return {
        message: "Invalid password!",
        success: false,
      };
    }
    const token = jwtService.createToken(admin._id);
    return {
      message: "Login Successfully!",
      success: true,
      data: { token: token, admin: admin },
    };
  } catch (err) {
    return {
      message: "An error occurred!",
      success: false,
    };
  }
};
const getAuth = async (body) => {
  try {
    const user = await ADMIN.findById(body);
    if (!user) {
      return {
        message: "Login Fail!",
        success: false,
      };
    }
    return {
      message: "Login Successfully!",
      success: true,
      data: { admin: user },
    };
  } catch (error) {
    return {
      message: "An error occurred",
      success: false,
    };
  }
};
const sendOTP =  (email) => {
  var secret = Speakeasy.generateSecret({ length: 20 }).base32;
 
  let transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "duygtran1706@gmail.com",
      pass: "humtghokhhanbqjn",
    },
  });
  // console.log(secret);
  const opt = Speakeasy.totp({
    secret: secret,
    encoding: "base32",
    step: 100,
    window: 3,
  })

  var mailOptions = {
    from: "duygtran1706@gmail.com",
    to: email,
    subject: "Email confirmation",
    html: ` Click <a href=http://localhost:3000/registerSeller/${secret}>here</a> to verify account 
    Your token: ${opt}`,
  };
  
  transport.sendMail(mailOptions, function (err, res) {
    
    if (err) {
      console.log("Error sent mail");
    } else {
      
      console.log("Message sent", secret);
     
    }
    
  });
  
  return secret
};
const sendMail = async (body) => {
  try {
     
    const key = await sendOTP(body.email);
    
    return {
      message: "Send Email successfully!",
      success: true,
      data:key
    };
  } catch (error) {
    return {
      message: "An occured error!",
      success: false,
    };
  }
};
const verifyUser = async (id, token, _id) => {
  try {
    console.log("----------");
    console.log(id);console.log(token);console.log(_id);
    console.log("----------");
// //     ----------
// // JB2H2JJDN5XHWTKUPM7H2ORTEN4VOLT3
// // 617204
// // 6438f641adf2aef8f055
    const isValid = Speakeasy.totp.verify({
      secret: id,
      encoding: "base32",
      token: token,
      window: 3,
      step: 100,
    });
   
    if (!isValid)
      return {
        message: "The token is not valid!",
        success: false,
      };
    const updateUser = await ADMIN.findByIdAndUpdate(
      { _id: _id },
      { isAdmin: true }
    );
    if (updateUser) {
      const data = await ADMIN.findById({ _id: _id });
      return {
        message: "Verify user successfullyy",
        success: true,
        data: { admin: data },
      };
    }
  } catch (error) {
    return {
      message: "An occured error!",
      success: false,
    };
  }
};
const updateProfile = async (id, body) => {
  try {
    const existUser = await ADMIN.findById({ _id: id });
    if (!existUser)
      return {
        message: "User không tồn tại!",
        success: false,
      };
    if(body.avatar) {
      await cloudinary.v2.uploader.destroy(existUser.avt.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(body.avatar, {
        folder: "avatars",
        width: 320,
        height: 320,
        crop: "scale",
      });
  
      body.avt = {
        url: myCloud.secure_url,
        public_id: myCloud.public_id,
      };

    }


    const update = await ADMIN.findByIdAndUpdate({ _id: id }, body);
  
    if (update) {
      const user = await ADMIN.findById({ _id: id });
      return {
        data: { admin: user },
        message: "Cập nhật thông tin thành công",
        success: true,
      };
    }
  } catch (error) {
    return {
      message: "Có lỗi xảy ra",
      success: false,
    };
  }
};



module.exports = {
  register,
  updateProfile,
  login,
  getAuth,
  sendMail,
  verifyUser,
};
