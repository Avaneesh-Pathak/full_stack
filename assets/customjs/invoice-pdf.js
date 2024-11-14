const onClickPrint = (innerContents) => {
  let popupWinindow;
  popupWinindow = window.open("", "_blank", "height=650,width=900,top=100,left=150,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no");
  popupWinindow.document.open();
  popupWinindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Tack Tax Ware - Invoice Print</title>
    <!-- plugins:css -->
    <link rel="stylesheet" href="./assets/vendors/mdi/css/materialdesignicons.min.css">
    <link rel="stylesheet" href="./assets/vendors/ti-icons/css/themify-icons.css">
    <link rel="stylesheet" href="./assets/vendors/css/vendor.bundle.base.css">
    <link rel="stylesheet" href="./assets/vendors/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="./assets/css/bootstrap.min.css">

    <link rel="stylesheet" href="./assets/css/style.css">

    <link rel="shortcut icon" href="./assets/images/favicon.png" />
    </head>
    <body>
        <!-- <div style="margin-top: 100px; vertical-align:middle;"> -->
        <div style="margin-top: 10%;"></div>
        ${innerContents}
        <!-- </div> -->
        </div>
    </body>
    </html>
    `);

  popupWinindow.document.close(); 
  popupWinindow.focus(); 

  popupWinindow.print();
  popupWinindow.onafterprint = () => popupWinindow.close();

  return true;
};

const printDiv = () => onClickPrint(document.getElementById("printInvoiceDiv").innerHTML);

document.getElementById("saveAsPdfButton").addEventListener("click", () => printDiv());

// document.getElementById("uploadLogo").addEventListener("click", () => printDiv());

const updateData = () => {

    let printInvoiceDiv = document.getElementById("printInvoiceDiv");
    let invoiceDate = sessionStorage.getItem("invoiceDate");
    let currentDate = sessionStorage.getItem("currentDate");
    let totalBeforeTax = sessionStorage.getItem("totalBeforeTax");
    let tax = sessionStorage.getItem("tax");
    let discount = sessionStorage.getItem("discount");
    let total = sessionStorage.getItem("total");
    let data = JSON.parse(sessionStorage.getItem("data"));
    
    printInvoiceDiv.innerHTML = `
        <div class="row gy-3 mb-3">
              <div class="col-11" id="imagePreview">
          </div>
        <div class="col-12">
            <h4>From</h4>
            <address>
                <strong>${data.company_from.name}</strong><br>
                ${data.company_from.address}<br>
                Phone: ${data.company_from.contact_no}<br>
                Email: ${data.company_from.email}<br>
                GST No: ${data.company_from.gst_no}
            </address>
        </div>
        <div class="row mb-3">
            <div class="col-12 col-sm-6 col-md-7">
                <h4>Bill To</h4>
                <address>
                    <strong>${data.company_to.name}</strong><br>
                    ${data.company_to.address}<br>
                    Phone: ${data.company_to.contact_no}<br>
                    Email: ${data.company_to.email}<br>
                    GST No: ${data.company_to.gst_no}
                </address>
            </div>
            <div class="col-12 col-sm-6 col-md-5">
                <h4 class="row">
                    <span class="col-6">Invoice #</span>
                    <span class="col-6 text-sm-end">${data.invoice_id}</span>
                </h4>
                <div class="row">
                    <span class="col-6">Invoice Date</span>
                    <span class="col-6 text-sm-end">${invoiceDate}</span><br>
                    <span class="col-6">Due Date</span>
                    <span class="col-6 text-sm-end">${currentDate}</span>
                </div>
            </div>
        </div>
        <div class="row mb-3">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col" rowspan="2" class="text-uppercase">Product</th>
                                <th scope="col" rowspan="2" class="text-uppercase text-center">Qty</th>
                                <th scope="col" rowspan="2" class="text-uppercase text-center">HSN</th>
                                <th scope="col" rowspan="2" class="text-uppercase text-center">Unit Price(&#8377;)</th>
                                <th scope="col" colspan="2" class="text-uppercase text-center">GST(&#8377;)</th>
                                <th scope="col" rowspan="2" class="text-uppercase text-center">Discount(&#8377;)</th>
                                <th scope="col" rowspan="2" class="text-uppercase text-center">Total(&#8377;)</th>
                            </tr>
                            <tr>
                                <th>SGST(&#8377;)</th>
                                <th>CGST(&#8377;)</th>
                            </tr>
                        </thead>
                        <tbody id="invoiceData" class="table-group-divider">
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="col-12 text-end">
          <div class="col-11" id="signaturePreview">
        </div>
        <div id="authSign" class="col-12 text-end d-none">
          <h4>Authorised Signatory</h4>
        </div>
        </div>`;
    
    let tbody = document.getElementById("invoiceData");
    tbody.innerHTML = "";
    let invoiceProducts = data.invoice_product;
    for (const invoiceData of invoiceProducts) {
        let scgst = (parseFloat(invoiceData.gst_perc)*parseFloat(invoiceData.quantity)*parseFloat(invoiceData.unit_price))/200;
      var newRow = document.createElement("tr");
      newRow.innerHTML = `<th scope='row'>${invoiceData.name}</th>
                    <td>${invoiceData.quantity}</td>
                    <td class="text-center">${invoiceData.hsn_sac}</td>
                    <td class="text-center">${invoiceData.unit_price}</td>
                    <td class="text-center">${scgst}</td>
                    <td class="text-center">${scgst}</td>
                    <td class="text-end">${discount}</td>
                    <td class="text-end">${invoiceData.amount}</td>`;
      tbody.appendChild(newRow);
    }
    tbody.innerHTML += `
        <tr>
            <td colspan="7" class="text-end">SubTotal</td>
            <td class="text-end">&#8377; ${totalBeforeTax}</td>
        </tr>
        <tr>
            <td colspan="7" class="text-end">Tax</td>
            <td class="text-end">&#8377; ${tax}</td>
        </tr>
        <tr>
            <td colspan="7" class="text-end">Discount</td>
            <td class="text-end">&#8377; ${discount}</td>
        </tr>
        <tr>
            <th scope="row" colspan="7" class="text-uppercase text-end">Total</th>
            <td class="text-end">&#8377; ${total}</td>
        </tr>`;
}

const uploadLogo = () => {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');

    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();

            reader.addEventListener('load', function() {
                imagePreview.innerHTML = `<a class="d-block text-end" href="#!">
                <img src="${this.result}" class="img-fluid" alt="Invoice Logo" width="100" height="30">
                </a>`;
            });

            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = "No Image Uploaded";
        }
    });

    const signatureUpload = document.getElementById('signatureUpload');
    const signaturePreview = document.getElementById('signaturePreview');

    signatureUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();

            reader.addEventListener('load', function() {
                document.getElementById('authSign').classList.remove('d-none');
                signaturePreview.innerHTML = `<a class="d-block text-end" href="#!">
                <img src="${this.result}" class="img-fluid" alt="Invoice Logo" width="100" height="30">
                </a>`;
            });

            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = "No Image Uploaded";
        }
    });
}

updateData();
uploadLogo();
