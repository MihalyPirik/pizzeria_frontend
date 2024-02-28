import { createApiEndpoint, Message } from './functions.js';

const INDEX_PAGE_URL = 'index.html';

const loginApiUrl = createApiEndpoint("login");
let userToken;

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.querySelector("#InputEmail").value.trim();
    const password = document.querySelector("#InputPassword").value.trim();
    const message = document.querySelector("#error");

    const formData = {
      email: email,
      password: password,
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Message("Kérem, adjon meg egy érvényes e-mail címet!", message, "red");
      return;
    }

    if (password === "" || password === null) {
      Message("A jelszó megadása kötelező!", message, "red");
      return;
    }

    if (password.length < 8) {
      Message('A jelszónak legalább 8 karakter hosszúnak kell lennie!', message, 'red');
      return;
    }

    fetch(loginApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        return response.json().then((data) => {
          if (!response.ok) {
            const errorMessage = data.message || "Hiba történt a bejelentkezés során!";
            Message(errorMessage, message, "red");
          } else {
            Message("Sikeres bejelentkezés!", message, "green");
            userToken = data.token;
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30);
            document.cookie = `userToken=${userToken}; expires=${expirationDate.toUTCString()}; path=/`;
            window.location.href = INDEX_PAGE_URL;
          }
        });
      })
      .catch((error) => {
        Message(error.message, message, "red");
      });
  });