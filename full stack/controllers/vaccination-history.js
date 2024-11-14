const { getVaccinationHistorysDB, getVaccinationHistoryByNameDB, createVaccinationHistoryDB, updateVaccinationHistoryDB, getVaccinationHistoryByIdDB, deleteVaccinationHistoryDB } = require("../helpers/vaccination-history");

/* TENANTS */

/* API to get the list of all vaccinationhistorys */
const getVaccinationHistorys = async (req, res) => {
    try {
        console.log("getVaccinationHistorys requestBody");
        let requestQuery = req.query;
        let { studentId, search } = requestQuery;
        const user = req.user;
        console.log(user, studentId);
        const vaccineList = await getVaccinationHistorysDB(undefined, studentId, search);
        const vaccineData = {};
        vaccineList.forEach(vaccine => {
            vaccineData[vaccine.age] = {
                type: vaccine.type,
                age: vaccine.age,
                due_date: vaccine.due_date,
                given_date: vaccine.given_date,
                status: vaccine.status,
                remarks: vaccine.remarks,
                vaccine: vaccine.vaccine.split(';'),
            };
        });
        return res.status(200).json({
            message: "data fetched successfully",
            data: vaccineData
        });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("getVaccinationHistorys error", error);
        return res.status(500).json({
            message: error || "failed to fetch data",
            data: []
        });
    }
}

/* API to get vaccinationhistory by Id */
const getVaccinationHistoryById = async (req, res) => {
    try {
        const requestBody = req.params;
        console.log("getVaccinationHistoryById requestBody");

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { id } = requestBody;

        if (!id || !id.length) throw "Missing required data";

        // If user is new, adding it to the database.
        const vaccinationhistoryData = await getVaccinationHistoryByIdDB(parseInt(id));
        if (!vaccinationhistoryData || !Object.keys(vaccinationhistoryData).length) throw "Failed to fetch vaccinationhistory";
        vaccinationhistoryData.id = undefined;
        res.status(201).json({
            message: "fetched vaccinationhistory data successfully",
            data: vaccinationhistoryData
        });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("getVaccinationHistoryById Error", error);
        res.status(500).json({
            message: error || "failed to fetch vaccinationhistory",
            data: {}
        });
    }
};

/* API to create a new vaccinationhistory if it does not exist */
const createVaccinationHistory = async (req, res) => {
    try {
        const requestBody = req.body;
        const user = req.user;
        console.log("createVaccinationHistory requestBody", user);

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { name, email, vaccinationhistoryCode, schoolId } = requestBody;

        if (!name || !name.length || !email || !email.length || !vaccinationhistoryCode || !vaccinationhistoryCode.length || !schoolId) throw "Missing required data";


        const isVaccinationHistory = await getVaccinationHistoryByNameDB(email);
        if (isVaccinationHistory && Object.keys(isVaccinationHistory).length) throw "VaccinationHistory already exists";
        

        const vaccinationhistoryData = await createVaccinationHistoryDB(requestBody, user);
        if (!vaccinationhistoryData || !Object.keys(vaccinationhistoryData).length) throw "Failed to create vaccinationhistory";
        vaccinationhistoryData.id = undefined;
        vaccinationhistoryData.schema = undefined;

        res.status(201).json({
            message: "created vaccinationhistory successfully",
            data: vaccinationhistoryData
        });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("createVaccinationHistory Error", error);
        res.status(500).json({
            message: error || "failed to create vaccinationhistory",
            data: {}
        });
    }
};

/* API to update a vaccinationhistory */
const updateVaccinationHistory = async (req, res) => {
    try {
        const requestBody = req.body;
        console.log("updateVaccinationHistory requestBody");

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { name, email, vaccinationhistoryCode, schoolId } = requestBody;

        if (!name || !name.length || !email || !email.length || !vaccinationhistoryCode || !vaccinationhistoryCode.length || !schoolId) throw "Missing required data";
        // Checking if the user is present or not.
        const isVaccinationHistory = await getVaccinationHistoryByNameDB(email);
        if (!isVaccinationHistory || !Object.keys(isVaccinationHistory).length) throw "No vaccinationhistory found to update"; // If the user is present, don't add it again.

        // If user is new, adding it to the database.
        const updatedVaccinationHistory = await updateVaccinationHistoryDB(requestBody, isVaccinationHistory);
        if (!updatedVaccinationHistory || !Object.keys(updatedVaccinationHistory).length) throw "Failed to update vaccinationhistory";
        updatedVaccinationHistory.id = undefined;
        res.status(201).json({
            message: "updated vaccinationhistory successfully",
            data: updatedVaccinationHistory
        });
    } catch (error) {
        // if (error.message) error = error.message;
        console.log("updateVaccinationHistory Error", error);
        res.status(500).json({
            message: error || "failed to create user",
            data: {}
        });
    }
};

/* API to delete a vaccinationhistory */
const deleteVaccinationHistory = async (req, res) => {
    try {
        const requestBody = req.params;
        console.log("deleteVaccinationHistory requestBody");

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { id } = requestBody;

        if (!id || !id.length) throw "Missing required data";

        // If user is new, adding it to the database.
        const savedUser = await deleteVaccinationHistoryDB(parseInt(id));
        if (!savedUser || !Object.keys(savedUser).length) throw "Failed to fetch vaccinationhistory";

        res.status(200).json({
            message: "deleted vaccinationhistory successfully",
            data: {}
        });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("deleteVaccinationHistory Error", error);
        res.status(500).json({
            message: error || "failed to delete vaccinationhistory",
            data: {}
        });
    }
};

module.exports = {
    getVaccinationHistorys,
    getVaccinationHistoryById,
    createVaccinationHistory,
    updateVaccinationHistory,
    deleteVaccinationHistory,
}