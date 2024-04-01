import { createApiEndpoint, handleLogout, clearDisplayDiv, getCookie, getTotalQuantityFromCookie } from './functions.js';

const imgURL = '../imgs/pizzak1.png';

const displayDiv = document.querySelector('#categories-display');
const userNameElement = document.querySelector('#user-name');
const userContainer = document.querySelector('#user-container');
const inputContainerElement = document.querySelector('#input-container');
const loginElement = document.querySelector('#login');
const registerElement = document.querySelector('#register');
const logoutButton = document.querySelector('#logout-button');
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
      if (data && data.name) {
        userData = data;
        const userName = userData.name;
        userNameElement.textContent = userName;
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