const baseUrl = 'https://hospital-demo-backend.vercel.app';
// const baseUrl = 'http://localhost:3001';

const checkAuth = () => {
    let cookie = sessionStorage.getItem('cookie');
    let cookie_time = sessionStorage.getItem('cookie-expiry');
    let cookie_tenant = sessionStorage.getItem('cookie-tenant');
    let now = Date.now();
    if (!cookie || now > cookie_time) window.location.href = './login.html';
    return { cookie, subTenant: cookie_tenant };
};

checkAuth();

document.addEventListener("DOMContentLoaded", () => {
});

const fetchGenderBreakupData = async () => {
    let { cookie, subTenant } = checkAuth();
    const apiUrl = `${baseUrl}/api/dashboard/yearly-gender-breakup`;

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + cookie,
            Subtenant: subTenant
        }
    };

    let response = await fetch(apiUrl, requestOptions);
    let total = [{
        value: 0,
        name: 'male'
      },
      {
        value: 0,
        name: 'female'
      },
     
    ];
    let responseData = await response.json();
    total = responseData.total || total;

    echarts.init(document.querySelector("#trafficChart")).setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [{
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: total
        }]
      });
};

const fetchStudentData = async () => {
    let { cookie, subTenant } = checkAuth();
    const apiUrl = `${baseUrl}/api/dashboard/yearly-student-breakup`;

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + cookie,
            Subtenant: subTenant
        }
    };

    let response = await fetch(apiUrl, requestOptions);
    let responseData = await response.json();
    let total = responseData.total || 0;
    document.getElementById('studentData').innerHTML = `${total}`;
    document.getElementById('registerData').innerHTML = `${total}`;
};

const fetchSchoolData = async () => {
    let { cookie, subTenant } = checkAuth();
    const apiUrl = `${baseUrl}/api/dashboard/yearly-breakup`;

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + cookie,
            Subtenant: subTenant
        }
    };

    let response = await fetch(apiUrl, requestOptions);
    let responseData = await response.json();
    let total = responseData.total || 0;
    document.getElementById('schoolData').innerHTML = `${total}`;
};


fetchSchoolData();
fetchStudentData();
fetchGenderBreakupData();