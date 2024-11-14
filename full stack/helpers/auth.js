const prisma = require("../config/prisma");
const moment = require('moment');

const getTokenDetailsDB = async () => {
  try {
    console.log("getTokenDetailsDB called");

    const dataList = await prisma.configuration.findMany({});
    let dataMap = {};
    dataList.forEach(data => {
        dataMap[data.conf_key] = data.conf_value;
    });
    return dataMap;
  } catch (err) {
    if (err.message) err = err.message;
    console.log("getTokenDetailsDB error", err);
    return [];
  }
}

/* UPDATE TENANT */
const updateTokenDataDB = async (tokenData) => {
  try {
    console.log("updateTokenDataDB called");
    let date_ob = moment().format('YYYY-MM-DD HH:mm:ss');

    await prisma.configuration.update({
      where: {
        conf_key: 'API_CALL_REMAINING',
      },
      data: {
        conf_value: `${tokenData['API_CALL_REMAINING']}`,
        updated_at: date_ob
      },
    });

    await prisma.configuration.update({
      where: {
        conf_key: 'LAST_SUCCESSFUL_API_CALL',
      },
      data: {
        conf_value: `${tokenData['LAST_SUCCESSFUL_API_CALL']}`,
        updated_at: date_ob
      },
    });

    await prisma.configuration.update({
      where: {
        conf_key: 'LAST_API_LIMIT_UPDATE',
      },
      data: {
        conf_value: `${tokenData['LAST_API_LIMIT_UPDATE']}`,
        updated_at: date_ob
      },
    });
    return;
  } catch (err) {
    if (err.message) err = err.message;
    console.log("updateTokenDataDB error", err);
    return [];
  }
}

  const getTenantDetailsDB = async (tenantName) => {
    try {
      console.log("getTenantDetailsDB called");

      const data = await prisma.tenant.findUnique({
        where: {
          name: tenantName
        }
      });
      if(!data) throw "No tenant data found";
      return data;
    } catch (err) {
      if (err.message) err = err.message;
      console.log("getTenantDetailsDB error", err);
      return {};
    }
  }
module.exports = {
    getTokenDetailsDB,
    updateTokenDataDB,
    getTenantDetailsDB,
}