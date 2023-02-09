import { API_URL } from "../API";

var form = document.querySelector("#iletisimForm");

form.onsubmit = function (e) {
  e.preventDefault();

  var formData = new FormData(form);

  // convert formData to JSON
  var object = {};

  formData.forEach(function (value, key) {
    object[key] = value;
  });

  var json = JSON.stringify(object);

  fetch(API_URL + "iletisim", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: json,
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
};
