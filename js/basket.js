import { createApiEndpoint, handleLogout, getCookie, QuantityCookie, deleteOrder } from './functions.js';

const displayDiv = document.querySelector('#displayDiv');
const userContainer = document.querySelector('#user-container');
const userNameElement = document.querySelector('#user-name');
const logoutButton = document.querySelector('#logout-button');
let basketTitle = document.querySelector('#basket-title');

const orderApiUrl = createApiEndpoint(`orders`);
const userApiUrl = createApiEndpoint("user");

userContainer.style.display = 'none';
userNameElement.textContent = ''

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

    userContainer.style.display = '';
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
        orderData = data[0].order;
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
  let totalQuantity = 0;
  let tableContainer = document.createElement('table');
  tableContainer.classList.add('container');

  let thead = document.createElement('thead');
  let headRow = document.createElement('tr');
  ['Mennyiség', 'Megnevezés', 'Ár', 'Összesen'].forEach((headerText) => {
    let th = document.createElement('th');
    th.textContent = headerText.charAt(0).toUpperCase() + headerText.slice(1);
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  tableContainer.appendChild(thead);

  let tbody = document.createElement('tbody');

  orderData.forEach((orderItem) => {
    let tr = document.createElement('tr');

    Object.keys(orderItem).forEach((key) => {
      let td = document.createElement('td');
      td.textContent = orderItem[key];
      tr.appendChild(td);

      if (key === 'quantity') {
        totalQuantity += parseInt(orderItem[key]);
      }
    });

    tbody.appendChild(tr);
  });

  QuantityCookie(totalQuantity, basketTitle);

  tableContainer.appendChild(tbody);

  return tableContainer;
}