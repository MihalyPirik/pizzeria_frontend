import { createApiEndpoint, handleLogout, clearDisplayDiv, getCookie } from './functions.js';

const displayDiv = document.querySelector('#displayDiv');
const userNameElement = document.querySelector('#user-name');
const logoutButton = document.querySelector('#logout-button');

const orderApiUrl = createApiEndpoint(`orders`);
const userApiUrl = createApiEndpoint("user");

const userToken = getCookie('userToken');
let userData;
let orderData;

logoutButton.addEventListener('click', handleLogout);

fetch(userApiUrl, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${userToken}`
  }
})
  .then(response => response.json())
  .then(data => {
    userData = data;

    const userName = userData.name;
    userNameElement.textContent = userName;

    fetch(orderApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Hiba történt a kérés során: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        orderData = data[0].order[0];
        let table = generateTable(orderData);
        displayDiv.appendChild(table);
      })
      .catch(error => {
        console.error('Hiba történt:', error);
      });
  })
  .catch(error => {
    console.error('Hiba történt az adatok lekérése közben:', error);
  });

function generateTable(orderData) {
  let tableContainer = document.createElement('table');
  tableContainer.classList.add('container');

  // Fejléc létrehozása
  let thead = document.createElement('thead');
  let headRow = document.createElement('tr');
  ['Mennyiség', 'Megnevezés', 'Ár', 'Összesen'].forEach((headerText) => {
    let th = document.createElement('th');
    th.textContent = headerText.charAt(0).toUpperCase() + headerText.slice(1); // Az első betű nagybetűsítése
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  tableContainer.appendChild(thead);

  // Tartalom létrehozása
  let tbody = document.createElement('tbody');
  let tr = document.createElement('tr');
  Object.keys(orderData).forEach((key) => {
    let td = document.createElement('td');
    td.textContent = orderData[key];
    tr.appendChild(td);
  });
  tbody.appendChild(tr);
  tableContainer.appendChild(tbody);

  return tableContainer;
}
