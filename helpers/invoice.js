const prisma = require("../config/prisma");
const moment = require('moment');

/* GET ALL USERS */
const getInvoicesDB = async (invoiceId, search, startDate, endDate, includeAll=true, tenantId) => {
    try {
        console.log("getInvoicesDB called");

        let where = {
          tenant_id: tenantId
        };
        let include = {
          company_to: true,
        };

        if (invoiceId) where.invoice_id = invoiceId;
        // if (search && search.length) {
        //     where = {
        //       invoice_id: `%${search}%`
        //     };
        // }
        if(startDate){
          where.invoice_date = {
              gte: startDate
          };
        }

        if(endDate){
          where.invoice_date= {
              lte: endDate
          }
        };

        if(includeAll) include = {
          company_to: true,
          company_from: true,
          invoice_product: true,
        }
        
        const data = await prisma.invoice.findMany({
            where,
            orderBy: {
                invoice_id: 'desc'
            },
            include
        });
        return data;
    } catch (err) {
        if (err.message) err = err.message;
        console.log("getInvoicesDB error", err);
        return [];
    }
}

const createInvoiceDB = async (studentData, tenantId) => {
    try {
      console.log("createInvoiceDB called");
      let date_ob = moment().format('YYYY-MM-DD HH:mm:ss');
  
      const data = await prisma.invoice.create({
        data: {
            tenant_id: tenantId,
            company_from_id: studentData.companyFrom,
            company_to_id: studentData.companyTo,
            invoice_date: studentData.invoiceDate,
            invoice_amount: studentData.invoiceAmount,
            invoice_id: studentData.invoiceId,
            created_at: date_ob,
            updated_at: date_ob
        },
      });
      return data;
    } catch (err) {
      // if (err.message) err = err.message;
      console.log("createInvoiceDB error", err);
      return {};
    }
}

const createCompanyFromDB = async (companyData, tenantId) => {
    try {
      console.log("createCompanyFromDB called");
      let date_ob = moment().format('YYYY-MM-DD HH:mm:ss');
  
      const data = await prisma.company_from.create({
        data: {
            tenant_id: tenantId,
            name: companyData.name,
            email: companyData.email,
            contact_no: companyData.mobileNumber,
            address: companyData.address,
            gst_no: companyData.gstNumber,
            created_at: date_ob,
            updated_at: date_ob
        },
      });
      return data;
    } catch (err) {
      // if (err.message) err = err.message;
      console.log("createCompanyFromDB error", err);
      return {};
    }
}

const createCompanyToDB = async (companyData, tenantId) => {
    try {
      console.log("createCompanyToDB called");
      let date_ob = moment().format('YYYY-MM-DD HH:mm:ss');
  
      const data = await prisma.company_to.create({
        data: {
            tenant_id: tenantId,
            name: companyData.name,
            email: companyData.email,
            contact_no: companyData.mobileNumber,
            address: companyData.address,
            gst_no: companyData.gstNumber,
            created_at: date_ob,
            updated_at: date_ob
        },
      });
      return data;
    } catch (err) {
      // if (err.message) err = err.message;
      console.log("createCompanyToDB error", err);
      return {};
    }
}

const createProductDB = async (productData, invoiceId) => {
    try {
      console.log("createProductDB called");
      let date_ob = moment().format('YYYY-MM-DD HH:mm:ss');

      for(let i=0;i<productData.length; i++){
        productData[i].invoice_id = invoiceId,
        productData[i].created_at = date_ob,
        productData[i].updated_at = date_ob
      }
  
      const data = await prisma.invoice_product.createMany({
        data: productData
      });
      return data;
    } catch (err) {
      // if (err.message) err = err.message;
      console.log("createProductDB error", err);
      return {};
    }
}

/* DELETE STUDENT */
const deleteInvoiceDB = async (id, tenantId) => {
  try {
    console.log("deleteInvoiceDB called");
    const seatDelete = await prisma.invoice_product.deleteMany({
      where: {
        invoice_id: id
      }
    });

    const data = await prisma.invoice.delete({
      where: {
        tenant_id: tenantId,
        id: id
      },
    });
    return data;
  } catch (err) {
    if (err.message) err = err.message;
    console.log("deleteInvoiceDB error", err);
    return {};
  }
}

const getCompanyFromDB = async (search, tenantId) => {
  try {
      console.log("getCompanyFromDB called");

      let where = {
        tenant_id: tenantId,
        name: {
          contains: search
        }
      };
      
      
      const data = await prisma.company_from.findMany({
          where,
          orderBy: {
              name: 'asc'
          },
      });
      return data;
  } catch (err) {
      if (err.message) err = err.message;
      console.log("getCompanyFromDB error", err);
      return [];
  }
}

const getCompanyToDB = async (search, tenantId) => {
  try {
      console.log("getCompanyToDB called");

      let where = {
        tenant_id: tenantId,
        name: {
          contains: search
        }
      };
      
      
      const data = await prisma.company_to.findMany({
          where,
          orderBy: {
              name: 'asc'
          },
      });
      return data;
  } catch (err) {
      if (err.message) err = err.message;
      console.log("getCompanyToDB error", err);
      return [];
  }
}

const updateCompanyFromDB = async (companyData, companyFromId, tenantId) => {
  try {
    console.log("updateCompanyFromDB called");
    let date_ob = moment().format('YYYY-MM-DD HH:mm:ss');

    const data = await prisma.company_from.update({
      where: {
        id: companyFromId,
      },
      data: {
        tenant_id: tenantId,
        name: companyData.name,
        email: companyData.email,
        contact_no: companyData.mobileNumber,
        address: companyData.address,
        gst_no: companyData.gstNumber,
        updated_at: date_ob
    },
    });
    return data;
  } catch (err) {
    // if (err.message) err = err.message;
    console.log("updateCompanyFromDB error", err);
    return {};
  }
}

const updateCompanyToDB = async (companyData, companyToId, tenantId) => {
  try {
    console.log("updateCompanyToDB called");
    let date_ob = moment().format('YYYY-MM-DD HH:mm:ss');

    const data = await prisma.company_to.update({
      where: {
        id: companyToId,
      },
      data: {
        tenant_id: tenantId,
        name: companyData.name,
        email: companyData.email,
        contact_no: companyData.mobileNumber,
        address: companyData.address,
        gst_no: companyData.gstNumber,
        updated_at: date_ob
    },
    });
    return data;
  } catch (err) {
    // if (err.message) err = err.message;
    console.log("updateCompanyToDB error", err);
    return {};
  }
}

module.exports = {
    getInvoicesDB,
    createInvoiceDB,
    createCompanyFromDB,
    createCompanyToDB,
    createProductDB,
    deleteInvoiceDB,
    getCompanyFromDB,
    getCompanyToDB,
    updateCompanyFromDB,
    updateCompanyToDB,
}