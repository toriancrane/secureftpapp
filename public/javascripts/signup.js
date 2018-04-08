var check = function() {
  if (document.getElementById('password').value ==
    document.getElementById('password-confirm').value) {
    document.getElementById('message').style.color = 'green';
    document.getElementById('message').innerHTML = 'Your passwords match!';
    document.getElementById('submit').disabled = false;
  } else {
    document.getElementById('message').style.color = 'red';
    document.getElementById('message').innerHTML = 'Your passwords do not match!';
    document.getElementById('submit').disabled = true;
  }
}