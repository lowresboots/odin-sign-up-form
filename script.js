document.addEventListener('DOMContentLoaded', () => {
    const logoText = document.querySelector('.logo-text');
    const hue = Math.floor(Math.random() * 360);

    logoText.style.color = `hsl(${hue}, 100%, 50%)`;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes random-color-change {
            0% { color: hsl(${hue}, 100%, 50%); }
            50% { color: hsl(${(hue + 180) % 360}, 100%, 50%); }
            100% { color: hsl(${hue}, 100%, 50%); }
        }`;
    document.head.appendChild(style);
});

const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    [lastX, lastY] = [e.clientX - rect.left, e.clientY - rect.top];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

ctx.strokeStyle = '#000';
ctx.lineWidth = 2;
ctx.lineCap = 'round';

function clearSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.getElementById('scamForm').addEventListener('submit', function (e) {
    e.preventDefault();

    let formIsValid = true;

    const emailField = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailField.value)) {
        emailField.setCustomValidity('Please enter a valid email address.');
        emailError.style.display = 'block';
        emailField.classList.add('invalid');
        formIsValid = false;
    } else {
        emailField.setCustomValidity('');
        emailError.style.display = 'none';
        emailField.classList.remove('invalid');
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const hasSignature = imageData.some(pixel => pixel !== 0);

    if (!hasSignature) {
        formIsValid = false;
        alert('Please sign the form before submitting.');
        return;
    }

    validatePasswordMatch();

    if (formIsValid && document.getElementById('scamForm').checkValidity()) {
        alert('Form submitted successfully! We will now steal... er, manage your assets.');
    } else {
        const firstInvalidInput = document.querySelector('.invalid');
        if (firstInvalidInput) {
            firstInvalidInput.focus();
        }
    }
});

function validatePasswordMatch() {
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const passwordMatchError = document.getElementById('passwordMatchError');

    if (confirmPasswordField.value.length > 0) {
        if (passwordField.value !== confirmPasswordField.value) {
            confirmPasswordField.setCustomValidity('Passwords do not match.');
            passwordMatchError.style.display = 'block';
            confirmPasswordField.classList.add('invalid');
        } else {
            confirmPasswordField.setCustomValidity('');
            passwordMatchError.style.display = 'none';
            confirmPasswordField.classList.remove('invalid');
        }
    } else {
        passwordMatchError.style.display = 'none';
        confirmPasswordField.classList.remove('invalid');
    }
}

document.getElementById('password').addEventListener('input', validatePasswordMatch);
document.getElementById('confirmPassword').addEventListener('input', validatePasswordMatch);

document.getElementById('email').addEventListener('input', function() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailError = document.getElementById('emailError');
    
    if (!emailPattern.test(this.value)) {
        this.setCustomValidity('Please enter a valid email address.');
        emailError.style.display = 'block';
        this.classList.add('invalid');
    } else {
        this.setCustomValidity('');
        emailError.style.display = 'none';
        this.classList.remove('invalid');
    }
});

document.getElementById('phone').addEventListener('input', function () {
    const phonePattern = /^\d{10}$/;
    const phoneError = document.getElementById('phoneError');
    if (!phonePattern.test(this.value)) {
        this.setCustomValidity('Please enter a valid 10-digit phone number.');
        phoneError.style.display = 'block';
        this.classList.add('invalid');
    } else {
        this.setCustomValidity('');
        phoneError.style.display = 'none';
        this.classList.remove('invalid');
    }
});

document.getElementById('bankAccount').addEventListener('input', function () {
    const bankAccountPattern = /^\d+$/;
    const bankAccountError = document.getElementById('bankAccountError');
    if (!bankAccountPattern.test(this.value)) {
        this.setCustomValidity('Please enter a valid bank account number.');
        bankAccountError.style.display = 'block';
        this.classList.add('invalid');
    } else {
        this.setCustomValidity('');
        bankAccountError.style.display = 'none';
        this.classList.remove('invalid');
    }
});

document.getElementById('maidenName').addEventListener('input', function () {
    const maidenNamePattern = /^[A-Za-z\s]+$/;
    const maidenNameError = document.getElementById('maidenNameError');
    if (!maidenNamePattern.test(this.value)) {
        this.setCustomValidity('Please use letters and spaces only.');
        maidenNameError.style.display = 'block';
        this.classList.add('invalid');
    } else {
        this.setCustomValidity('');
        maidenNameError.style.display = 'none';
        this.classList.remove('invalid');
    }
});

document.getElementById('ssn').addEventListener('input', function () {
    let value = this.value.replace(/\D/g, '');
    if (value.length > 9) value = value.slice(0, 9);
    if (value.length >= 5) {
        value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5);
    } else if (value.length >= 3) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    }
    this.value = value;
});

document.getElementById('dob').addEventListener('input', function () {
    let value = this.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length >= 5) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
    } else if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    this.value = value;
});