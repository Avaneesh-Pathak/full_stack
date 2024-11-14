const prisma = require("../config/prisma");
const moment = require("moment");

/* GET ALL USERS */
const getRecentDataDB = async (tenantId, limit = 5) => {
    try {
        console.log("getRecentDataDB called");

        let where = {
            tenant_id: tenantId,
        };
        
        const data = await prisma.invoice.findMany({
            where,
            orderBy: {
                created_at: 'desc'
            },
            include: {
                company_from: true,
                company_to: true,   
            },
            take: limit,
        });
        return data;
    } catch (err) {
        if (err.message) err = err.message;
        console.log("getRecentDataDB error", err);
        return [];
    }
}

/* GET UPCOMING RENEWALS */
const getUpcomingRenewalDB = async (startDate, endDate) => {
    try {
        console.log("getUpcomingRenewalDB called");

        let where = {
            shift_date_end: {
                lte: endDate,
                gte: startDate,
            },
            payment_status: true,
        };

        const data = await prisma.student_seat_allotment.findMany({
            where,
            orderBy: {
                updated_at: 'desc'
            },
            include: {
                student: {
                    select: {
                        email: true,
                        name: true,
                        membership_id: true,
                        mobile_no: true,
                    }, // Include the author of each post
                },
            },
        });
        return data;
    } catch (err) {
        if (err.message) err = err.message;
        console.log("getUpcomingRenewalDB error", err);
        return [];
    }
}

/* GET YEARLY REVENUE BREAKUP */
const getTotalSchoolsDB = async (startDate, endDate) => {
    try {
        console.log("getTotalSchoolsDB called");

        let where = {
            created_at: {
                lte: endDate,
                gte: startDate,
            },

        };

        const data = await prisma.school.count();

        return data;
    } catch (err) {
        if (err.message) err = err.message;
        console.log("getTotalSchoolsDB error", err);
        return [];
    }
}

/* GET MONTHLY REVENUE BREAKUP */
const getTotalStudentsDB = async (startDate, endDate) => {
    try {
        console.log("getTotalStudentsDB called");

        let where = {
            created_at: {
                lte: endDate,
                gte: startDate,
            },

        };

        const data = await prisma.student.count();

        return data;
    } catch (err) {
        if (err.message) err = err.message;
        console.log("getTotalStudentsDB error", err);
        return [];
    }
}

/* GET WEEKLY REVENUE BREAKUP */
const getGenderBreakupDB = async (startDate, endDate) => {
    try {
        console.log("getGenderBreakupDB called");

        let where = {
            created_at: {
                lte: endDate,
                gte: startDate,
            },
        };

        const data = await prisma.student.groupBy({
            by: ['sex'],
            _count: {
                _all: true,
              },
        });
        return data;
    } catch (err) {
        if (err.message) err = err.message;
        console.log("getGenderBreakupDB error", err);
        return [];
    }
}

module.exports = {
    getRecentDataDB,
    getUpcomingRenewalDB,
    getTotalSchoolsDB,
    getTotalStudentsDB,
    getGenderBreakupDB,
}