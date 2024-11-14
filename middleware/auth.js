const jwt = require('jsonwebtoken');
const moment = require('moment');
const { getTokenDetailsDB, updateTokenDataDB, getTenantDetailsDB } = require('../helpers/auth');


const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token && !token.length) return res.status(401).json({
            message: "Access Denied",
            data: {}
        });
        if (token.startsWith("Bearer ")) token = token.slice(7, token.length).trimLeft();

        const jwt_secret = process.env.JWT_SECRET;
        const verified = jwt.verify(token, jwt_secret, "HS256");
        req.user = verified;

        next();
    } catch (error) {
        if (error.message) error = error.message;
        return res.status(401).json({
            message: "Authorization failed",
            data: {}
        });
    }
}

const verifyKey = async (req, res, next) => {
    try {
        let token = req.header("x-api-key");
        console.log('verifyKey called');

        const { API_KEY, API_LIMIT, API_RESET_TYPE, API_RESET_VALUE, API_CALL_REMAINING, LAST_API_LIMIT_UPDATE, LAST_SUCCESSFUL_API_CALL, DELAY_BETWEEN_CALLS } = await getTokenDetailsDB();
        if (token != API_KEY) throw "Failed to check";

        let apiKeyConfiguration = {
            API_CALL_REMAINING: API_CALL_REMAINING,
            LAST_SUCCESSFUL_API_CALL: LAST_SUCCESSFUL_API_CALL,
            LAST_API_LIMIT_UPDATE: LAST_API_LIMIT_UPDATE
        };
    
        // current time and last api call difference should be greater than delay_between_calls
        if (moment().diff(moment(LAST_SUCCESSFUL_API_CALL)) < parseInt(DELAY_BETWEEN_CALLS)) throw 'Access Denied : Please try again it after ' + (DELAY_BETWEEN_CALLS - (moment().diff(moment(LAST_SUCCESSFUL_API_CALL))))/1000 + ' seconds';

        let diff_check = 0;
        if (API_RESET_TYPE === '1') {
            diff_check = API_RESET_VALUE * 60 * 60 * 1000;
        } else if (API_RESET_TYPE === '2') {
            diff_check = API_RESET_VALUE * 24 * 60 * 60 * 1000;
        } else if (API_RESET_TYPE === '3') {
            diff_check = API_RESET_VALUE * 7 * 24 * 60 * 60 * 1000;
        } else {
            diff_check = API_RESET_VALUE * 30 * 24 * 60 * 60 * 1000;
        }

        if (API_CALL_REMAINING < 1 && (moment().diff(moment(LAST_API_LIMIT_UPDATE)) > diff_check)) {
            //please update the api_call_limit
            apiKeyConfiguration['API_CALL_REMAINING'] = API_LIMIT - 1;
            apiKeyConfiguration['LAST_SUCCESSFUL_API_CALL'] = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
            apiKeyConfiguration['LAST_API_LIMIT_UPDATE'] = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        } else {
            apiKeyConfiguration['API_CALL_REMAINING'] = apiKeyConfiguration['API_CALL_REMAINING'] - 1;
            apiKeyConfiguration['LAST_SUCCESSFUL_API_CALL'] = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        }

        await updateTokenDataDB(apiKeyConfiguration);

        next();
    } catch (error) {
        if (error.message) error = error.message;
        console.log(error);
        return res.status(401).json({
            message: error || "Authorization failed",
            data: {}
        });
    }
}

const verifyTenant = async (req, res, next) => {
    try {
        let tenantName = req.header("Subtenant");
        if(!tenantName || !tenantName.length) throw "No tenant provided";

        tenantName = tenantName.replace(/\s+/g, '').toLowerCase();

        const result = await getTenantDetailsDB(tenantName);
        if (!Object.keys(result).length) throw "Tenant Not Found";

        req.tenant = result;
        next();
    } catch (error) {
        if (error.message) error = error.message;
        console.log(error);
        return res.status(401).json({
            message: "Tenant Not Found",
            data: {}
        });
    }
}

module.exports = {
    verifyToken,
    verifyKey,
    verifyTenant,
}