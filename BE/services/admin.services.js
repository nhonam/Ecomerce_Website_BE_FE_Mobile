const ADMIN = require("../models/Admin");
const argon2 = require("argon2");
const { ACCESS_TOKEN_SECRET } = require("../models/index");
const jwtService = require("./jwt.service");
const Speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const { use } = require("../routes/aiRoute");
const cloudinary = require("cloudinary");
function formatDate(m) {
  new Date(m);
  const dateString =
    m.getUTCFullYear() +
    "-" +
    ("0" + (m.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + m.getDate()).slice(-2)
  return dateString;
}
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

    const imageUrl = "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1684550364~exp=1684550964~hmac=535ef2fed405251f5059942a374d44757d566e9e1437f5a6207650d6cbf33a7f"

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
    admin.birthday= formatDate(new Date(admin.birthday))
    console.log(admin.birthday);
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

const sentEmailNotification =  (email) => {
 
 
  let transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "duygtran1706@gmail.com",
      pass: "humtghokhhanbqjn",
    },
  });
  // console.log(secret);
 
  var mailOptions = {
    from: "duygtran1706@gmail.com",
    to: "nhonamstg@gmail.com",
    subject: "Nho Nam Ecommerce !!!",
    text: `Bạn đã đặt hàng thành công, Shop sẽ sớm gửi hàng cho bạn trong vài ngày tới vui lòng để ý điện thoại!!!`,
  };
  console.log("nam");
  transport.sendMail(mailOptions, function (err, res) {
    
    if (err) {
      console.log("Error sent mail");
    } else {
      
      console.log("Message sent", secret);
     
    }
    
  });
  
  return true
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
  sentEmailNotification
};
