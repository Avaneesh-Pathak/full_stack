const baseUrl = 'https://hospital-demo-backend.vercel.app';
// const baseUrl = 'http://localhost:3001';

const loginUser = async (event) => {
    if (event && event.preventDefault) event.preventDefault();
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    
    const apiUrl = `${baseUrl}/user/login`;
    const data = {
        "email": email,
        "password": password
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    let response = await fetch(apiUrl, requestOptions);
    let responseData = await response.json();
    if (!response.ok) {
        alert(responseData.message);
    }
    else {
      console.log(responseData.user);
        sessionStorage.setItem("cookie", responseData.data);
        sessionStorage.setItem("cookie-expiry", Date.now() + (24*60*60*1000));
        sessionStorage.setItem("cookie-user", JSON.stringify(responseData.user));
        window.location.href = "./index.html";
    }
    return false;
};

// const passwordField = document.getElementById("password");
// const togglePassword = document.querySelector(".password-toggle-icon i");

// togglePassword.addEventListener("click", function () {
//   if (passwordField.type === "password") {
//     passwordField.type = "text";
//     togglePassword.classList.remove("mdi-eye-circle-outline");
//     togglePassword.classList.add("mdi-eye-circle");
//   } else {
//     passwordField.type = "password";
//     togglePassword.classList.remove("mdi-eye-circle");
//     togglePassword.classList.add("mdi-eye-circle-outline");
//   }
// });