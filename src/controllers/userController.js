import user from "../models/user";
import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing input parameters",
    });
  }

  let userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    errMessage: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUsers = async (req, res) => {
  let { id } = req.query;

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters",
      users: [],
    });
  }
  let users = await userService.getAllUsers(id);

  return res.status(200).json({
    errCode: 0,
    errMessage: "OK",
    users: users,
  });
};

let handleCreateUser = async (req, res) => {
  try {
    let message = await userService.createNewUser(req.body);
    return res.status(201).json(message);
  } catch (e) {
    console.log(e);
  }
};

let handleEditUser = async (req, res) => {
  try {
    let data = req.body;
    let message = await userService.editUser(data);
    return res.status(200).json(message);
  } catch (e) {
    console.log(e);
  }
};

let handleDeleteUser = async (req, res) => {
  try {
    let { id } = req.body;
    if (!id) {
      return res.status(201).json({
        errCode: 1,
        errMessage: "Missing required parameters!",
      });
    }

    let message = await userService.deleteUser(id);

    return res.status(201).json(message);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  handleLogin,
  handleGetAllUsers,
  handleCreateUser,
  handleEditUser,
  handleDeleteUser,
};
