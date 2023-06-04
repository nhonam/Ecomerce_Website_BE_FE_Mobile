const productService = require("../services/product.services");
const controller = require("./controller");

const createProduct = async (req, res) => {
  try {
    
    const proService = await productService.createProduct(req.body);
    if (!proService.success)
      return controller.sendError(res, proService.message, 400);
    return controller.sendSuccess(
      res,
      proService.data,
      200,
      proService.message
    );
  } catch (error) {
    return controller.sendError(res);
  }
};

const checkProductExist = async( req, res) => {
  try {
   
    const proExist = await productService.getProduct(req.params.id, req.body); 
    if(proExist.success){
      const productSer = await productService.deleteProduct(req.params.id);
      console.log("da xoa sp vi trung nhau");
      if (!productSer.success)
      return controller.sendError(res, productSer.message, 400);
    return controller.sendSuccess(res, {}, 200, productSer.message);
    }
   
   
    return controller.sendError(res, proExist, 400);
  } catch (error) {
    return controller.sendError(res);
  }
}

const getProductMonthyear = async( req, res) => {
  try {
    const count = await productService.getCountProduct( req.params.id); 
    if(count.success){
    return controller.sendSuccess(res, {}, 200, count);
    }
    return controller.sendError(res, count, 400);
  } catch (error) {
    return controller.sendError(res);
  }
}

const getAllProductByCategory = async (req, res) => {
  try {
    const productSer = await productService.getAllProductByCategory(req.params.id);
    if (!productSer.success)
      return controller.sendError(res, productSer.message, 400);
    controller.sendSuccess(res, productSer.data, 200, productSer.message);
  } catch (error) {
    controller.sendError(res);
  }
};
const getProduct = async (req, res) => {
  try {
    const proService = await productService.getProduct(req.params);
    if (!proService.success)
      return controller.sendError(res, proService.message, 400);
    return controller.sendSuccess(
      res,
      proService.data,
      200,
      proService.message
    );
  } catch (error) {
    return controller.sendError(res);
  }
};
const getProductById = async (req, res) => {
  try {
    const proService = await productService.getProductById(req.params.id);
    if (!proService.success)
      return controller.sendError(res, proService.message, 400);
    return controller.sendSuccess(
      res,
      proService.data,
      200,
      proService.message
    );
  } catch (error) {
    return controller.sendError(res);
  }
};
const getTypeProduct = async(req,res)=>{
  try {
    const proService = await productService.getTypeProduct(req.body);
    if (!proService.success)
      return controller.sendError(res, proService.message, 400);
    return controller.sendSuccess(
      res,
      proService.data,
      200,
      proService.message
    );
  } catch (error) {
    return controller.sendError(res);
  }
}

const getAllProduct = async (req, res) => {
  try {
    const productSer = await productService.getAllProduct();
    if (!productSer.success)
      return controller.sendError(res, productSer.message, 400);
    controller.sendSuccess(res, productSer.data, 200, productSer.message);
  } catch (error) {
    controller.sendError(res);
  }
};

const getAllCategory = async (req, res) => {
  try {
    const productSer = await productService.getAllCategory();
    if (!productSer.success)
      return controller.sendError(res, productSer.message, 400);
    controller.sendSuccess(res, productSer.data, 200, productSer.message);
  } catch (error) {
    controller.sendError(res);
  }
};
const updateProduct = async (req, res) => {
  try {
    const productSer = await productService.updateProduct(
      req.params.id,
      req.body
    );
    if (!productSer.success)
      return controller.sendError(res, productSer.message, 400);
    return controller.sendSuccess(
      res,
      productSer.data,
      200,
      productSer.message
    );
  } catch (err) {
    return controller.sendError(res);
  }
};
const deleteProduct = async (req, res) => {
  try {
    const productSer = await productService.deleteProduct(req.params.id);
    if (!productSer.success)
      return controller.sendError(res, productSer.message, 400);
    return controller.sendSuccess(res, {}, 200, productSer.message);
  } catch (error) {
    return controller.sendError(res);
  }
};
const patchProduct = async (req, res) => {
  try {
    const productSer = await productService.updatePathProduct(
      req.params.id,
      req.body
    );
    if (!productSer.success)
      return controller.sendError(res, productSer.message, 400);
    return controller.sendSuccess(
      res,
      productSer.data,
      200,
      productSer.message
    );
  } catch (err) {
    return controller.sendError(res);
  }
};
const getProductBySeller = async (req, res) => {
  try {
    const productSer = await productService.getProductBySeller(req.body);
    if (!productSer.success)
      return controller.sendError(res, productSer.message, 400);
    return controller.sendSuccess(
      res,
      productSer.data,
      200,
      productSer.message
    );
  } catch (error) {
    return controller.sendError(res);
  }
};

const getTopProduct = async (req, res) => {
  try {
    const statusSer = await productService.gettopProductBySeller(req.body.id);
    if (!statusSer.success) return controller.sendError(res, statusSer.message, 400);
    return controller.sendSuccess(res, statusSer.data, 200, statusSer.message);
  } catch (error) {
    return controller.sendError(res);
  }}
const searchProduct = async (req, res) => {
  try {
    const productSer = await productService.searchProduct(req.body);
    if (!productSer.success)
      return controller.sendError(res, productSer.message, 400);
    return controller.sendSuccess(
      res,
      productSer.data,
      200,
      productSer.message
    );
  } catch (error) {
    return controller.sendError(res);
  }
};
module.exports = Controller = {
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProductBySeller,
  getTypeProduct,
  searchProduct,
  getAllProductByCategory,
  patchProduct,
  getAllCategory,
  checkProductExist,
  getTopProduct,
  getProductMonthyear,
  getProductById
};
