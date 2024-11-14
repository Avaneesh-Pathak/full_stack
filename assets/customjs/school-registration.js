const baseUrl = 'https://hospital-demo-backend.vercel.app';
// const baseUrl = "http://localhost:3001";

const checkAuth = () => {
  let cookie = sessionStorage.getItem("cookie");
  let cookie_time = sessionStorage.getItem("cookie-expiry");
  let cookie_tenant = sessionStorage.getItem("cookie-tenant");
  let now = Date.now();
  if (!cookie || now > cookie_time) window.location.href = "./login.html";
  return { cookie, subTenant: cookie_tenant };
};

checkAuth();

const registerSchool = async (event) => {
  if (event && event.preventDefault) event.preventDefault();

  let { cookie, subTenant } = checkAuth();

  // let terms = document.getElementById("terms").value;
  // terms = parseInt(terms);

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let code = document.getElementById("code").value;
  let mobileNumber = document.getElementById("mobileNumber").value;
  let address = document.getElementById("address").value;
  let city = document.getElementById("city").value;
  let zip = document.getElementById("zip").value;
  let state = document.getElementById("state").value;

  const apiUrl = `${baseUrl}/api/school/create`;
  const data = {
    email: email,
    name: name,
    code: code,
    mobileNumber: mobileNumber,
    address: address,
    city: city,
    zip: zip,
    state: state,
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + cookie,
      Subtenant: subTenant,
    },
    body: JSON.stringify(data),
  };

  let response = await fetch(apiUrl, requestOptions);
  let responseData = await response.json();

  if (!response.ok) {
    alert(responseData.message);
  } else {
    window.location.href = "./School_Registration.html";
  }
  //   }
  return false;
};
