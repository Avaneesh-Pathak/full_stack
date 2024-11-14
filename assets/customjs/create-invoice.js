const baseUrl = 'https://hospital-demo-backend.vercel.app';
// const baseUrl = 'http://localhost:3001';

const checkAuth = () => {
    let cookie = sessionStorage.getItem('cookie');
    let cookie_time = sessionStorage.getItem('cookie-expiry');
    let cookie_tenant = sessionStorage.getItem('cookie-tenant');
    let now = Date.now();
    if (!cookie || now > cookie_time) window.location.href = "./login.html";
    return { cookie, subTenant: cookie_tenant } ;
};

checkAuth();
let fromExist = false, toExist = false;

const getCompanyData = (from=true) => {
    let prefix = from? 'companyFrom': 'companyTo';
    let name = document.getElementById(`${prefix}Name`).value;
    let email = document.getElementById(`${prefix}Email`).value;
    let mobileNumber = document.getElementById(`${prefix}ContactNo`).value;
    let gstNumber = document.getElementById(`${prefix}Gst`).value;
    let address = document.getElementById(`${prefix}Address`).value;
    let companyData = {
        name,
        email,
        mobileNumber,
        gstNumber,
        address
    }
    return companyData;
};

const getInvoiceDate = () =>  document.getElementById('InvoiceDate').value;

const getProductData = () => {
    let tBody = document.getElementById('product-body');
    
    let jsonMap = {
        0: "name",
        1: "quantity",
        2: "unit_price",
        3: "hsn_sac",
        4: "gst_perc",
        5: "disc_perc",
        6: "amount"
    };
    let productData = [];
    let index = 0;
    for (let row of tBody.rows) {
        let i = 0;
        let dataMap = {
            "name": "",
            "quantity": "",
            "unit_price": "",
            "hsn_sac": "",
            "gst_perc": "",
            "disc_perc": "",
            "amount": ""
        }
        for (let cell of row.cells) {
            if (i == 7) continue;
            dataMap[jsonMap[i]] = cell.textContent;
            if(!isNaN(parseFloat(cell.textContent))) dataMap[jsonMap[i]] = parseFloat(cell.textContent);
            i += 1;
        }
        productData.push(dataMap);
        index +=1;
    }
    return productData;
};

const addInvoice = async () => {
    let { cookie, subTenant } = checkAuth();
    let companyFromData = getCompanyData(true);
    let companyToData = getCompanyData(false);
    let invoiceDate = getInvoiceDate();
    let productData = getProductData();
    let total = 0;
    productData.forEach(product => {
        total+= product.amount;
    });
    let companyFromId, companyToId;
    if(fromExist) companyFromId = companyFromMap[companyFromData.name].id;
    if(toExist) companyToId = companyToMap[companyToData.name].id;

    let requestBody = {
        "companyFrom": companyFromData,
        "companyTo": companyToData,
        "companyFromId": companyFromId,
        "companyToId": companyToId,
        "invoiceDate": invoiceDate,
        "products": productData,
        "total": total
    }
    let apiUrl = `${baseUrl}/api/invoice/create`;
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + cookie,
            'Subtenant': subTenant,
        },
        body: JSON.stringify(requestBody),
    };
    
    let response = await fetch(apiUrl, requestOptions);
    let responseData = await response.json();
    if (!response.ok) alert(responseData.message);
    else {
        alert('Invoice Created Successfully');
        window.location.href = "./create-invoice.html";
    }
    return false;
};


