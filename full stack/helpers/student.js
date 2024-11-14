const prisma = require("../config/prisma");
const moment = require("moment");
const { createVaccinationHistoryDB } = require("./vaccination-history");

/* GET ALL USERS */
const getStudentsDB = async (schoolId, search) => {
  try {
    console.log("getStudentsDB called");

    let where = {};
    if (schoolId) where.school_id = parseInt(schoolId);
    if (search && search.length) {
      where = {
        OR: [
          {
            name: {
              contains: `%${search}%`,
            },
          },
          {
            code: {
              contains: `%${search}%`,
            },
          },
        ],
      };
    }

    // const products = await prisma.products.findMany({
    //   where: { category: ProductsCategoryEnum[category] },
    //   select: {
    //     // also need to select any other fields you need here
    //     vehicles: {
    //       // Updated this
    //       select: { manufacturers: true },
    //       // Updated this to add an explicit "where" clause
    //       where: {
    //         manufacturers: { name: { in: { manufacturers.map(item => `"${item}"`) } } },
    //       },
    //     },
    //   },
    // });
    const data = await prisma.student.findMany({
      where,
      include: {
        school: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return data;
  } catch (err) {
    if (err.message) err = err.message;
    console.log("getStudentsDB error", err);
    return [];
  }
};

/* GET TENANT BY NAME */
const getStudentByNameDB = async (email) => {
  try {
    console.log("getStudentbyNameDB called");

    const data = await prisma.student.findUnique({
      where: {
        email: email,
      },
    });
    return data;
  } catch (err) {
    if (err.message) err = err.message;
    console.log("getStudentbyNameDB error", err);
    return {};
  }
};

/* GET TENANT BY ID */
const getStudentByIdDB = async (id) => {
  try {
    console.log("getStudentByIdDB called");

    const data = await prisma.student.findFirst({
      where: {
        id: id,
      },
    });
    return data;
  } catch (err) {
    if (err.message) err = err.message;
    console.log("getStudentByIdDB error", err);
    return {};
  }
};

/* CREATE TENANT */
const createStudentDB = async (studentData, user) => {
  try {
    console.log("createStudentDB called");
    let date_ob = moment().format("YYYY-MM-DD HH:mm:ss");
    let expiry_date = moment().add(15, "days").format("YYYY-MM-DD");

    const data = await prisma.student.create({
      data: {
        name: studentData.name,
        email: studentData.email,
        sex: studentData.sex,
        date_of_birth: studentData.dateOfBirth,
        number:
          studentData.mobileNumber != "" ? studentData.mobileNumber : undefined,
        code: studentData.studentCode,
        address: studentData.address != "" ? studentData.address : undefined,
        city: studentData.city != "" ? studentData.city : undefined,
        state: studentData.state != "" ? studentData.state : undefined,
        zip: studentData.zip != "" ? parseInt(studentData.zip) : undefined,
        school_id: parseInt(studentData.schoolId),
        created_by_user_id: user.userId,
        created_at: date_ob,
        updated_at: date_ob,
      },
    });

    console.log(data);

    const vaccineData = await createVaccinationHistoryDB(
      data,
      data.date_of_birth
    );
    return data;
  } catch (err) {
    // if (err.message) err = err.message;
    console.log("createStudentDB error", err);
    return {};
  }
};

/* UPDATE TENANT */
const updateStudentDB = async (newStudentData, oldStudentData) => {
  try {
    console.log("updateStudentDB called");
    let date_ob = moment().format("YYYY-MM-DD HH:mm:ss");

    const data = await prisma.student.update({
      where: {
        id: oldStudentData.id,
      },
      data: {
        name: newStudentData.name || oldStudentData.name,
        email: newStudentData.email || oldStudentData.email,
        sex: newStudentData.sex || oldStudentData.sex,
        date_of_birth:
          newStudentData.dateOfBirth || oldStudentData.date_of_birth,
        code: newStudentData.code || oldStudentData.code,
        number: newStudentData.mobileNumber || oldStudentData.number,
        address: newStudentData.address || oldStudentData.address,
        city: newStudentData.city || oldStudentData.city,
        state: newStudentData.state || oldStudentData.state,
        zip: newStudentData.zip || oldStudentData.zip,
        updated_at: date_ob,
      },
    });
    return data;
  } catch (err) {
    if (err.message) err = err.message;
    console.log("updateStudentDB error", err);
    return {};
  }
};

/* DELETE TENANT */
const deleteStudentDB = async (id) => {
  try {
    console.log("deleteStudentDB called");

    const data = await prisma.student.delete({
      where: {
        id: id,
      },
    });
    return data;
  } catch (err) {
    if (err.message) err = err.message;
    console.log("deleteStudentDB error", err);
    return {};
  }
};

module.exports = {
  getStudentsDB,
  getStudentByIdDB,
  getStudentByNameDB,
  createStudentDB,
  updateStudentDB,
  deleteStudentDB,
};
