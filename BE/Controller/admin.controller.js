const adminService = require("../services/admin.services");
const controller = require("./controller");
function formatDate(m) {
  new Date(m);
  const dateString =
    m.getUTCFullYear() +
    "/" +
    ("0" + (m.getMonth() + 1)).slice(-2) +
    "/" +
    ("0" + m.getDate()).slice(-2) +
    "  " +
    ("0" + m.getHours()).slice(-2) +
    ":" +
    ("0" + m.getMinutes()).slice(-2);
  return dateString;
}
const register = async (req, res) => {
  try {
   
    const resAuth = await adminService.register(req.body);
    if (!resAuth.success)
      return controller.sendError(res, resAuth.message, 300);
    return controller.sendSuccess(res,[ ], 200, resAuth.message);
  } catch (error) {
    return controller.sendError(res);
  }
};
const login = async (req, res) => {
  try {
    const resServices = await adminService.login(req.body);
    if (!resServices.success)
      return controller.sendError(res, resServices.message, 300);
    return controller.sendSuccess(res, resServices.data, 200, resServices.message);
  } catch (error) {
    return controller.sendError(res);
  }
};


const getAuth = async (req, res) => {
  try {
    const body = req.value.body;
    const _id = body.decodeToken.data;
    const token = body.token;
    const CheckData = await adminService.getAuth({ _id, token });
    if (!CheckData) return controller.sendError(res, CheckData.message, 300);
    return controller.sendSuccess(res, CheckData.data, 200, CheckData.message);
  } catch (error) {
    return controller.sendError(res);
  }
};
const sendMail =async (req, res)=>{
  try {
    const resAuth =await  adminService.sendMail(req.body)
    if(!resAuth.success) return  controller.sendError(res, resAuth.message,300)
    return controller.sendSuccess(res, resAuth.data, 200, resAuth.message)
  } catch (error) {
    return controller.sendError(res)
    
  }
}

const sendMailNotification =async (req, res)=>{
  try {
    
    const resAuth =await  adminService.sentEmailNotification(req.body)
    return controller.sendSuccess(res, resAuth, 200, resAuth.message)
  } catch (error) {
    return controller.sendError(res)
    
  }
}
const verifyUser = async(req, res)=>{
  try {
    const {token,_id}=req.body
    const resAuth = await adminService.verifyUser(req.params.id, token,_id)
    if(!resAuth.success) return  controller.sendError(res, resAuth.message,300)
    return controller.sendSuccess(res, resAuth.data, 200, resAuth.message)
  } catch (error) {
    return controller.sendError(res)
    
  }
}
const updateProfile=async (req, res) => {
  try {
    const id= req.body.id
    delete req.body.id
    // console.log(req.body);
    const resServices = await adminService.updateProfile(id, req.body)
    if (!resServices.success)
      return controller.sendError(res, resServices.message, 300);
    return controller.sendSuccess(res, resServices.data, 200, resServices.message);
  } catch (error) {
    return controller.sendError(res);
  }
};

const updatePatchProfile=async (req, res) => {
  try {
    const id= req.body.id
    delete req.body.id
    // console.log(req.body);
    const resServices = await adminService.updateProfile(id, req.body)
    if (!resServices.success)
      return controller.sendError(res, resServices.message, 300);
    return controller.sendSuccess(res, resServices.data, 200, resServices.message);
  } catch (error) {
    return controller.sendError(res);
  }
};
module.exports = Controller = {
  register,
  login,
  getAuth,
  sendMail,
  verifyUser,
  updateProfile,
  updatePatchProfile,
  sendMailNotification
};
