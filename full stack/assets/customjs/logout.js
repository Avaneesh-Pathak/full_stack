const logoutUser = () => {

    sessionStorage.clear();

    window.location.href = "./login.html";

    return false;
};

let data = sessionStorage.getItem('cookie-user');
data = JSON.parse(data);
document.getElementById('adminName').innerHTML = data.name;