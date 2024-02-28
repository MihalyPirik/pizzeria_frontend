import { createApiEndpoint, handleLogout, clearDisplayDiv, getCookie } from './functions.js';

const imgURL = '../imgs/pizzak1.png';

const displayDiv = document.querySelector('#categories-display');
const userNameElement = document.querySelector('#user-name');
const userContainer = document.querySelector('#user-container');
const inputContainerElement = document.querySelector('#input-container');
const logoutButton = document.querySelector('#logout-button');

const FOODS_PAGE_URL = 'foods.html';

const foodsByCategoriesApiUrl = createApiEndpoint('foods-by-categories');
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

    if (Array.isArray(data)) {
      displayValuesInDiv(data, 'CategoryId', 'Category', 'foodCount', displayDiv, imgURL, FOODS_PAGE_URL);
    } else {
      console.error('Error: A kapott adat nem egy tömb.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

if (userToken && userToken.trim() !== "") {
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

        userContainer.style.display = '';
        inputContainerElement.style.display = 'none';
      } else {
        throw new Error('Hibás felhasználói adatok');
      }
    })
    .catch(error => {
      console.error('Hiba történt a felhasználó adatainak lekérése közben:', error);
    });
}

function displayValuesInDiv(dataArray, categoryIdKey, categoryNameKey, foodCountKey, displayDiv, imgURL, pageURL) {
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
    headingElement.textContent = item[categoryNameKey];

    const paragraphElement = document.createElement("p");
    paragraphElement.textContent = "(" + item[foodCountKey] + ") féle";

    cardBodyElement.appendChild(headingElement);
    cardBodyElement.appendChild(paragraphElement);

    divElement.appendChild(anchorElement);
    divElement.appendChild(cardBodyElement);

    displayDiv.appendChild(divElement);

    anchorElement.addEventListener("click", function (event) {
      event.preventDefault();

      const clickedCardId = item[categoryIdKey];

      window.location.href = `${FOODS_PAGE_URL}?id=${clickedCardId}`;
    });
  });
};