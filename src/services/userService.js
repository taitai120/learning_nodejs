import db from "../models/index";
import bcrypt from "bcryptjs";

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
          let check = await bcrypt.compareSync(password, user.password);
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
      if (userId === "ALL") {
        users = await db.User.findAll();
      }
      if (userId && userId !== "ALL") {
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

module.exports = {
  handleUserLogin,
  getAllUsers,
};
