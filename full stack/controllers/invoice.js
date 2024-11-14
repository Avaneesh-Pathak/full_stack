const moment = require('moment');
const { getInvoicesDB, createInvoiceDB, createCompanyFromDB, createCompanyToDB, createProductDB, deleteInvoiceDB, getCompanyFromDB, 
    getCompanyToDB, updateCompanyFromDB, updateCompanyToDB } = require("../helpers/invoice");

const generateNumericUUID = () => (Math.floor(10000000 + Math.random() * 90000000)).toString();

/* GET USERS */
/* API to get the list of all users */
const getInvoices = async (req, res) => {
    try {
        let requestQuery = req.query;
        console.log("getInvoices requestBody");

        let { invoiceId, search, startDate, endDate, includeAll } = requestQuery;
        const tenantId = req.tenant.id;
        const invoiceList = await getInvoicesDB(invoiceId, search, startDate, endDate, includeAll, tenantId);
        if (!invoiceList || !invoiceList.length) throw "no invoiceList found";
        invoiceList.forEach(data => {
            data.total = 0;
            if(data && data.invoice_product && data.invoice_product.length) data.invoice_product.forEach(product => {
                data.total += product.amount;
            });
        });
        return res.status(200).json({message: "data fetched successfully", data: invoiceList});
    } catch (error) {
        if (error.message) error = error.message;
        console.log("getInvoices error", error);
        return res.status(500).json({message : error || "failed to fetch data", data: []});
    }
}

/* REGISTER USER */
/* API to create a new user if it does not exist */
const getStudentById = async (req, res) => {
    try {
        const requestBody = req.params;
        console.log("getStudentById requestBody");

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { id } = requestBody;

        if (!id || !id.length) throw "Missing required data";

        // If user is new, adding it to the database.
        const savedUser = await getStudentByIdDB(parseInt(id));
        if (!savedUser || !Object.keys(savedUser).length) throw "Failed to fetch student";
        savedUser.password = undefined;
        savedUser.id = undefined;
        if (savedUser.image) savedUser.image = `data:image/png;base64,${Buffer.from(savedUser.image).toString('base64')}`;
        res.status(201).json({ message: "fetched student successfully", data: savedUser });
    } catch (error) {
        // if (error.message) error = error.message;
        console.log("getStudentById Error", error);
        res.status(500).json({ message: error || "failed to fetch student", data: {} });
    }
};

/* REGISTER USER */
/* API to create a new user if it does not exist */
const deleteInvoice = async (req, res) => {
    try {
        const requestBody = req.params;
        const tenantId = req.tenant.id;
        console.log("deleteInvoice requestBody");

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { id } = requestBody;

        if (!id || !id.length) throw "Missing required data";

        let invoiceList = await getInvoicesDB(id, tenantId);
        if(!invoiceList.length) throw "No invoice found";
        const invoiceId = invoiceList[0].id;
        // If user is new, adding it to the database.
        const savedUser = await deleteInvoiceDB(invoiceId, tenantId);
        if (!savedUser || !Object.keys(savedUser).length) throw "Failed to fetch invoice";
        res.status(201).json({ message: "deleted invoice successfully", data: {} });
    } catch (error) {
        // if (error.message) error = error.message;
        console.log("deleteInvoice Error", error);
        res.status(500).json({ message: error || "failed to delete invoice", data: {} });
    }
};

