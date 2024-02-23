const baseUrl = 'http://127.0.0.1:8000';

function addBaseUrl(endpoint) {
  return `${baseUrl}${endpoint}`;
}

function createApiEndpoint(endpoint) {
  return addBaseUrl(`/api/${endpoint}`);
}

function Message(message, element, color) {
  element.style.display = 'block';
  element.style.color = color;
  element.innerHTML = message;
}

document.getElementById('registrationForm').addEventListener('submit', function (event) {
  event.preventDefault();

  let name = document.getElementById('InputName').value;
  let email = document.getElementById('InputEmail').value;
  let phoneNumber = document.getElementById('InputPhoneNumber').value;
  let password = document.getElementById('InputPassword').value;
  let password_confirmation = document.getElementById('InputPassword2').value;
  let address = document.getElementById('InputAddress').value;

  let message = document.getElementById('error');

  const chechEmailApiUrl = createApiEndpoint('check-email/' + email);

  fetch(chechEmailApiUrl)
    .then(response => response.json())
    .then(data => {
      if (data) {
        Message('Ez az email cím már foglalt!', message,'red');
      } else {
        message.style.display = 'none';

        var formData = {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
          password: password,
          password_confirmation: password_confirmation,
          address: address
        };

        if (name === '' || name === null) {
          Message('Kérem, adjon meg egy nevet!', message, 'red');
          return;
        }

        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Message('Kérem, adjon meg egy érvényes e-mail címet!', message, 'red');
          return;
        }

        var phoneRegex = /^(?:\+?36)?(?:20|30|70)\d{7}$/;
        if (!phoneRegex.test(phoneNumber)) {
          Message('Kérem, adjon meg egy érvényes telefonszámot!', message, 'red');
          return;
        }

        if (password !== password_confirmation || password === '' || password_confirmation === '' || password === null || password_confirmation === null) {
          Message('A jelszavak nem egyeznek!', message, 'red');
          return;
        }

        if (password.length < 8) {
          Message('A jelszónak legalább 8 karakter hosszúnak kell lennie!', message, 'red');
          return;
        }

        if (address === '' || address === null) {
          Message('Kérem, adjon meg egy lakcímet!', message, 'red');
          return;
        }

        const registerApiUrl = createApiEndpoint('register');

        fetch(registerApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
          .then(response => response.json())
          .then(data => {
            Message('Sikeres regisztráció!', message, 'green');
          })
          .catch(error => {
            Message('Hiba történt a regisztráció során!', message, 'red');
          });
      }
    })
    .catch(error => {
      Message('Hiba történt az email ellenőrzése során!', message, 'red');
    });
});