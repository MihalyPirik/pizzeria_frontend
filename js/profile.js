import { createApiEndpoint, handleLogout, getCookie, getTotalQuantityFromCookie, Message } from './functions.js';

const userNameElement = document.querySelector('#user-name');
const userContainer = document.querySelector('#user-container');
const inputContainerElement = document.querySelector('#input-container');
const loginElement = document.querySelector('#login');
const registerElement = document.querySelector('#register');
const logoutButton = document.querySelector('#logout-button');
const saveButton = document.querySelector('#save-button');
const message = document.querySelector('#error');

let name = document.querySelector('#InputName');
let email = document.querySelector('#InputEmail');
let phoneNumber = document.querySelector('#InputPhoneNumber');
let address = document.querySelector('#InputAddress');
let basketTitle = document.querySelector('#basket-title');

const userApiUrl = createApiEndpoint("user");

userNameElement.textContent = '';
inputContainerElement.style.display = '';
loginElement.textContent = 'Bejelentkezés';
registerElement.textContent = 'Regisztráció';
userContainer.style.display = 'none';

const userToken = getCookie('userToken');
let userData;

logoutButton.addEventListener('click', handleLogout);
saveButton.addEventListener('click', function (event) {
  event.preventDefault();
  saveChanges();
});

if (userToken && userToken.trim() !== "") {
  fetchData();
}

function fetchData() {
  fetch(userApiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('A felhasználó adatainak lekérése sikertelen');
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        userData = data;
        const userName = userData.name;
        userNameElement.textContent = userName;
        name.value = userData.name;
        email.value = userData.email;
        phoneNumber.value = userData.phoneNumber;
        address.value = userData.address;
        userNameElement.addEventListener('click', function () {
          window.location.href = 'profile.html';
        });

        basketTitle.textContent = getTotalQuantityFromCookie();
        inputContainerElement.style.display = 'none';
        loginElement.textContent = '';
        registerElement.textContent = '';
        userContainer.style.display = '';
      } else {
        throw new Error('Hibás felhasználói adatok');
      }
    })
    .catch(error => {
      console.error('Hiba történt a felhasználó adatainak lekérése közben:', error);
    });
}

function saveChanges() {
  let formattedData = {};

  userData.name = name.value;
  userData.phoneNumber = phoneNumber.value;
  userData.address = address.value;
  if (userData.email != email.value) {
    userData.email = email.value;
    formattedData = {
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      address: userData.address
    }
  }
  else {
    formattedData = {
      name: userData.name,
      phoneNumber: userData.phoneNumber,
      address: userData.address
    }
  }

  fetch(userApiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formattedData)
  })
    .then(response => {
      if (!response.ok) {
        Message('A hálózati válasz nem volt rendben!', message, 'red');
        return;
      }
      Message('Sikeres módosítás!', message, 'green');
      return response.json();
    })
    .catch(error => {
      Message('Hiba történt a felhasználó adatainak módosítása közben!', message, 'red');
    });
}