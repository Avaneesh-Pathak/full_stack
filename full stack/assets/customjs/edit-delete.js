const baseUrl = 'https://hospital-demo-backend.vercel.app';
// const baseUrl = 'http://localhost:3001';

const removeInvoiceData = () => {
    sessionStorage.removeItem('data');
    sessionStorage.removeItem('currentDate');
    sessionStorage.removeItem('invoiceDate');
    sessionStorage.removeItem('totalBeforeTax');
    sessionStorage.removeItem('tax');
    sessionStorage.removeItem('discount');
    sessionStorage.removeItem('total');
}

const checkAuth = () => {
    let cookie = sessionStorage.getItem('cookie');
    let cookie_time = sessionStorage.getItem('cookie-expiry');
    let cookie_tenant = sessionStorage.getItem('cookie-tenant');
    let now = Date.now();
    if (!cookie || now > cookie_time) window.location.href = "./login.html";
    return { cookie, subTenant: cookie_tenant } ;
};

checkAuth();
// removeInvoiceData();

const fetchInvoices = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
    let { cookie, subTenant } = checkAuth();
    let searchbox = document.getElementById('searchbox').value;
    let apiUrl = `${baseUrl}/api/invoice`;
    const data = {
    };
    if(searchbox) data.invoiceId = searchbox;
    if(Object.keys(data)) apiUrl += '?' + new URLSearchParams(data);

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookie,
            'Subtenant': subTenant,
        },
    };

    let response = await fetch(apiUrl, requestOptions);
    let responseData = await response.json();
    if (!response.ok) {
        var tbody = document.getElementById("seatTableBody");
        tbody.innerHTML = '';
        // alert(responseData.message);
    }
    else {
        responseData = responseData.data;
        document.getElementById('seatTable').classList.remove('d-none');
        var tbody = document.getElementById("seatTableBody");
        tbody.innerHTML = '';
        for (const data of responseData) {
            var newRow = document.createElement("tr");
            newRow.innerHTML = `<th scope='row'>${data.invoice_id}</th>
            <td>${data.company_to.name}</td>
            <td>${data.invoice_date}</td>
            <td>&#8377; ${data.total}</td>`;
            let user_role = sessionStorage.getItem('cookie-role');

                newRow.innerHTML+=`<td><a href="#" class="delete-link h5 text-info"><i class="ti ti-trash"></i></a></td>`;
                const deleteLink = newRow.querySelector('.delete-link');
                deleteLink.addEventListener('click', function (event) {
                    event.preventDefault();
                    deleteInvoice(data.invoice_id);
                });
            tbody.appendChild(newRow);
        }
    }
    return false;
};

const deleteInvoice = async (id) => {
    let { cookie, subTenant } = checkAuth();
    let apiUrl = `${baseUrl}/api/invoice/${id}`;
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookie,
            'Subtenant': subTenant,
        },
    };

    let response = await fetch(apiUrl, requestOptions);
    let responseData = await response.json();
    if (!response.ok) {
        var tbody = document.getElementById("seatTableBody");
        tbody.innerHTML = '';
        alert(responseData.message);
    }
    else {
        location.reload();
    }
    return false;
};

document.getElementById('searchButton').addEventListener('click', fetchInvoices);


checkAuth();
fetchInvoices();