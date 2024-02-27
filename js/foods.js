const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('id');

const baseUrl = 'http://127.0.0.1:8000';
const imgURL = '../imgs/pizzak1.png';

const displayDiv = document.querySelector('#food-display');
const userNameElement = document.querySelector('#user-name');
const userContainer = document.querySelector('#user-container');
const inputContainerElement = document.querySelector('#input-container');

const INDEX_PAGE_URL = 'index.html';
const FOODS_PAGE_URL = 'foods.html';

const foodsByCategoriesApiUrl = createApiEndpoint(`categories/${categoryId}`);
const userApiUrl = createApiEndpoint("user");

userNameElement.textContent = '';
inputContainerElement.style.display = '';
userContainer.style.display = 'none';

const userToken = getCookie('userToken');
let userData;

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
};

function displayValuesInDiv(dataArray, name, price, displayDiv, imgURL, pageURL) {
  dataArray.forEach(item => {
    const divElement = document.createElement('div');
    divElement.className = "col-md-4 text-center";
    divElement.setAttribute("data-aos", "fade-up");
    divElement.setAttribute("data-aos-delay", "100");
    divElement.setAttribute("data-aos-duration", "1000");

    var anchorElement = document.createElement("a");
    anchorElement.href = pageURL;
    anchorElement.className = "card-move img-transparent-background";

    var imgElement = document.createElement("img");
    imgElement.className = "card-img-top";
    imgElement.src = imgURL;
    imgElement.alt = "Card image cap";

    anchorElement.appendChild(imgElement);

    var cardBodyElement = document.createElement("div");
    cardBodyElement.className = "card-body";

    var headingElement = document.createElement("h5");
    headingElement.textContent = item[name];

    var paragraphElement = document.createElement("p");
    paragraphElement.textContent = item[price] + " forint";

    cardBodyElement.appendChild(headingElement);
    cardBodyElement.appendChild(paragraphElement);

    divElement.appendChild(anchorElement);
    divElement.appendChild(cardBodyElement);

    displayDiv.appendChild(divElement);

    anchorElement.addEventListener("click", function (event) {
      event.preventDefault();
      console.log("teszt");
    });
  });
};

function handleLogout() {
  if (!logoutApiUrl || !userToken) {
    console.error('Nincs megadva kijelentkezési URL vagy felhasználói token.');
    return;
  }

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
      window.location.href = INDEX_PAGE_URL;
    })
    .catch(error => {
      console.error('Hiba történt a kijelentkezés során:', error);
      alert('Hiba történt a kijelentkezés során. Kérlek, próbáld újra később.');
    });
}