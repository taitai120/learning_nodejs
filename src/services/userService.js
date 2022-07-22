import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      var hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let handleUserLogin = async (userEmail, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(userEmail);
      if (isExist) {
        let user = await db.User.findOne({
          where: {
            email: userEmail,
          },
          raw: true,
          attributes: ["email", "roleId", "password"],
        });

        if (user) {
          let check = await bcrypt.compare(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "OK";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User not found`;
        }

        resolve(userData);
      } else {
        userData.errCode = 1;
        userData.errMessage = `Your email is'nt exist in the system. Please try another email`;
        resolve(userData);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = async (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {
          email: userEmail,
        },
      });

      if (user) {
        resolve(true);
      }

      resolve(false);
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUsers = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL".toLocaleLowerCase()) {
        users = await db.User.findAll();
      }
      if (userId && userId !== "ALL".toLocaleLowerCase()) {
        users = await db.User.findOne({
          where: {
            id: userId,
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkEmail = await checkEmailExist(data.email);

      if (!checkEmail) {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          gender: data.gender === "1" ? true : false,
          roleId: data.roleId,
          phonenumber: data.phonenumber,
        });
        resolve({
          errCode: 0,
          errMessage: "Create a new user OK",
        });
      } else {
        resolve(checkEmail);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let checkEmailExist = async (inputEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let message = "";
      let checkEmail = await db.User.findOne({
        where: {
          email: inputEmail,
        },
      });

      // Email no exist
      if (checkEmail) {
        resolve({
          errCode: 1,
          errMessage: "Email already exists, please try with another email",
        });
      }

      resolve(false);
    } catch (e) {
      reject(e);
    }
  });
};

let editUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = {};
      if (!data.id) {
        response.errCode = 2;
        response.errMessage = "Missing required parameters";

        resolve(response);
      }

      let user = await db.User.findOne({
        where: {
          id: data.id,
        },
        raw: false,
      });

      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();
        response.errCode = 0;
        response.errMessage = "Edit user OK";
      } else {
        response.errCode = 1;
        response.errMessage = "User not found;";
      }

      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = async (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = {};
      let user = await db.User.destroy({
        where: {
          id: inputId,
        },
      });
      if (user === 1) {
        response.errCode = 0;
        response.errMessage = "Delete user OK";
      } else {
        response.errCode = 2;
        response.errMessage = "User not found";
      }
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin,
  getAllUsers,
  createNewUser,
  editUser,
  deleteUser,
};
