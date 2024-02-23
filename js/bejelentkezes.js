const baseUrl = "http://127.0.0.1:8000";

function addBaseUrl(endpoint) {
  return `${baseUrl}${endpoint}`;
}

function createApiEndpoint(endpoint) {
  return addBaseUrl(`/api/${endpoint}`);
}

function Message(message, element, color) {
  element.style.display = "block";
  element.style.color = color;
  element.innerHTML = message;
}

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let email = document.getElementById("InputEmail").value;
    let password = document.getElementById("InputPassword").value;

    let message = document.getElementById("error");

    var formData = {
      email: email,
      password: password,
    };

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Message("Kérem, adjon meg egy érvényes e-mail címet!", message, "red");
      return;
    }

    if (password === "" || password === null) {
      Message("A jelszó megadása kötelező!", message, "red");
      return;
    }

    const loginApiUrl = createApiEndpoint("login");
    let userToken;

    fetch(loginApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          response.json().then((data) => {
            Message(data.message, message, "red");
          });
        } else {
          response.json().then((data) => {
            Message("Sikeres bejelentkezés!", message, "green");
            userToken = data.token;
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            document.cookie = `userToken=${userToken}; expires=${expirationDate.toUTCString()}; path=/`;
            console.log(userToken);
            console.log(data);
            //window.location.href = "index.html";
          });
        }
      })
      .catch((error) => {
        Message(error.message, message, "red");
      });
  });
