import { createApiEndpoint, Message } from './functions.js';

const LOGIN_PAGE_URL = 'login.html';

document.getElementById('registrationForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const name = document.querySelector('#InputName').value;
  const email = document.querySelector('#InputEmail').value;
  const phoneNumber = document.querySelector('#InputPhoneNumber').value;
  const password = document.querySelector('#InputPassword').value;
  const password_confirmation = document.querySelector('#InputPassword2').value;
  const address = document.querySelector('#InputAddress').value;
  const message = document.querySelector('#error');

  const chechEmailApiUrl = createApiEndpoint('check-email/' + email);
  const registerApiUrl = createApiEndpoint('register');

  fetch(chechEmailApiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.exists) {
        Message('Ez az email cím már foglalt!', message, 'red');
        return;
      }

      if (!validateUserData(name, email, phoneNumber, password, password_confirmation, address, message)) {
        return;
      }

      registerUser(name, email, phoneNumber, password, password_confirmation, address, message);
    })
    .catch(error => {
      Message('Hiba történt az email ellenőrzése során!', message, 'red');
    });

  function validateUserData(name, email, phoneNumber, password, password_confirmation, address, message) {
    if (name === '' || name === null) {
      Message('Kérem, adjon meg egy nevet!', message, 'red');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Message('Kérem, adjon meg egy érvényes e-mail címet!', message, 'red');
      return;
    }

    const phoneRegex = /^\+36(?:20|30|70)\d{7}$/;
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

    return true;
  }

  function registerUser(name, email, phoneNumber, password, password_confirmation, address, message) {
    const formData = { name, email, phoneNumber, password, password_confirmation, address };;

    fetch(registerApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Hiba történt a regisztráció során!');
        }
        return response.json();
      })
      .then(data => {
        Message('Sikeres regisztráció!', message, 'green');
        window.location.href = LOGIN_PAGE_URL;
      })
      .catch(error => {
        Message('Hiba történt a regisztráció során!', message, 'red');
      });
  }
});