const addProduct = () => {
    let productName = document.getElementById('productName').value || '';
    let productQuantity = document.getElementById('productQuantity').value || 0;
    let productUnitPrice = document.getElementById('productUnitPrice').value  || 0;
    let product_hsn_sac = document.getElementById('product_hsn_sac').value  || 0;
    let product_gst = document.getElementById('product_gst').value  || 0;
    let productDiscount = document.getElementById('productDiscount').value  || 0;
    
    let productAmount = parseInt(productUnitPrice)*parseInt(productQuantity);
    productAmount = (((100+parseInt(product_gst)-parseInt(productDiscount))/100)*productAmount).toFixed(2);

    let tBody = document.getElementById('product-body');
    var lastRow = tBody.rows[ tBody.rows.length - 1 ];
    let index = 1;
    if(lastRow) index = parseInt(lastRow.id) + 1;
    let row = tBody.insertRow();
    row.id = `${index}`;

    let cellMap = {
        0:productName,
        1:productQuantity,
        2:productUnitPrice,
        3:product_hsn_sac,
        4:product_gst,
        5:productDiscount,
        6:productAmount
    };
    
    for(let i=0;i<7;i++){
        let cell = row.insertCell(i);
        cell.innerHTML = `${cellMap[i]}`;
    }
    let delClass = `row-del-${index}`;
    let cell = row.insertCell(7);
    cell.innerHTML = `<a id="${delClass}" href="" style="color:red;"><i class="mdi mdi-delete-forever"></i></a>`;
    document.getElementById(`${delClass}`).addEventListener('click', function(event) {
        event.preventDefault();
        let delIndex = delClass.split('-')[2];
        let rowToDelete = document.getElementById(delIndex);
        if (rowToDelete) rowToDelete.remove();
        let pBody = document.getElementById('tbl');
        let rowcount = pBody.tBodies[0].rows.length;
        if(rowcount == 0) document.getElementById('invoiceSubmit').classList.add('disabled');
    });
    document.getElementById('tbl').classList.remove('d-none');
    document.getElementById('invoiceSubmit').classList.remove('disabled');
};

let pBtn = document.getElementById('productBtn');
pBtn.addEventListener('click', () => {
    pBtn.classList.add('d-none');
    document.getElementById('productDetail').classList.remove('d-none');
    return false;
});

const numberVaildation = (id, message = "Mobile Number should be of 10 digits") => {
  let mobileNumber = document.getElementById(id);
  mobileNumber.addEventListener("input", function (e) {
    mobileNumber.setCustomValidity("");
  });
  mobileNumber.addEventListener("invalid", function (e) {
    mobileNumber.setCustomValidity(message);
  });
};

let company_from = document.getElementById('companyFromName');
let company_to = document.getElementById('companyToName');
let fromEventSource = false;
let toEventSource = false;
let companyFromMap = {};
let companyToMap = {};

company_from.addEventListener('keydown', (e) => {
  fromEventSource = e.key ? false : true;
});
company_to.addEventListener('keydown', (e) => {
    toEventSource = e.key ? false : true;
  });

const populateCompanyData = (companyMap, search, from=true) => {
    let companyData = companyMap[search];
    let prefix = from? 'companyFrom': 'companyTo';
    document.getElementById(`${prefix}Email`).value = companyData.email;
    document.getElementById(`${prefix}ContactNo`).value = companyData.contact_no;
    document.getElementById(`${prefix}Gst`).value = companyData.gst_no;
    document.getElementById(`${prefix}Address`).value = companyData.address;
}

const searchCompanyFromData = async () => {
    let { cookie, subTenant } = checkAuth();
    let search = document.getElementById('companyFromName').value;
    if (fromEventSource) {
        fromExist = true;
        populateCompanyData(companyFromMap, search);
    } else {
        fromExist = false;
        let requestBody = {
            search: search
        };
        let apiUrl = `${baseUrl}/api/invoice/company-from`;
        apiUrl += '?' + new URLSearchParams(requestBody);
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
        if (response.ok) {
            responseData = responseData.data;
            let datalist = document.getElementById('companyFromList');
            datalist.innerHTML = '';
            datalist.classList.remove('d-none');

            responseData.forEach((item) => {
                let name = item.name;
                companyFromMap[name] = item;
                var option = document.createElement('option');
                option.value = name;
                datalist.appendChild(option);
            });
        }
    }
    return false;
};

const searchCompanyToData = async () => {
    let { cookie, subTenant } = checkAuth();
    let search = document.getElementById('companyToName').value;
    if (toEventSource) {
        toExist = true;
        populateCompanyData(companyToMap, search, from=false);
    } else {
        toExist = false;
        let requestBody = {
            search: search
        };
        let apiUrl = `${baseUrl}/api/invoice/company-to`;
        apiUrl += '?' + new URLSearchParams(requestBody);
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
        if (response.ok)  {
            responseData = responseData.data;
            let datalist = document.getElementById('companyToList');
            datalist.innerHTML = '';
            datalist.classList.remove('d-none');

            responseData.forEach((item) => {
                let name = item.name;
                companyToMap[name] = item;
                var option = document.createElement('option');
                option.value = name;
                datalist.appendChild(option);
            });
        }
    }
    return false;
};

numberVaildation("companyFromContactNo");
numberVaildation("companyToContactNo");
document.getElementById('InvoiceDate').defaultValue = "2024-01-01";
company_from.addEventListener('input', searchCompanyFromData());
company_to.addEventListener('input', searchCompanyToData());