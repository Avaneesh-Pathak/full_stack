const prisma = require("../config/prisma");
const moment = require("moment");

/* GET ALL USERS */
const getVaccinationHistorysDB = async (vaccinationHistoryId, studentId, search) => {
    try {
      console.log("getVaccinationHistorysDB called");
  
      let where = {};
  
      if (vaccinationHistoryId) where.id = parseInt(vaccinationHistoryId);
      if(studentId) where.student_id = parseInt(studentId);
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
      const data = await prisma.vaccination_history.findMany({
        where,
        orderBy: {
          due_date: 'asc'
        }
      });
      return data;
    } catch (err) {
      if (err.message) err = err.message;
      console.log("getVaccinationHistorysDB error", err);
      return [];
    }
  }
  
  /* GET TENANT BY NAME */
  const getVaccinationHistoryByNameDB = async (email) => {
    try {
      console.log("getVaccinationHistorybyNameDB called");
  
      const data = await prisma.vaccination_history.findUnique({
        where: {
          email: email,
        },
      });
      return data;
    } catch (err) {
      if (err.message) err = err.message;
      console.log("getVaccinationHistorybyNameDB error", err);
      return {};
    }
  }
  
  /* GET TENANT BY ID */
  const getVaccinationHistoryByIdDB = async (id) => {
    try {
      console.log("getVaccinationHistoryByIdDB called");
  
  
      const data = await prisma.vaccination_history.findFirst({
        where: {
          id: id
        },
      });
      return data;
    } catch (err) {
      if (err.message) err = err.message;
      console.log("getVaccinationHistoryByIdDB error", err);
      return {};
    }
  }
  

  /* CREATE TENANT */
  const createVaccinationHistoryDB = async (student, dateOfBirth) => {
    try {
      console.log("createVaccinationHistoryDB called");
      let date_ob = moment().format('YYYY-MM-DD HH:mm:ss');
      let dob = moment(dateOfBirth);
      let expiry_date = moment().add(15, 'days').format('YYYY-MM-DD');
      const dates = {
        "6 weeks": dob.clone().add(6, 'weeks').format('YYYY-MM-DD'),
        "10 weeks": dob.clone().add(10, 'weeks').format('YYYY-MM-DD'),
        "14 weeks": dob.clone().add(14, 'weeks').format('YYYY-MM-DD'),
        "6 months": dob.clone().add(6, 'months').format('YYYY-MM-DD'),
        "7 months": dob.clone().add(7, 'months').format('YYYY-MM-DD'),
        "9 months": dob.clone().add(9, 'months').format('YYYY-MM-DD'),
        "12 months": dob.clone().add(12, 'months').format('YYYY-MM-DD'),
        "15 months": dob.clone().add(15, 'months').format('YYYY-MM-DD'),
        "18 months": dob.clone().add(18, 'months').format('YYYY-MM-DD'),
        "2 years": dob.clone().add(2, 'years').format('YYYY-MM-DD'),
        "3 years": dob.clone().add(3, 'years').format('YYYY-MM-DD'),
        "4 years": dob.clone().add(4, 'years').format('YYYY-MM-DD'),
        "5 years": dob.clone().add(5, 'years').format('YYYY-MM-DD'),
        "6 years": dob.clone().add(6, 'years').format('YYYY-MM-DD'),
        "7 years": dob.clone().add(7, 'years').format('YYYY-MM-DD'),
        "8 years": dob.clone().add(8, 'years').format('YYYY-MM-DD'),
        "14 years": dob.clone().add(14, 'years').format('YYYY-MM-DD'),
        "18 years": dob.clone().add(18, 'years').format('YYYY-MM-DD')
    };
      let insertRows = [
        { 
          student_id: student.id,
          type: 0,
          age: "Birth",
          vaccine: "BCG;Hep B1;OPV 0",
          due_date: dateOfBirth
        },
        { 
          student_id: student.id,
          type: 0,
          age: "6 Weeks",
          vaccine: "DTaP/DTwP 1;Hib 1;IPV 1;Hep B2;PCV 1;Rota Virus 1",
          due_date: dates["6 weeks"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "10 Weeks",
          vaccine: "DTaP/DTwP 2;Hib 2;IPV 2;Hep B3;PCV 2;Rota Virus 2",
          due_date: dates["10 weeks"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "14 Weeks",
          vaccine: "DTaP/DTwP 3;Hib 3;IPV 3;Hep B4;PCV 3;Rota Virus 3",
          due_date: dates["14 weeks"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "6 Months",
          vaccine: "TCV;Influenza vaccine",
          due_date: dates["6 months"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "7 Months",
          vaccine: "Influenza Vaccine",
          due_date: dates["7 months"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "9 Months",
          vaccine: "MMR 1;MCV 1",
          due_date: dates["9 months"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "12 Months",
          vaccine: "HepA 1;MCV 2",
          due_date: dates["12 months"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "15 Months",
          vaccine: "PCV B1;MMR 2;Varicella 1",
          due_date: dates["15 months"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "16-18 Months",
          vaccine: "DTaP/DTwP B1;Hib B1;IPV B1",
          due_date: dates["18 months"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "18-24 Months",
          vaccine: "Varicella 2;Hep A2",
          due_date: dates["2 years"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "2 Years",
          vaccine: "Influenza vaccine;MCV",
          due_date: dates["2 years"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "3 Years",
          vaccine: "Influenza Vaccine",
          due_date: dates["3 years"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "4 Years",
          vaccine: "Influenza Vaccine",
          due_date: dates["4 years"],
        }
        ,{ 
          student_id: student.id,
          type: 0,
          age: "4-6 Years",
          vaccine: "IPV B2;DTaP/DTwP B2;MMR 3",
          due_date: dates["6 years"],
        },{ 
          student_id: student.id,
          type: 0,
          age: "5 Years",
          vaccine: "Influenza Vaccine",
          due_date: dates["5 years"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "6 Years",
          vaccine: "Influenza Vaccine",
          due_date: dates["6 years"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "7 Years",
          vaccine: "Influenza Vaccine",
          due_date: dates["7 years"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "8 Years",
          vaccine: "Influenza Vaccine",
          due_date: dates["8 years"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "9-14 Years",
          vaccine: "Tdap/Td;HPV 1;HPV 2",
          due_date: dates["14 years"],
        },
        { 
          student_id: student.id,
          type: 0,
          age: "15-18 Years",
          vaccine: "HPV 1;HPV 2;HPV 3",
          due_date: dates["18 years"],
        },
        { 
          student_id: student.id,
          type: 1,
          age: "Rabies",
          vaccine: "Single Dose"
        },
        { 
          student_id: student.id,
          type: 1,
          age: "Cholera",
          vaccine: "Dose 1;Dose 2"
        },
        { 
          student_id: student.id,
          type: 1,
          age: "JE",
          vaccine: "Dose 1;Dose 2"
        },
        { 
          student_id: student.id,
          type: 1,
          age: "Yellow Fever",
          vaccine: "Single Dose"
        }
      ];
  
      const data = await prisma.vaccination_history.createMany({
        data: insertRows,
        skipDuplicates: true,
      });
      return data;
    } catch (err) {
      // if (err.message) err = err.message;
      console.log("createVaccinationHistoryDB error", err);
      return {};
    }
  }
  
  /* UPDATE TENANT */
  const updateVaccinationHistoryDB = async (newVaccinationHistoryData, oldVaccinationHistoryData) => {
    try {
      console.log("updateVaccinationHistoryDB called");
      let date_ob = moment().format('YYYY-MM-DD HH:mm:ss');
  
      const data = await prisma.vaccination_history.update({
        where: {
          id: oldVaccinationHistoryData.id,
        },
        data: {
          name: newVaccinationHistoryData.name || oldVaccinationHistoryData.name,
          email: newVaccinationHistoryData.email || oldVaccinationHistoryData.email,
          sex: newVaccinationHistoryData.sex || oldVaccinationHistoryData.sex,
          date_of_birth: newVaccinationHistoryData.dateOfBirth || oldVaccinationHistoryData.date_of_birth,
          code: newVaccinationHistoryData.code || oldVaccinationHistoryData.code,
          number: newVaccinationHistoryData.mobileNumber || oldVaccinationHistoryData.number,
          address: newVaccinationHistoryData.address || oldVaccinationHistoryData.address,
          city: newVaccinationHistoryData.city || oldVaccinationHistoryData.city,
          state: newVaccinationHistoryData.state || oldVaccinationHistoryData.state,
          zip: newVaccinationHistoryData.zip || oldVaccinationHistoryData.zip,
          updated_at: date_ob
        },
      });
      return data;
    } catch (err) {
      if (err.message) err = err.message;
      console.log("updateVaccinationHistoryDB error", err);
      return {};
    }
  }
  
  /* DELETE TENANT */
  const deleteVaccinationHistoryDB = async (id) => {
    try {
      console.log("deleteVaccinationHistoryDB called");
  
      const data = await prisma.vaccination_history.delete({
        where: {
          id: id
        },
      });
      return data;
    } catch (err) {
      if (err.message) err = err.message;
      console.log("deleteVaccinationHistoryDB error", err);
      return {};
    }
  }
  
  module.exports = {
    getVaccinationHistorysDB,
    getVaccinationHistoryByIdDB,
    getVaccinationHistoryByNameDB,
    createVaccinationHistoryDB,
    updateVaccinationHistoryDB,
    deleteVaccinationHistoryDB,
  }