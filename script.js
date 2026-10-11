function generatePassword() {
    let length = document.getElementById("length").value;
    
let error = document.getElementById("error");

if (length === "" || Number(length) < 1 ||
    !Number.isInteger(Number(length))) {
    error.textContent = "Invalid Number! Enter a positive whole number.";
    document.getElementById("result").value = "";
    return;
}

error.textContent = "";
    

    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    let password = "";

    for(let i=0; i<length; i++){
        password += chars.charAt(Math.floor(Math.random()*chars.length));
    }

    document.getElementById("result").value = password;
}

function copyPassword() {
    let result = document.getElementById("result");
    navigator.clipboard.writeText(result.value);
    alert("Password Copied!");
}
