const urlParams = new URLSearchParams(window.location.search);
const categoryId = urlParams.get('id');

console.log('Category ID:', categoryId);

const baseUrl = 'http://127.0.0.1:8000';

function addBaseUrl(endpoint) {
  return `${baseUrl}${endpoint}`;
}

function createApiEndpoint(endpoint) {
  return addBaseUrl(`/api/${endpoint}`);
}

const foodsByCategoriesApiUrl = createApiEndpoint(`categories/${categoryId}`);
const displayDivId = 'food-display';
const defaultImageSrc = addBaseUrl('/imgs/pizzak1.png');
const displayDiv = document.getElementById(displayDivId);

fetch(foodsByCategoriesApiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    clearDisplayDiv(displayDiv);
    console.log(data.foods);

    if (Array.isArray(data.foods)) {
      displayValuesInDiv(data.foods, 'name', 'price', displayDiv);
    } else {
      console.error('Error: Received data is not an array.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });

function clearDisplayDiv(displayDiv) {
  if (displayDiv) {
    displayDiv.innerHTML = '';
  }
};

function displayValuesInDiv(dataArray, name, price, displayDiv) {
  dataArray.forEach(item => {
    const divElement = document.createElement('div');
    divElement.className = "col-md-4 text-center";
    divElement.setAttribute("data-aos", "fade-up");
    divElement.setAttribute("data-aos-delay", "100");
    divElement.setAttribute("data-aos-duration", "1000");

    var anchorElement = document.createElement("a");
    anchorElement.href = "etelek.html";
    anchorElement.className = "card-move img-transparent-background";

    var imgElement = document.createElement("img");
    imgElement.className = "card-img-top";
    imgElement.src = "../imgs/pizzak1.png";
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
      
      const clickedCardId = item[categoryIdKey];
      console.log('Clicked card ID:', clickedCardId);

      window.location.href = `etelek.html?id=${clickedCardId}`;
    });
  });
};