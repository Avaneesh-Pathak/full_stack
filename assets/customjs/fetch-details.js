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

const registerStudent = async (event) => {
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
  let schoolId = document.getElementById('schoolName').value;
  let dateOfBirth = document.getElementById('dateOfBirth').value;
  let sex = document.getElementById('sex').value;

  const apiUrl = `${baseUrl}/api/student/create`;
  const data = {
    name: name,
    email: email,
    studentCode: code,
    mobileNumber: mobileNumber,
    address: address,
    city: city,
    zip: zip,
    state: state,
    dateOfBirth:dateOfBirth,
    schoolId: schoolId,
    sex:sex,
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
    window.location.href = "./Student_registration.html";
  }
  //   }
  return false;
};


const getStudentData = async () => {

  let { cookie, subTenant } = checkAuth();
  
  let apiUrl = `${baseUrl}/api/student`;

  let search = document.getElementById('searchText').value;
  if(search && search.length) apiUrl += `?search=${search}`;

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + cookie,
      Subtenant: subTenant,
    },
  };

  let response = await fetch(apiUrl, requestOptions);
  let responseData = await response.json();
  if (!response.ok) {
    alert(responseData.message);
  } else {
    responseData = responseData.data;
    console.log(responseData);
    
    let tbody = document.getElementById("fetchDetails");
    tbody.innerHTML = '';
    for (const data of responseData) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `<th scope='row'>${data.name}</th>
        <td>${data.code}</td>
        <td>${data.school.name}</td>
        <td>${data.school.code}</td>
      <td><a href="#"><i class="bi bi-file-earmark-bar-graph"></i></a></td>
      <td><a href="#"><i class="bi bi-recycle"></i></a></td>`;

        //     newRow.innerHTML+=`<td><a href="#" class="print-link h5 text-primary"  data-toggle="tooltip" data-placement="bottom" title="Print Invoice"><i class="ti ti-printer"></i></a></td>`;
        //     const printLink = newRow.querySelector('.print-link');
        // printLink.addEventListener('click', function (event) {
        //     event.preventDefault();
        //     printInvoice(data);
        // });
        tbody.appendChild(newRow);
    }
    document.getElementById('fetch-details').classList.remove('d-none');
  }
  //   }
  return false;
};

getStudentData();

let searchText = document.getElementById('searchText');
searchText.addEventListener('input', (input) => {
  console.log(searchText.value);
  let text = searchText.value;
  getStudentData(); 
  
});