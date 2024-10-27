const baseUrl = 'https://pmweb.hu';

const INDEX_PAGE_URL = 'index.html';

const logoutApiUrl = createApiEndpoint("logout");
const orderApiUrl = createApiEndpoint(`orders`);
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

async function fetchOrders() {
  try {
    const orders = await getOrders();
    return orders;
  } catch (error) {
    console.error('Hiba történt:', error);
  }
}

function getOrders() {
  return fetch(orderApiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error.message);
      throw error;
    });
}

function createOrder(orderData) {
  fetch(orderApiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('A hálózati válasz nem volt rendben');
      }
      console.log(orderData);
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}

function updateOrder(orderId, updatedData, created_at) {
  const formattedData = {
    id: orderId,
    order: updatedData,
    created_at: created_at
  };

  fetch(`${orderApiUrl}/${orderId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formattedData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('A hálózati válasz nem volt rendben');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}

function deleteOrder(orderId) {
  fetch(`${orderApiUrl}/${orderId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${userToken}`
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('A hálózati válasz nem volt rendben');
      }
      console.log('A rendelés sikeresen törölve lett.');
    })
    .catch(error => {
      console.error('Hiba történt a rendelés törlése közben:', error.message);
    });
}

function setTotalQuantityCookie(totalQuantity) {
  document.cookie = `totalQuantity=${totalQuantity}`;
}

function getTotalQuantityFromCookie() {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'totalQuantity') {
      return parseInt(value) || 0;
    }
  }
  return "";
}

function QuantityCookie(totalQuantity, basketTitle) {
  setTotalQuantityCookie(totalQuantity);
  basketTitle.textContent = getTotalQuantityFromCookie();
}

export {
  createApiEndpoint,
  handleLogout,
  clearDisplayDiv,
  getCookie,
  Message,
  setTotalQuantityCookie,
  getTotalQuantityFromCookie,
  fetchOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  QuantityCookie
};
