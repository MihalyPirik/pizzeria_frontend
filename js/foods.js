import { createApiEndpoint, handleLogout, clearDisplayDiv, getCookie, QuantityCookie, getTotalQuantityFromCookie, fetchOrders, createOrder, updateOrder } from './functions.js';

const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('id');

const imgURL = '../imgs/pizzak1.png';

const displayDiv = document.querySelector('#food-display');
const userNameElement = document.querySelector('#user-name');
const userContainer = document.querySelector('#user-container');
const inputContainerElement = document.querySelector('#input-container');
const loginElement = document.querySelector('#login');
const registerElement = document.querySelector('#register');
const logoutButton = document.querySelector('#logout-button');
let basketTitle = document.querySelector('#basket-title');

const FOODS_PAGE_URL = 'foods.html';

const foodsByCategoriesApiUrl = createApiEndpoint(`categories/${categoryId}`);
const userApiUrl = createApiEndpoint('user');

userContainer.style.display = 'none';
userNameElement.textContent = '';
inputContainerElement.style.display = '';
loginElement.textContent = 'Bejelentkezés';
registerElement.textContent = 'Regisztráció';

const userToken = getCookie('userToken');
let userData;

logoutButton.addEventListener('click', handleLogout);

if (userToken && userToken.trim() !== '') {
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

fetch(foodsByCategoriesApiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    clearDisplayDiv(displayDiv);

    if (Array.isArray(data.foods)) {
      displayValuesInDiv(data.foods, 'name', 'price', displayDiv, imgURL, FOODS_PAGE_URL);
    } else {
      console.error('Error: Received data is not an array.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

function displayValuesInDiv(dataArray, name, price, displayDiv, imgURL, pageURL) {
  dataArray.forEach(item => {
    const divElement = document.createElement('div');
    divElement.className = 'col-md-4 text-center';
    divElement.setAttribute('data-aos', 'fade-up');
    divElement.setAttribute('data-aos-delay', '100');
    divElement.setAttribute('data-aos-duration', '1000');

    const anchorElement = document.createElement('a');
    anchorElement.href = pageURL;
    anchorElement.className = 'card-move img-transparent-background';

    const imgElement = document.createElement('img');
    imgElement.className = 'card-img-top';
    imgElement.src = imgURL;
    imgElement.alt = 'Card image cap';

    anchorElement.appendChild(imgElement);

    const cardBodyElement = document.createElement('div');
    cardBodyElement.className = 'card-body';

    const headingElement = document.createElement('h5');
    headingElement.textContent = item[name];

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'content-wrapper';

    const paragraphElement = document.createElement('p');
    paragraphElement.className = 'price';
    paragraphElement.textContent = item[price] + ' forint';

    const selectElement = document.createElement('select');
    selectElement.className = 'form-select';

    for (let i = 1; i <= 9; i++) {
      const optionElement = document.createElement('option');
      optionElement.textContent = i;
      if (i === 1) {
        optionElement.selected = true;
      }
      selectElement.appendChild(optionElement);
    }

    const buttonElement = document.createElement('button');
    buttonElement.className = 'btn btn-dark btn-sm order-btn orderBtn';
    buttonElement.textContent = 'kosárba';

    contentWrapper.appendChild(paragraphElement);
    contentWrapper.appendChild(selectElement);
    contentWrapper.appendChild(buttonElement);

    cardBodyElement.appendChild(headingElement);
    cardBodyElement.appendChild(contentWrapper);

    divElement.appendChild(anchorElement);
    divElement.appendChild(cardBodyElement);

    displayDiv.appendChild(divElement);

    buttonElement.addEventListener('click', function () {
      let quantity = getTotalQuantityFromCookie();
      var orderData = {
        order: [
          {
            quantity: parseInt(selectElement.value),
            name: item.name,
            price: item.price,
            allPrice: item.price * selectElement.value
          }
        ]
      };

      (async () => {
        var currentUpdate = false
        var orders = await fetchOrders();
        if (orders.length === 0) {
          createOrder(orderData);
          quantity += parseInt(selectElement.value);
          QuantityCookie(quantity, basketTitle);
          return
        }
        orders[0].order.forEach(element => {
          if (element.name === item.name) {
            quantity += parseInt(selectElement.value);
            element.quantity = parseInt(element.quantity) + parseInt(selectElement.value);
            element.allPrice = element.price * element.quantity;
            updateOrder(orders[0].id, orders[0].order, orders[0].created_at);
            currentUpdate = true;
          }
        });

        if (!currentUpdate) {
          orders[0].order.push({
            quantity: parseInt(selectElement.value),
            name: item.name,
            price: item.price,
            allPrice: item.price * selectElement.value
          });
          quantity += parseInt(selectElement.value);
          updateOrder(orders[0].id, orders[0].order, orders[0].created_at);
        }

        QuantityCookie(quantity, basketTitle);
      })();
    });

    anchorElement.addEventListener('click', function (event) {
      event.preventDefault();
    });
  });
};
