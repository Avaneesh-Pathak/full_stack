const moment = require('moment');
const { getRecentDataDB, getUpcomingRenewalDB, getTotalSchoolsDB, getTotalStudentsDB, getGenderBreakupDB } = require("../helpers/dashboard");

/* GET USERS */
/* API to get the list of all users */
const getRecentData = async (req, res) => {
    
    try {
        const tenantId = req.tenant.id;
        console.log("getRecentData called");

        const invoiceList = await getRecentDataDB(tenantId);
        if (!invoiceList || !invoiceList.length) throw "no invoiceList found";
        return res.status(200).json({ message: "data fetched successfully", data: invoiceList });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("getRecentData error", error);
        return res.status(500).json({ message: error || "failed to fetch data", total: 0 });
    }
}

/* GET USERS */
/* API to get the list of all users */
const getUpcomingRenewal = async (req, res) => {
    try {

        console.log("getUpcomingRenewal called");

        let startDate = moment().format('YYYY-MM-DD');
        let endDate = moment(startDate).add(15, 'days').format('YYYY-MM-DD');

        const usersList = await getUpcomingRenewalDB(startDate, endDate);
        usersList.forEach(data => {
            data.shift_date_start = moment(data.shift_date_start).format('DD/MM/YYYY');
            data.shift_date_end = moment(data.shift_date_end).format('DD/MM/YYYY');
            data.shift_time_start = moment(data.shift_time_start, "HH:mm").format('hh:mm A');
            data.shift_time_end = moment(data.shift_time_end, "HH:mm").format('hh:mm A');
        });
        if (!usersList || !usersList.length) throw "no usersList found";
        return res.status(200).json({ message: "data fetched successfully", total: usersList });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("getUpcomingRenewal error", error);
        return res.status(500).json({ message: error || "failed to fetch data", total: [] });
    }
}

const getTotalSchools = async (req, res) => {
    try {

        console.log("getTotalSchools called");

        let startDate = moment().startOf('year').format('YYYY-MM-DD');
        let endDate = moment(startDate).endOf('year').format('YYYY-MM-DD');

        const total = await getTotalSchoolsDB(startDate, endDate);
        // let total = 0;
        // invoiceList.forEach(data => {
        //         total += data.invoice_amount;
        // });
        // if (!invoiceList || !invoiceList.length) throw "no invoiceList found";
        return res.status(200).json({ message: "data fetched successfully", total: total });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("getTotalSchools error", error);
        return res.status(500).json({ message: error || "failed to fetch data", total: 0 });
    }
}

const getTotalStudents = async (req, res) => {
    try {

        console.log("getTotalStudents called");

        let startDate = moment().startOf('month').format('YYYY-MM-DD');
        let endDate = moment(startDate).endOf('month').format('YYYY-MM-DD');

        const total = await getTotalStudentsDB(startDate, endDate);
        return res.status(200).json({ message: "data fetched successfully", total: total });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("getTotalStudents error", error);
        return res.status(500).json({ message: error || "failed to fetch data", total: 0 });
    }
}

const getGenderBreakup = async (req, res) => {
    try {

        console.log("getGenderBreakup called");

        let startDate = moment().startOf('week').format('YYYY-MM-DD');
        let endDate = moment(startDate).endOf('week').format('YYYY-MM-DD');


        const invoiceList = await getGenderBreakupDB(startDate, endDate);
        let total = [];
        invoiceList.forEach(data => {
            let res = {
                name: data.sex.toLocaleUpperCase(),
                value: data._count._all
            };
            // if(!total[data.sex]) total[data.sex] = data._count._all;
            total.push(res);
        });
        return res.status(200).json({ message: "data fetched successfully", total: total });
    } catch (error) {
        if (error.message) error = error.message;
        console.log("getGenderBreakup error", error);
        return res.status(500).json({ message: error || "failed to fetch data", total: 0 });
    }
}


module.exports = {
    getRecentData,
    getUpcomingRenewal,
    getTotalSchools,
    getTotalStudents,
    getGenderBreakup
}