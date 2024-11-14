const { getSchoolsDB, getSchoolByNameDB, createSchoolDB, updateSchoolDB, getSchoolByIdDB, deleteSchoolDB } = require("../helpers/school");

/* TENANTS */

/* API to get the list of all schools */
const getSchools = async (req, res) => {
    try {
        console.log("getSchools requestBody");
        let requestQuery = req.query;
        let { search } = requestQuery;
        const usersList = await getSchoolsDB(undefined, search);
        return res.status(200).json({
            message: "data fetched successfully",
            data: usersList
        });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("getStudents error", error);
        return res.status(500).json({
            message: error || "failed to fetch data",
            data: []
        });
    }
}

/* API to get school by Id */
const getSchoolById = async (req, res) => {
    try {
        const requestBody = req.params;
        console.log("getSchoolById requestBody");

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { id } = requestBody;

        if (!id || !id.length) throw "Missing required data";

        // If user is new, adding it to the database.
        const schoolData = await getSchoolByIdDB(parseInt(id));
        if (!schoolData || !Object.keys(schoolData).length) throw "Failed to fetch school";
        schoolData.id = undefined;
        res.status(201).json({
            message: "fetched school data successfully",
            data: schoolData
        });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("getSchoolById Error", error);
        res.status(500).json({
            message: error || "failed to fetch student",
            data: {}
        });
    }
};

/* API to create a new school if it does not exist */
const createSchool = async (req, res) => {
    try {
        const requestBody = req.body;
        const user = req.user;
        console.log("createSchool requestBody", user);

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { name, email, code } = requestBody;

        if (!name || !name.length || !email || !email.length || !code || !code.length) throw "Missing required data";


        const isSchool = await getSchoolByNameDB(email);
        if (isSchool && Object.keys(isSchool).length) throw "School already exists";
        

        const schoolData = await createSchoolDB(requestBody, user);
        if (!schoolData || !Object.keys(schoolData).length) throw "Failed to create school";
        schoolData.id = undefined;
        schoolData.schema = undefined;

        res.status(201).json({
            message: "created school successfully",
            data: schoolData
        });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("createSchool Error", error);
        res.status(500).json({
            message: error || "failed to create student",
            data: {}
        });
    }
};

/* API to update a school */
const updateSchool = async (req, res) => {
    try {
        const requestBody = req.body;
        console.log("updateSchool requestBody");

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { name, email, schoolCode } = requestBody;

        if (!name || !name.length || !email || !email.length || !schoolCode || !schoolCode.length) throw "Missing required data";
        // Checking if the user is present or not.
        const isSchool = await getSchoolByNameDB(email);
        if (!isSchool || !Object.keys(isSchool).length) throw "No school found to update"; // If the user is present, don't add it again.

        // If user is new, adding it to the database.
        const updatedSchool = await updateSchoolDB(requestBody, isSchool);
        if (!updatedSchool || !Object.keys(updatedSchool).length) throw "Failed to update school";
        updatedSchool.id = undefined;
        res.status(201).json({
            message: "updated school successfully",
            data: updatedSchool
        });
    } catch (error) {
        // if (error.message) error = error.message;
        console.log("updateSchool Error", error);
        res.status(500).json({
            message: error || "failed to create user",
            data: {}
        });
    }
};

/* API to delete a school */
const deleteSchool = async (req, res) => {
    try {
        const requestBody = req.params;
        console.log("deleteSchool requestBody");

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { id } = requestBody;

        if (!id || !id.length) throw "Missing required data";

        // If user is new, adding it to the database.
        const savedUser = await deleteSchoolDB(parseInt(id));
        if (!savedUser || !Object.keys(savedUser).length) throw "Failed to fetch school";

        res.status(200).json({
            message: "deleted school successfully",
            data: {}
        });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("deleteSchool Error", error);
        res.status(500).json({
            message: error || "failed to delete school",
            data: {}
        });
    }
};

module.exports = {
    getSchools,
    getSchoolById,
    createSchool,
    updateSchool,
    deleteSchool,
}