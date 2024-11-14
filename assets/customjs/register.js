const baseUrl = 'https://hospital-demo-backend.vercel.app';
// const baseUrl = 'http://localhost:3001';
const apiKey = 'test1234';

const registerUser = async (event) => {

    if (event && event.preventDefault) event.preventDefault();

        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let name = document.getElementById('name').value;

            const apiUrl = `${baseUrl}/user/create`;
            const data = {
                "email": email,
                "password": password,
                "name": name
            };
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            };
    
            let response = await fetch(apiUrl, requestOptions);
            let responseData = await response.json();
            if (!response.ok) {
                alert(responseData.message);
            }
            else {
                window.location.href = "./login.html";
            }
        
    
    return false;
};

let checkboxListener = document.getElementById("terms");

checkboxListener.addEventListener('change', () => {
    if (checkboxListener.checked) checkboxListener.value = 1;
    else checkboxListener.value = 0;
});