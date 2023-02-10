var API_URL = "https://deprem-27jjydhzba-ew.a.run.app/";

var form = document.getElementById("iletisimForm");
console.log(form)
form.onsubmit = function (event) {
  var xhr = new XMLHttpRequest();
  var formData = new FormData(form);
  //open the request
  xhr.open("POST", API_URL + "iletisim");
  xhr.setRequestHeader("Content-Type", "application/json");

  //send the form data
  xhr.send(JSON.stringify(Object.fromEntries(formData)));

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      var status = xhr.status;
      var responseBody = JSON.parse(xhr.responseText) || {};

      // The request has been completed successfully
      if (status === 0 || (status >= 200 && status < 400)) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: responseBody.message || "Mesajınız başarıyla gönderilmiştir!",
          showConfirmButton: false,
          timer: 2500,
        }).then(function () {
          window.location.href = "/";
        });

        form.reset();
      } else {
        Swal.fire({
          title: "Hata!",
          text: responseBody.error || "Hata Oluştu Tekrar deneyiniz !",
          icon: "error",
          confirmButtonText: "Tamam",
        });
      }
    }
  };
  return false;
};