document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');
});

document.getElementById('signupBtn').addEventListener('click', function() {
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
});