const prisma = require("../config/prisma");
const moment = require("moment");

/* GET USER BY EMAIL ID */
const getUserbyEmailDB = async (email) => {
  try {
    console.log("getUserbyemailDB called");

    const data = await prisma.user.findUnique({
      where: {
        email: email,

      }
    });
    return data;
  } catch (err) {
    if (err.message) err = err.message;
    console.log("getUserbyemailDB error", err);
    return [];
  }
}

/* CREATE STUDENT */
/* Prisma Controller to create a new student */
const createUserDB = async (userData) => {
  try {
    console.log("createUserDB called");
    let date_ob = moment().format('YYYY-MM-DD HH:mm:ss');

    const data = await prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role_id: userData.userRole,
        created_at: date_ob,
        updated_at: date_ob
      },
    });
    return data;
  } catch (err) {
    // if (err.message) err = err.message;
    console.log("createUserDB error", err);
    return {};
  }
}

/* UPDATE STUDENT */
/* Prisma Controller to update a student */
const updateUsertDB = async (userData, oldUserData, id) => {
  try {
    console.log("updateUsertDB called");
    let date_ob = moment().format('YYYY-MM-DD HH:mm:ss');

    const data = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        password: userData.password || oldUserData.password,
        name: userData.name || oldUserData.name,
        mobile_no: userData.mobileNumber || oldUserData.mobileNumber,
        role_id: userData.userRole || oldUserData.userRole,
        updated_at: date_ob
      },
    });
    return data;
  } catch (err) {
    if (err.message) err = err.message;
    console.log("updateUsertDB error", err);
    return [];
  }
}

/* DELETE STUDENT */
const deleteUserDB = async (id) => {
  try {
    console.log("deleteUserDB called");

    // const seatDelete = await prisma.student_seat_allotment.deleteMany({
    //   where: {
    //     student_id: id
    //   }
    // });

    const data = await prisma.user.delete({
      where: {
        id: id
      },
    });
    return data;
  } catch (err) {
    if (err.message) err = err.message;
    console.log("deleteUserDB error", err);
    return {};
  }
}

/* GET USER BY EMAIL ID */
const getUserByIdDB = async (id) => {
  try {
    console.log("getUserByIdDB called");


    const data = await prisma.user.findFirst({
      where: {
        id: id
      },
    });
    return data;
  } catch (err) {
    if (err.message) err = err.message;
    console.log("getUserByIdDB error", err);
    return {};
  }
}
  
  module.exports = {
    getUserbyEmailDB,
    createUserDB,
    updateUsertDB,
    deleteUserDB,
    getUserByIdDB
  }