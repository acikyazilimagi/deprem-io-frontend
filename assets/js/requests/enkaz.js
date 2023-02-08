const API_URL = "https://deprem-27jjydhzba-ew.a.run.app/";

var form = document.querySelector("#enkazForm");

form.onsubmit = function (e) {
    e.preventDefault();

    var formData = new FormData(form);
    
    fetch(API_URL + "yardim", {
        method: "POST",
        body: formData
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
    });
};