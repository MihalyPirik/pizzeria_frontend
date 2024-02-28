const baseUrl = 'http://127.0.0.1:8000';

const INDEX_PAGE_URL = 'index.html';

const logoutApiUrl = createApiEndpoint("logout");
const userToken = getCookie('userToken');

function addBaseUrl(endpoint) {
  return `${baseUrl}${endpoint}`;
}

function createApiEndpoint(endpoint) {
  return addBaseUrl(`/api/${endpoint}`);
}

function clearDisplayDiv(displayDiv) {
  if (displayDiv) {
    displayDiv.innerHTML = '';
  }
}

function Message(message, element, color) {
  element.style.display = "block";
  element.style.color = color;
  element.innerHTML = message;
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

export { createApiEndpoint, handleLogout, clearDisplayDiv, getCookie, Message };