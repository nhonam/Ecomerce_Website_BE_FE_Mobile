const Product = require("../models/Product");
const ADMIN = require("../models/Admin");
const cloudinary = require("cloudinary");
const { body } = require("../authenticator");
const getAllProduct = async () => {
  try {
    const product = await Product.find({});
    

    return {
      message: "Successfully get Product",
      success: true,
      data: product,
    };
  } catch (err) {
    return {
      message: "An error occurred",
      success: false,
    };
  }
};

const getAllCategory = async () => {
  try {
 
    const  product=await Product.find({});
    console.log(product[0].category);
    const categorylist=[]
    for (let index = 0; index < product.length; index++) {
      categorylist.push(product[index].category)
     
    }

    const unique = categorylist.filter(
      (obj, index) =>
      categorylist.findIndex((item) => item=== obj) === index
    );
    return {
      message: "Successfully get Product",
      success: true,
      data: unique,
    };
  } catch (err) {
    return {
      message: "An error occurred",
      success: false,
    };
  }
};
const getAllProductByCategory = async (category) => {
  try {
    const product = await Product.find( { category: category  });
    return {
      message: "Successfully get Product Category",
      success: true,
      data: product,
    };
  } catch (err) {
    return {
      message: "An error occurred",
      success: false,
    };
  }
};
const updatePathProduct = async (id, body) => {
  try {
    const existProduct = await Product.findById({ _id: id });
   
    if(body.image) {
      // const test= async ()=>{
      //    await myCloud
      // }
     
      const myCloud = await cloudinary.v2.uploader.upload(body.image, {
        folder: "products",
        width: 320,
        height: 320,
        crop: "scale",
      });
      // console.log(myCloud);
      console.log("nádasd");
      body.img = {
        url: myCloud.secure_url,
        public_id: myCloud.public_id,
      };

     
    }
  
   
    if (!existProduct) {
      return {
        message: "Product not exist",
        success: false,
      };
    }

    const update= await Product.findByIdAndUpdate({ _id: id }, body);
    if(update){
      const product = await Product.findById({_id:id})
      return {
        message: "Successfully update product",
        success: true,
        data: product,
      };
    }

  } catch (error) {
    console.log("in the catch api patch product");
    return {
      message: "An error occurred",
      success: false,
    };
  }
};
const getTypeProduct = async(body)=>{
  try {
    console.log(body);
    const typeProduct = await Product.find(body)
    console.log(typeProduct);
    if (typeProduct) {
      return {
        data: typeProduct,
        success: true,
        message:''
      }
    }
  } catch (error) {
    return { 
      success: false,
      message:'Lỗi'
    }
  }
}
const getProduct = async (id, body) => {
  try {
   
    // const product = await Product.find({ name_product:body.name_product,tag:body.tag, price:body.price, quantity:body.quantity });
    
    console.log(body);
    const productcheck = await Product.aggregate([
      {
        $match: {
          $and: [
            {
              name_product: body.name_product
            },
            {
              tag: body.tag
            },
            {
              price: body.price
            },
          
          ]
        }
      },
      {
        $group: {
         _id: {
          name_product: "$name_product",
          tag: "$tag", 
          price:"$price"
              
              },
          count: {
            $sum: 1
          },
          ids: {
            $push: "$Id"
          }
        }
      },
      {
        $match: {
          count: {
            $gt: 1
          }
        }
      }
    ])

    console.log("------------");
    console.log(productcheck);
    console.log(productcheck[0].count);

    if (productcheck[0].count>=2)
      return {
        message: "Product no found!",
        success: true,
      
      };
      console.log("chua xoa");
    return {
      message: "Successfully get product",
      success: false,
     
    };
  } catch (error) {
    return {
      message: "An error occurred",
      success: false,
    };
  }
};

const getCountProduct = async (id) => {
  try {
    console.log("nâm");
    const find = await Status_Orders.find({ shop: id });
    console.log("find",find);
    return {
      data: find,
      message: "Tìm kiếm thành công",
      success: true,
    };
  } catch (error) {
    return {
      message: "Lỗi ss",
      success: false,
    };
  }
};




const getProductBySeller = async (body) => {
  try {
    const product = await Product.find(body);
    if (!product)
      return {
        message: "Can't get product of seller!",
        success: false,
      };
    return {
      message: "Successfully get products",
      success: true,
      data: product,
    };
  } catch (error) {
    return {
      message: "An error occurred",
      success: false,
    };
  }
};

const gettopProductBySeller = async (body) => {
  try {
    const product = await Product.find(body);


    
    if (!product)
      return {
        message: "Can't get product of seller!",
        success: false,
      };
    return {
      message: "Successfully get products",
      success: true,
      data: product,
    };
  } catch (error) {
    return {
      message: "An error occurred",
      success: false,
    };
  }
};

const createProduct = async (body) => {
  try {
    
    const existUser = await ADMIN.findById({ _id: body.seller });
    const myCloud = await cloudinary.v2.uploader.upload(body.image, {
      folder: "products",
      width: 320,
      height: 320,
      crop: "scale",
    });
  

    body.img = {
      url: myCloud.secure_url,
      public_id: myCloud.public_id,
    };
    
   
    if (!existUser)
      return {
        message: "Người bán không tồn tại",
        success: false,
      };
    const newProduct = new Product(body);
   
    await newProduct.save();
    return {
      message: "Successfully create product",
      success: true,
      data: newProduct,
    };
  } catch (error) {
    return {
      message: "An error occurred",
      success: false,
    };
  }
};

const updateProduct = async (id, body) => {
  try {
    const existProduct = await Product.findById({ _id: id });
    const myCloud = await cloudinary.v2.uploader.upload(body.image, {
      folder: "products",
      width: 320,
      height: 320,
      crop: "scale",
    });
    body.img = {
      url: myCloud.secure_url,
      public_id: myCloud.public_id,
    };
    if (!existProduct) {
      return {
        message: "Product not exist",
        success: false,
      };
    }

    const update= await Product.findByIdAndUpdate({ _id: id }, body);
    if(update){
      const product = await Product.findById({_id:id})
      return {
        message: "Successfully update product",
        success: true,
        data: product,
      };
    }

  } catch (error) {
    return {
      message: "An error occurred",
      success: false,
    };
  }
};

const deleteProduct = async (id) => {
  try {
    const existProduct = await Product.findOne({ _id: id });
    if (!existProduct) {
      return {
        message: "Product not exist",
        success: false,
      };
    }
    console.log(existProduct.img.url);

    await Product.deleteOne({ _id: id });
    await cloudinary.v2.uploader.destroy(existProduct.img.public_id);
    return {
      message: "Successfully delete product",
      success: true,
    };
  } catch (error) {
    return {
      message: "An error occurred",
      success: false,
    };
  }
};
const searchProduct =async(body)=>{
  try {
  

    const dataSearch = await Product.find( { $text: { $search: "ịphone" } } ).explain().queryPlanner.winningPlan.parsedTextQuery
    console.log(dataSearch);

    return{

      success:true,
      message:"Tìm kiếm thành công",
    }
  } catch (error) {
    return{
      
      success:false,
      message:"Lỗi",
    }
  }
}

module.exports = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductBySeller,
  searchProduct,
  getTypeProduct,
  updatePathProduct,
  getAllProductByCategory,
  getAllCategory,
  gettopProductBySeller,
  getCountProduct
};

