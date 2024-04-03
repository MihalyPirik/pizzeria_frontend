import { createApiEndpoint, handleLogout, clearDisplayDiv, getCookie, QuantityCookie, getTotalQuantityFromCookie, updateOrder, deleteOrder } from './functions.js';

const displayDiv = document.querySelector('#displayDiv');
const userContainer = document.querySelector('#user-container');
const userNameElement = document.querySelector('#user-name');
const logoutButton = document.querySelector('#logout-button');
let basketTitle = document.querySelector('#basket-title');

const orderApiUrl = createApiEndpoint('orders');
const userApiUrl = createApiEndpoint('user');

userContainer.style.display = 'none';
userNameElement.textContent = '';

const userToken = getCookie('userToken');
let userData;

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
    userNameElement.addEventListener('click', function () {
      window.location.href = 'profile.html';
    });

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
        basketTitle.textContent = getTotalQuantityFromCookie();
        let table = generateTable(data[0]);
        let button = createButtons(data[0]);
        displayDiv.appendChild(table);
        displayDiv.appendChild(button);
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

  orderData.order.forEach((orderItem) => {
    let tr = document.createElement('tr');

    Object.keys(orderItem).forEach((key) => {
      let td = document.createElement('td');
      if (key === 'quantity') {
        let select = document.createElement('select');
        select.addEventListener('change', function (event) {
          clearDisplayDiv(displayDiv);
          let quantity = getTotalQuantityFromCookie();
          if (event.target.value == 0) {
            quantity -= parseInt(orderItem.quantity);
            orderData.order.splice(orderData.order.indexOf(orderItem), 1);
            updateOrder(orderData.id, orderData.order, orderData.created_at);
            QuantityCookie(quantity, basketTitle);
            displayDiv.appendChild(generateTable(orderData));
            displayDiv.appendChild(createButtons(orderData));
          }
          else {
            quantity += parseInt(event.target.value) - parseInt(orderItem.quantity);
            orderItem.quantity = parseInt(event.target.value);
            orderItem.allPrice = parseInt(orderItem.price * event.target.value);
            updateOrder(orderData.id, orderData.order, orderData.created_at);
            QuantityCookie(quantity, basketTitle);
            displayDiv.appendChild(generateTable(orderData));
            displayDiv.appendChild(createButtons(orderData));
          }
        });
        for (let i = 0; i <= 9; i++) {
          let option = document.createElement('option');
          option.value = i;
          option.textContent = i;
          select.appendChild(option);
        }
        if (parseInt(orderItem[key]) > 9) {
          select.value = 9;
        } else {
          select.value = orderItem[key];
        }
        select.className = 'form-select';
        td.appendChild(select);
        totalQuantity += parseInt(orderItem[key]);
      } else {
        td.textContent = orderItem[key];
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  tableContainer.appendChild(tbody);

  QuantityCookie(totalQuantity, basketTitle);

  return tableContainer;
}

function createButtons(orderData) {
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'buttons-container';

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Kosár törlése';
  deleteButton.className = 'btn-sm btn btn-dark mb-5 mt-2';
  deleteButton.addEventListener('click', function () {
    deleteOrder(orderData.id);
    clearDisplayDiv(displayDiv);
    const totalQuantity = 0;
    QuantityCookie(totalQuantity, basketTitle);
  });

  const orderButton = document.createElement('button');
  orderButton.textContent = 'Rendelés';
  orderButton.className = 'btn-sm btn btn-dark mb-5 mt-2';
  orderButton.addEventListener('click', function () {
    // rendelés leadás
  });

  buttonsContainer.appendChild(deleteButton);
  buttonsContainer.appendChild(orderButton);

  return buttonsContainer;
}