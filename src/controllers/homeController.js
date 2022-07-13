import db from "../models/index";
import CRUDservice from "../services/CRUDservice";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let getContactPage = (req, res) => {
  return res.render("test/contact.ejs");
};

let getCRUD = async (req, res) => {
  try {
    let data = await db.User.findAll();

    return res.render("crud.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let postCRUD = async (req, res) => {
  try {
    let message = await CRUDservice.createNewUser(req.body);
    console.log(message);
    return res.send("post crud");
  } catch (e) {
    console.log(e);
  }
};

let displayCRUD = async (req, res) => {
  try {
    let data = await CRUDservice.getAllUser();

    return res.render("displayCRUD.ejs", {
      data: data,
    });
  } catch (e) {
    console.log(e);
  }
};

let getEditCRUD = async (req, res) => {
  try {
    let { id } = req.query;

    if (id) {
      let user = await CRUDservice.getUserInfoById(id);

      return res.render("editCRUD.ejs", {
        data: user,
      });
    } else {
      return res.send(`Not found user ${id}`);
    }
  } catch (e) {
    console.log(e);
  }
};

let putCRUD = async (req, res) => {
  try {
    let data = req.body;
    let allUsers = await CRUDservice.userUpdateData(data);
    return res.render("displayCRUD.ejs", {
      data: allUsers,
    });
  } catch (e) {
    console.log(e);
  }
};

let deleteCRUD = async (req, res) => {
  try {
    let { id } = req.query;
    if (id) {
      await CRUDservice.deleteUserById(id);
      return res.send("Delete user done");
    } else {
      return res.send(`Not found %${id}`);
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getHomePage,
  getContactPage,
  getCRUD,
  postCRUD,
  displayCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};
