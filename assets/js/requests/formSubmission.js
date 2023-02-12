var API_URL = 'https://api.deprem.io/';

function submission(event, param , redirect) {
  var formData = new FormData(form);
  var xhr = new XMLHttpRequest();
  //open the request
  xhr.open('POST', API_URL + param);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // prepare the data
  const postData = Object.fromEntries(formData);
  postData.yedekTelefonlar = [];
  Object.keys(postData).forEach((key) => {
    if (key.includes('yedekTelefon_')) {
      postData.yedekTelefonlar.push(postData[key]);
      delete postData[key];
    }
  });

  //send the form data
  xhr.send(JSON.stringify(postData));

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      var status = xhr.status;
      var responseBody = JSON.parse(xhr.responseText) || {};

      // The request has been completed successfully
      if (status === 0 || (status >= 200 && status < 400)) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: responseBody.message || 'Talebiniz başarıyla alındı',
          showConfirmButton: false,
          timer: 2500,
        }).then(function () {
          window.location.href = redirect ? redirect : '/';
        });

        form.reset();
      } else {
        Swal.fire({
          title: 'Hata!',
          text: responseBody.error || 'Hata Oluştu Tekrar deneyiniz !',
          icon: 'error',
          confirmButtonText: 'Tamam',
        });
      }
    }
  };

  return false;
};

function addExtraPhone() {
  ++extraPhoneCount;
  const lnkEl = document.getElementById('ekTelefonLinki');

  if (extraPhoneCount === 3) {
    lnkEl.style.display = 'none';
  } else if (extraPhoneCount > 3) {
    return;
  }

  const div = document.createElement('div');
  const inputId = 'yedekTelefon_' + extraPhoneCount;
  div.className = 'form-col';
  div.innerHTML =
    '<label for="' +
    inputId +
    '">Telefon (' +
    (extraPhoneCount + 1) +
    '):</label>' +
    '<input type="tel" class="form-control" id="' +
    inputId +
    '" name="' +
    inputId +
    '" placeholder="Telefon">';
  document.getElementById('yedekTelefonlar').insertBefore(div, lnkEl);
  document.getElementById(inputId).focus();
}
