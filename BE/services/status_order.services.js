const Product = require("../models/Product");
const USER = require("../models/Admin");
const Status_Orders = require("../models/StatusOrders");
const Cart = require("../models/Cart");
const payment = require("./MoMo.service")
const _ = require("lodash");
const buyProduct = async (body) => {
  try {
    const listItem=[]
    const b = Object.values(_.groupBy(body.products, "seller.seller._id"));
  
    for (let index = 0; index < b.length; index++) {
      var c = 0;
      b[index].map((item) => (c += Number(item.seller.price * item.quantity)));
      const data = {
        customer: body.customer,
        products: b[index],
        address: body.address,
        total_amount: c,
        shop: b[index][0].seller.seller._id,
      };
     
      const new_status_order = new Status_Orders(data);
      await new_status_order.save();
      listItem.push(new_status_order._id)
    }
    console.log(listItem,"------------------");
    const a = [];
    body.products.map((item) => a.push(item.index));

    const product = Object.values(_.groupBy(body.products, "seller._id"));

    product.map((item) => {
      item[0].quantity = item[0].seller.quantity - item[0].quantity;
    });

    for (let index = 0; index < product.length; index++) {
      await Product.findByIdAndUpdate(
        { _id: product[index][0].product },
        { quantity: product[index][0].quantity }
      );
    }
     await Cart.deleteMany({ createdAt: { $in: a } });
    
    return {
      message: "Buy product successfully!",
      data: listItem,
      success: true,
    };
  } catch (error) {
    return {
      message: "An erroraaa occurred!",
      success: false,
    };
  }
};
const getStatusByUser = async (id) => {
  try {
    const find = await Status_Orders.find({ customer: id });
    return {
      data: find,
      message: "Tìm kiếm thành công",
      success: true,
    };
  } catch (error) {
    return {
      message: "Lỗi ",
      success: false,
    };
  }
};
const getStatusBySeller = async (id) => {
  try {
    const find = await Status_Orders.find({ shop: id });
    return {
      data: find,
      message: "Tìm kiếm thành công",
      success: true,
    };
  } catch (error) {
    return {
      message: "Lỗi ",
      success: false,
    };
  }
};
const getStatusId = async (id) => {
  try {
    const purchase = await Status_Orders.findById({ _id: id });
    if (!purchase) {
      return {
        message: "Lỗi",
        success: false,
      };
    }
    return {
      data: purchase,
      success: true,
      message: "Done",
    };
  } catch (error) {
    return {
      message: "Lỗi",
      success: false,
    };
  }
};
const confirmSellProduct = async (id) => {
  try {
// console.log(id)
// const ad = await Status_Orders.findById({_id: "63aff6c36abf949a048f4fdd"})
// return{
//   data: ad,
//   success:  true
// }
// console.log(ad)
    const confirm =  await Status_Orders.findByIdAndUpdate(
      { _id: id.id },
      { status: "SHIPPING" }
    );
  
    if (confirm)
        {
          const data= await Status_Orders.findById({_id: id.id})
          return {
            data : data,
            message: "successful sale confirmed!!!",
            success: true,
          };
        }
  } catch (error) {
    return {
      message: "An error occured!",
    };
  }
};

module.exports = {
  buyProduct,
  getStatusByUser,
  getStatusBySeller,
  getStatusId,
  confirmSellProduct
};
