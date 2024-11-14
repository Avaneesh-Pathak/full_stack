const prisma = require("../config/prisma");
const moment = require("moment");

/* GET ALL USERS */
const getSchoolsDB = async (schoolId, search) => {
    try {
      console.log("getSchoolsDB called");
  
      let where = {};
  
      if (schoolId) where.id = schoolId;
      if (search && search.length) {
        where = {
          OR: [{
              contact_email: {
                contains: `%${search}%`
              }
            },
            {
              name: {
                contains: `%${search}%`
              }
            },
            {
              contact_number: {
                contains: `%${search}%`
              }
            },
            {
              email: {
                contains: `%${search}%`
              }
            }
          ]
        };
      }
      const data = await prisma.school.findMany({
        where,
        orderBy: {
          created_at: 'desc'
        }
      });
      return data;
    } catch (err) {
      if (err.message) err = err.message;
      console.log("getSchoolsDB error", err);
      return [];
    }
  }
  
  /* GET TENANT BY NAME */
  const getSchoolByNameDB = async (email) => {
    try {
      console.log("getSchoolbyNameDB called");
  
      const data = await prisma.school.findUnique({
        where: {
          email: email,
        },
      });
      return data;
    } catch (err) {
      if (err.message) err = err.message;
      console.log("getSchoolbyNameDB error", err);
      return {};
    }
  }
  
  /* GET TENANT BY ID */
  const getSchoolByIdDB = async (id) => {
    try {
      console.log("getSchoolByIdDB called");
  
  
      const data = await prisma.school.findFirst({
        where: {
          id: id
        },
      });
      return data;
    } catch (err) {
      if (err.message) err = err.message;
      console.log("getSchoolByIdDB error", err);
      return {};
    }
  }
  

  /* CREATE TENANT */
  const createSchoolDB = async (schoolData, user) => {
    try {
      console.log("createSchoolDB called");
      let date_ob = moment().format('YYYY-MM-DD HH:mm:ss');
      let expiry_date = moment().add(15, 'days').format('YYYY-MM-DD');
  
      const data = await prisma.school.create({
        data: {
          name: schoolData.name,
          email: schoolData.email,
          contact_no: schoolData.mobileNumber!=''? schoolData.mobileNumber : undefined,
          code: schoolData.code,
          address: schoolData.address!=''? schoolData.address : undefined,
          city: schoolData.city!=''? schoolData.city : undefined,
          state: schoolData.state!=''? schoolData.state : undefined,
          zip: schoolData.zip!=''? parseInt(schoolData.zip) : undefined,
          created_by_user_id: user.userId,
          created_at: date_ob,
          updated_at: date_ob
        },
      });
      return data;
    } catch (err) {
      // if (err.message) err = err.message;
      console.log("createSchoolDB error", err);
      return {};
    }
  }
  
  /* UPDATE TENANT */
  const updateSchoolDB = async (newSchoolData, oldSchoolData) => {
    try {
      console.log("updateSchoolDB called");
      let date_ob = moment().format('YYYY-MM-DD HH:mm:ss');
  
      const data = await prisma.school.update({
        where: {
          id: oldSchoolData.id,
        },
        data: {
          name: newSchoolData.name || oldSchoolData.name,
          email: newSchoolData.email || oldSchoolData.email,
          contact_no: newSchoolData.mobileNumber || oldSchoolData.contact_no,
          address: newSchoolData.address || oldSchoolData.address,
          city: newSchoolData.city || oldSchoolData.city,
          state: newSchoolData.state || oldSchoolData.state,
          zip: newSchoolData.zip || oldSchoolData.zip,
          updated_at: date_ob
        },
      });
      return data;
    } catch (err) {
      if (err.message) err = err.message;
      console.log("updateSchoolDB error", err);
      return {};
    }
  }
  
  /* DELETE TENANT */
  const deleteSchoolDB = async (id) => {
    try {
      console.log("deleteSchoolDB called");
  
      const data = await prisma.school.delete({
        where: {
          id: id
        },
      });
      return data;
    } catch (err) {
      if (err.message) err = err.message;
      console.log("deleteSchoolDB error", err);
      return {};
    }
  }
  
  module.exports = {
    getSchoolsDB,
    getSchoolByIdDB,
    getSchoolByNameDB,
    createSchoolDB,
    updateSchoolDB,
    deleteSchoolDB,
  }