/* REGISTER USER */
/* API to create a new user if it does not exist */
const createInvoice = async (req, res) => {
    try {
        const requestBody = req.body;
        const tenantId = req.tenant.id;
        console.log("createInvoice requestBody");

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { companyFrom, companyTo, companyFromId, companyToId, invoiceDate, products, total } = requestBody;

        if (!companyFrom || !Object.keys(companyFrom).length || !companyTo || !Object.keys(companyTo).length || !invoiceDate || !invoiceDate.length || !products || !products.length) throw "Missing required data";
        let uuid = generateNumericUUID();
        const invoiceList = await getInvoicesDB(undefined, undefined);
        if(invoiceList.length) uuid = `${parseInt(invoiceList[0].invoice_id) + 1}`;
        let companyFromData;
        if(companyFromId) companyFromData = await updateCompanyFromDB(companyFrom, companyFromId, tenantId);
        else companyFromData = await createCompanyFromDB(companyFrom, tenantId);
        if(!companyFromData.id) throw "Failed to create/update company from data";

        let companyToData;
        if(companyToId) companyToData = await updateCompanyToDB(companyTo, companyToId, tenantId);
        else companyToData = await createCompanyToDB(companyTo, tenantId);
        if(!companyToData.id) throw "Failed to create/update company to data";

        const invoiceRequestData = {
            "tenant_id": tenantId,
            "companyFrom": companyFromData.id,
            "companyTo": companyToData.id,
            "invoiceDate": invoiceDate,
            "invoiceAmount": total,
            "invoiceId": uuid,
        }

        const invoiceData = await createInvoiceDB(invoiceRequestData, tenantId);
        if (!invoiceData || !Object.keys(invoiceData).length) throw "Failed to create invoice";
        
        let invoiceId = invoiceData.id;
        if(!invoiceId) throw "Failed to create invoice";

        const productData = await createProductDB(products, invoiceId);

        res.status(201).json({ message: "Invoice created successfully" });
    } catch (error) {
        // if (error.message) error = error.message;
        console.log("createInvoice Error", error);
        res.status(500).json({ message: error || "failed to create invoice", data: {} });
    }
};

/* UPDATE STUDENT */
/* API to update a user */
const updateStudent = async (req, res) => {
    try {
        const requestBody = req.body;
        console.log("updateStudent requestBody");

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { name, email, membershipId, mobileNumber } = requestBody;

        if (!name || !name.length || !email || !email.length || !membershipId || !membershipId.length || !mobileNumber || !mobileNumber.length) throw "Missing required data";

        // let imageBuffer;
        // console.log(req.file);
        // if (req.file) {
        //     const imageFile = req.file;
        //     imageBuffer = await fs.readFile(imageFile.path);
        //     await fs.unlink(imageFile.path);
        // }
        // const columnSizeLimit = 65535; // Example column size limit for MySQL BLOB type
        // if (imageBuffer && imageBuffer.length > columnSizeLimit) {
        //     throw 'Image is too large. Please upload a smaller image.';
        // }
        // requestBody.image = imageBuffer;

        // Checking if the user is present or not.
        const isUser = await getStudentByEmailDB(email);
        if (!isUser || !Object.keys(isUser).length) throw "No student found to update"; // If the user is present, don't add it again.

        // If user is new, adding it to the database.
        const savedUser = await updateStudentDB(requestBody, isUser.id);
        if (!savedUser || !Object.keys(savedUser).length) throw "Failed to update student";
        savedUser.password = undefined;
        savedUser.id = undefined;
        // if (savedUser.image) savedUser.image = `data:image/png;base64,${Buffer.from(savedUser.image).toString('base64')}`;
        res.status(201).json({ message: "updated user successfully", data: savedUser });
    } catch (error) {
        // if (error.message) error = error.message;
        console.log("updateStudent Error", error);
        res.status(500).json({ message: error || "failed to create user", data: {} });
    }
};

/* GET USERS */
/* API to get the list of all users */
const getCompanyFrom = async (req, res) => {
    try {
        let requestQuery = req.query;
        console.log("getCompanyFrom requestBody");

        let { search } = requestQuery;
        const tenantId = req.tenant.id;
        const invoiceList = await getCompanyFromDB(search, tenantId);
        // if (!invoiceList || !invoiceList.length) throw "no invoiceList found";
        return res.status(200).json({message: "data fetched successfully", data: invoiceList});
    } catch (error) {
        if (error.message) error = error.message;
        console.log("getCompanyFrom error", error);
        return res.status(500).json({message : error || "failed to fetch data", data: []});
    }
}

/* GET USERS */
/* API to get the list of all users */
const getCompanyTo = async (req, res) => {
    try {
        let requestQuery = req.query;
        console.log("getCompanyTo requestBody");

        let { search } = requestQuery;
        const tenantId = req.tenant.id;
        const invoiceList = await getCompanyToDB(search, tenantId);
        // if (!invoiceList || !invoiceList.length) throw "no invoiceList found";
        return res.status(200).json({message: "data fetched successfully", data: invoiceList});
    } catch (error) {
        if (error.message) error = error.message;
        console.log("getCompanyTo error", error);
        return res.status(500).json({message : error || "failed to fetch data", data: []});
    }
}


module.exports = {
    getInvoices,
    createInvoice,
    updateStudent,
    getStudentById,
    deleteInvoice,
    getCompanyFrom,
    getCompanyTo
}