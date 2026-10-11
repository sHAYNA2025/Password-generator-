
function generatePassword() {
    const lengthInput = document.getElementById("length");
    const result = document.getElementById("result");
    const message = document.getElementById("message");

    const length = Number(lengthInput.value);

    const groups = [];

    if (document.getElementById("uppercase").checked) {
        groups.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }

    if (document.getElementById("lowercase").checked) {
        groups.push("abcdefghijklmnopqrstuvwxyz");
    }

    if (document.getElementById("numbers").checked) {
        groups.push("0123456789");
    }

    if (document.getElementById("symbols").checked) {
        groups.push("!@#$%^&*()_+-=");
    }

    result.value = "";
    message.textContent = "";

    document.getElementById("strength-text").textContent = "Not generated";
    document.getElementById("strength-bar").style.width = "0%";

    if (!Number.isInteger(length) || length < 1 || length > 128) {
        message.textContent = "Enter a length between 1 and 128.";
        return;
    }

    if (groups.length === 0) {
        message.textContent = "Please select at least one option.";
        return;
    }

    if (length < groups.length) {
        message.textContent =
            "Increase the length to match your selected options.";
        return;
    }

    const allChars = groups.join("");
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let password = "";

    // Include at least one character from every selected group
    for (const group of groups) {
        const randomIndex = new Uint32Array(1);
        crypto.getRandomValues(randomIndex);

        password += group[randomIndex[0] % group.length];
    }

    // Fill the remaining password length
    for (let i = password.length; i < length; i++) {
        password += allChars[randomValues[i] % allChars.length];
    }

    // Shuffle the password characters
    const chars = password.split("");

    for (let i = chars.length - 1; i > 0; i--) {
        const randomIndex = new Uint32Array(1);
        crypto.getRandomValues(randomIndex);

        const j = randomIndex[0] % (i + 1);

        [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    password = chars.join("");
    result.value = password;

    checkStrength(password);
}

function checkStrength(password) {
    const strengthText = document.getElementById("strength-text");
    const strengthBar = document.getElementById("strength-bar");

    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label;
    let percentage;
    let color;

    if (score <= 2) {
        label = "Weak";
        percentage = 30;
        color = "#fb7185";
    } else if (score <= 3) {
        label = "Medium";
        percentage = 65;
        color = "#fbbf24";
    } else {
        label = "Strong";
        percentage = 100;
        color = "#4ade80";
    }

    strengthText.textContent = label;
    strengthText.style.color = color;

    strengthBar.style.width = percentage + "%";
    strengthBar.style.background = color;
}

async function copyPassword() {
    const result = document.getElementById("result");
    const message = document.getElementById("message");

    if (!result.value) {
        message.textContent = "Generate a password first!";
        return;
    }

    try {
        await navigator.clipboard.writeText(result.value);
        message.style.color = "#86efac";
        message.textContent = "Password copied successfully! ✓";
    } catch (error) {
        message.style.color = "#fca5a5";
        message.textContent =
            "Copy unavailable. Please copy the password manually.";
    }
        }
