
function validateForm() {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    if (username === 'Nitin' && password === 'nitin') {
      window.location.href = 'idex.html';
      return false; 
    } else {
      alert("No User Found. Try Signing Up.");
      return false;
    }
  }

  