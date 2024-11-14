const { getStudentsDB, getStudentByNameDB, createStudentDB, updateStudentDB, getStudentByIdDB, deleteStudentDB } = require("../helpers/student");

/* TENANTS */

/* API to get the list of all students */
const getStudents = async (req, res) => {
    try {
        console.log("getStudents requestBody");
        let requestQuery = req.query;
        let { schoolId, search } = requestQuery;
        const usersList = await getStudentsDB(schoolId, search);
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

/* API to get student by Id */
const getStudentById = async (req, res) => {
    try {
        const requestBody = req.params;
        console.log("getStudentById requestBody");

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { id } = requestBody;

        if (!id || !id.length) throw "Missing required data";

        // If user is new, adding it to the database.
        const studentData = await getStudentByIdDB(parseInt(id));
        if (!studentData || !Object.keys(studentData).length) throw "Failed to fetch student";
        studentData.id = undefined;
        res.status(201).json({
            message: "fetched student data successfully",
            data: studentData
        });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("getStudentById Error", error);
        res.status(500).json({
            message: error || "failed to fetch student",
            data: {}
        });
    }
};

/* API to create a new student if it does not exist */
const createStudent = async (req, res) => {
    try {
        const requestBody = req.body;
        const user = req.user;
        console.log("createStudent requestBody", user);

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { name, email, studentCode, schoolId } = requestBody;

        if (!name || !name.length || !email || !email.length || !studentCode || !studentCode.length || !schoolId) throw "Missing required data";


        const isStudent = await getStudentByNameDB(email);
        if (isStudent && Object.keys(isStudent).length) throw "Student already exists";
        

        const studentData = await createStudentDB(requestBody, user);
        if (!studentData || !Object.keys(studentData).length) throw "Failed to create student";
        studentData.id = undefined;
        studentData.schema = undefined;

        res.status(201).json({
            message: "created student successfully",
            data: studentData
        });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("createStudent Error", error);
        res.status(500).json({
            message: error || "failed to create student",
            data: {}
        });
    }
};

/* API to update a student */
const updateStudent = async (req, res) => {
    try {
        const requestBody = req.body;
        console.log("updateStudent requestBody");

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { name, email, studentCode, schoolId } = requestBody;

        if (!name || !name.length || !email || !email.length || !studentCode || !studentCode.length || !schoolId) throw "Missing required data";
        // Checking if the user is present or not.
        const isStudent = await getStudentByNameDB(email);
        if (!isStudent || !Object.keys(isStudent).length) throw "No student found to update"; // If the user is present, don't add it again.

        // If user is new, adding it to the database.
        const updatedStudent = await updateStudentDB(requestBody, isStudent);
        if (!updatedStudent || !Object.keys(updatedStudent).length) throw "Failed to update student";
        updatedStudent.id = undefined;
        res.status(201).json({
            message: "updated student successfully",
            data: updatedStudent
        });
    } catch (error) {
        // if (error.message) error = error.message;
        console.log("updateStudent Error", error);
        res.status(500).json({
            message: error || "failed to create user",
            data: {}
        });
    }
};

/* API to delete a student */
const deleteStudent = async (req, res) => {
    try {
        const requestBody = req.params;
        console.log("deleteStudent requestBody");

        if (!requestBody || !Object.keys(requestBody).length) throw "Invalid request, missing data";
        const { id } = requestBody;

        if (!id || !id.length) throw "Missing required data";

        // If user is new, adding it to the database.
        const savedUser = await deleteStudentDB(parseInt(id));
        if (!savedUser || !Object.keys(savedUser).length) throw "Failed to fetch student";

        res.status(200).json({
            message: "deleted student successfully",
            data: {}
        });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("deleteStudent Error", error);
        res.status(500).json({
            message: error || "failed to delete student",
            data: {}
        });
    }
};

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
}