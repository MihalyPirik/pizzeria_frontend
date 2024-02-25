const baseUrl = 'http://127.0.0.1:8000';

const foodsByCategoriesApiUrl = createApiEndpoint('foods-by-categories');
const displayDivId = 'categories-display';
const newPageUrl = addBaseUrl('/foods.html');
const defaultImageSrc = addBaseUrl('/imgs/pizzak1.png');
const displayDiv = document.getElementById(displayDivId);
const userNameElement = document.querySelector('#user-name');
const userContainer = document.querySelector('#user-container');
const inputContainerElement = document.querySelector('#input-container');

userNameElement.textContent = '';
inputContainerElement.style.display = '';
userContainer.style.display = 'none';

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
      displayValuesInDiv(data, 'CategoryId', 'Category', 'foodCount', displayDiv);
    } else {
      console.error('Error: Received data is not an array.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

const userApiUrl = createApiEndpoint("user");
let userData;

const userToken = getCookie('userToken');
if (userToken) {
  fetch(userApiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  })
    .then(response => response.json())
    .then(data => {
      userData = data[0];

      const userName = userData.name;
      userNameElement.textContent = userName;

      userContainer.style.display = '';
      inputContainerElement.style.display = 'none';
    })
    .catch(error => {
      console.error('Hiba történt a felhasználó adatainak lekérése közben:', error);
    });
}

const logoutApiUrl = createApiEndpoint("logout");

const logoutButton = document.querySelector('#logout-button');
logoutButton.addEventListener('click', handleLogout);

function addBaseUrl(endpoint) {
  return `${baseUrl}${endpoint}`;
}

function createApiEndpoint(endpoint) {
  return addBaseUrl(`/api/${endpoint}`);
}

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}


function clearDisplayDiv(displayDiv) {
  if (displayDiv) {
    displayDiv.innerHTML = '';
  }
}

function displayValuesInDiv(dataArray, categoryIdKey, categoryNameKey, foodCountKey, displayDiv) {
  dataArray.forEach(item => {
    const divElement = document.createElement('div');
    divElement.className = "col-md-4 text-center";
    divElement.setAttribute("data-aos", "fade-up");
    divElement.setAttribute("data-aos-delay", "100");
    divElement.setAttribute("data-aos-duration", "1000");

    var anchorElement = document.createElement("a");
    anchorElement.href = "foods.html";
    anchorElement.className = "card-move img-transparent-background";

    var imgElement = document.createElement("img");
    imgElement.className = "card-img-top";
    imgElement.src = "../imgs/pizzak1.png";
    imgElement.alt = "Card image cap";

    anchorElement.appendChild(imgElement);

    var cardBodyElement = document.createElement("div");
    cardBodyElement.className = "card-body";

    var headingElement = document.createElement("h5");
    headingElement.textContent = item[categoryNameKey];

    var paragraphElement = document.createElement("p");
    paragraphElement.textContent = "(" + item[foodCountKey] + ") féle";

    cardBodyElement.appendChild(headingElement);
    cardBodyElement.appendChild(paragraphElement);

    divElement.appendChild(anchorElement);
    divElement.appendChild(cardBodyElement);

    displayDiv.appendChild(divElement);

    anchorElement.addEventListener("click", function (event) {
      event.preventDefault();

      const clickedCardId = item[categoryIdKey];
      console.log('Clicked card ID:', clickedCardId);

      window.location.href = `foods.html?id=${clickedCardId}`;
    });
  });
};

function handleLogout() {
  fetch(logoutApiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Hiba történt a kijelentkezés során');
      }
      document.cookie = 'userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = 'index.html';
    })
    .catch(error => {
      console.error('Hiba történt a kijelentkezés során:', error);
    });
}