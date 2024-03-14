import { createApiEndpoint, handleLogout, clearDisplayDiv, getCookie } from './functions.js';

const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('id');

const imgURL = '../imgs/pizzak1.png';

const displayDiv = document.querySelector('#food-display');
const userNameElement = document.querySelector('#user-name');
const userContainer = document.querySelector('#user-container');
const inputContainerElement = document.querySelector('#input-container');
const logoutButton = document.querySelector('#logout-button');

const FOODS_PAGE_URL = 'foods.html';

const foodsByCategoriesApiUrl = createApiEndpoint(`categories/${categoryId}`);
const userApiUrl = createApiEndpoint("user");

userNameElement.textContent = '';
inputContainerElement.style.display = '';
userContainer.style.display = 'none';

const userToken = getCookie('userToken');
let userData;

logoutButton.addEventListener('click', handleLogout);

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

if (userToken) {
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
      inputContainerElement.style.display = 'none';
    })
    .catch(error => {
      console.error('Hiba történt a felhasználó adatainak lekérése közben:', error);
    });
}

function displayValuesInDiv(dataArray, name, price, displayDiv, imgURL, pageURL) {
  dataArray.forEach(item => {
    const divElement = document.createElement('div');
    divElement.className = "col-md-4 text-center";
    divElement.setAttribute("data-aos", "fade-up");
    divElement.setAttribute("data-aos-delay", "100");
    divElement.setAttribute("data-aos-duration", "1000");

    const anchorElement = document.createElement("a");
    anchorElement.href = pageURL;
    anchorElement.className = "card-move img-transparent-background";

    const imgElement = document.createElement("img");
    imgElement.className = "card-img-top";
    imgElement.src = imgURL;
    imgElement.alt = "Card image cap";

    anchorElement.appendChild(imgElement);

    const cardBodyElement = document.createElement("div");
    cardBodyElement.className = "card-body";

    const headingElement = document.createElement("h5");
    headingElement.textContent = item[name];

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "content-wrapper";

    const paragraphElement = document.createElement("p");
    paragraphElement.className = "price";
    paragraphElement.textContent = item[price] + " forint";

    const buttonElement = document.createElement("button");
    buttonElement.className = "btn btn-primary btn-sm order-btn orderBtn";
    buttonElement.textContent = "kosárba";

    contentWrapper.appendChild(paragraphElement);
    contentWrapper.appendChild(buttonElement);

    cardBodyElement.appendChild(headingElement);
    cardBodyElement.appendChild(contentWrapper);

    divElement.appendChild(anchorElement);
    divElement.appendChild(cardBodyElement);

    displayDiv.appendChild(divElement);

    anchorElement.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("teszt");
    });
  });
};