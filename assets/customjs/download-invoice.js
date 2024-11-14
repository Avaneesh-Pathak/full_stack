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
removeInvoiceData();

const fetchInvoicesDownload = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
    let { cookie, subTenant } = checkAuth();
    let searchbox = document.getElementById('searchbox').value;
    let apiUrl = `${baseUrl}/api/invoice`;
    const data = {
        includeAll: true
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

                newRow.innerHTML+=`<td><a href="#" class="print-link h5 text-primary"  data-toggle="tooltip" data-placement="bottom" title="Print Invoice"><i class="ti ti-printer"></i></a></td>`;
                const printLink = newRow.querySelector('.print-link');
            printLink.addEventListener('click', function (event) {
                event.preventDefault();
                printInvoice(data);
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

const downloadInvoice = async (id) => {
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

function printInvoice(data) {
    let currentDate = new Date();

    let year = currentDate.getFullYear();
    let month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Months are zero-based
    let day = ('0' + currentDate.getDate()).slice(-2);
    let hours = ('0' + currentDate.getHours()).slice(-2);
    let minutes = ('0' + currentDate.getMinutes()).slice(-2);
    let seconds = ('0' + currentDate.getSeconds()).slice(-2);
    
    currentDate = `${day}/${month}/${year}`;
    let invoiceDate = new Date(data.invoice_date);
    year = invoiceDate.getFullYear();
    month = ('0' + (invoiceDate.getMonth() + 1)).slice(-2); // Months are zero-based
    day = ('0' + invoiceDate.getDate()).slice(-2);
    hours = ('0' + invoiceDate.getHours()).slice(-2);
    minutes = ('0' + invoiceDate.getMinutes()).slice(-2);
    seconds = ('0' + invoiceDate.getSeconds()).slice(-2);

    invoiceDate = `${day}/${month}/${year}`;
    data.invoice_date = invoiceDate;

    let products = data.invoice_product;
    let totalBeforeTax = 0, tax = 0, discount = 0, total = 0;
    for(const product of products){
        total += product.amount;
        totalBeforeTax += (product.unit_price*product.quantity);
        tax += ((product.unit_price*product.quantity) * product.gst_perc)/100;
        discount += ((product.unit_price*product.quantity) * product.disc_perc)/100;
    }

    sessionStorage.setItem('invoiceDate', invoiceDate);
    sessionStorage.setItem('currentDate', currentDate);
    sessionStorage.setItem('data', JSON.stringify(data));
    sessionStorage.setItem('totalBeforeTax', totalBeforeTax);
    sessionStorage.setItem('tax', tax);
    sessionStorage.setItem('discount', discount);
    sessionStorage.setItem('total', total);
    window.location.href = './invoice-pdf.html'
}

function tableToCSV() {

    // Variable to store the final csv data
    let csv_data = [];
    let rows = document.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {

        let cols = rows[i].querySelectorAll('td,th');

        let csvrow = [];
        for (let j = 0; j < cols.length - 1; j++) {
            csvrow.push(cols[j].innerHTML);
        }

        csv_data.push(csvrow.join(","));
    }
    csv_data = csv_data.join('\n');
    downloadCSVFile(csv_data);
}

function downloadCSVFile(csv_data) {

    CSVFile = new Blob([csv_data], { type: "text/csv" });
    let temp_link = document.createElement('a');

    temp_link.download = "test.csv";
    let url = window.URL.createObjectURL(CSVFile);
    temp_link.href = url;

    document.body.appendChild(temp_link);

    temp_link.click();
    document.body.removeChild(temp_link);
}



document.getElementById('searchButton').addEventListener('click', fetchInvoicesDownload);

document.getElementById('csvDownload').addEventListener('click', tableToCSV)


checkAuth();
fetchInvoicesDownload();