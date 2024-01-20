const baseUrl = 'http://127.0.0.1:8000';

function addBaseUrl(endpoint) {
  return `${baseUrl}${endpoint}`;
}

function createApiEndpoint(endpoint) {
  return addBaseUrl(`/api/${endpoint}`);
}

const foodsByCategoriesApiUrl = createApiEndpoint('foods-by-categories');
const displayDivId = 'categories-display';
const newPageUrl = addBaseUrl('/etelek.html');
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

    if (Array.isArray(data)) {
      displayValuesInDiv(data, 'CategoryId', 'Category', 'foodCount', displayDiv);
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
}

function displayValuesInDiv(dataArray, categoryIdKey, categoryNameKey, foodCountKey, displayDiv) {
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

      window.location.href = `etelek.html?id=${clickedCardId}`;
    });
  });
};

function gombRanyomas() {
  var tartalomDiv = document.getElementById('tartalom');
  tartalomDiv.scrollIntoView({ behavior: 'smooth' });
};
