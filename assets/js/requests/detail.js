const API_URL = "https://deprem-27jjydhzba-ew.a.run.app/";

const title = document.getElementById("title");
const status = document.getElementById("status");
const adSoyad = document.getElementById("adSoyad");
const email = document.getElementById("email");
const tel = document.getElementById("telefon");
const kisiSayisi = document
  .getElementById("kisiSayisi")
  .getElementsByTagName("input")[0];
const adres = document.getElementById("adres");
const adresTarifi = document.getElementById("adresTarifi");
const googleMapLink = document
  .getElementById("googleMap")
  .getElementsByTagName("a")[0];
const aciklama = document
  .getElementById("aciklama")
  .getElementsByTagName("textarea")[0];
const tweeterLink = document
  .getElementById("tweetLink")
  .getElementsByTagName("input")[0];

const sehir = document.getElementById("sehir");
const hedefSehir = document.getElementById("hedefSehir");

const updatedDate = document.getElementById("updatedDate");
const createdDate = document.getElementById("createdDate");
const yardimKayitId = document.getElementById("yardimKayitId");

const alert = "rgba(255, 181, 70, 1)";
const blue = "rgba(71, 101, 255, 1)";
const red = "rgb(255, 87, 97)";

function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(getItem);

function getItem() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let type = params.type;
  const id = params.id;
  if (type === "yardimet/") {
    document.getElementById("kisiSayisi").style.display = "none";
    document.getElementById("googleMap").style.display = "none";
    document
      .getElementsByClassName("acilDurumRadioWrapper")[0]
      .setAttribute("style", "display:none !important");
    document.getElementById("aciklama").style.display = "none";
    document
      .getElementsByClassName("arabaDurum")[0]
      .setAttribute("style", "display:none !important");
    document.getElementById("tweetLink").style.display = "none";
  }

  // get items
  getData(API_URL + type + id).then((item) => {
    const yardimKayitlari = item.yardimKaydi;
    item = item.results;
    const acilDurum = item.acilDurum;
    const yardimDurum = item.yardimDurumu;

    status.getElementsByTagName("p")[0].innerHTML =
      yardimDurum + " - " + acilDurum;
    if (acilDurum === "kritik") {
      document.getElementById("kritik").checked = true;
      document.getElementById("orta").disabled = true;
      document.getElementById("normal").disabled = true;

      status.setAttribute("style", `border: 1px solid ${red}`);
      status.getElementsByTagName("span")[0].style.backgroundColor = red;
      status.getElementsByTagName("p")[0].style.color = red;
    } else if (acilDurum === "orta") {
      document.getElementById("kritik").disabled = true;
      document.getElementById("orta").checked = true;
      document.getElementById("normal").disabled = true;

      status.setAttribute("style", `border: 1px solid ${alert}`);
      status.getElementsByTagName("span")[0].style.backgroundColor = alert;
      status.getElementsByTagName("p")[0].style.color = alert;
    } else {
      document.getElementById("kritik").disabled = true;
      document.getElementById("orta").disabled = true;
      document.getElementById("normal").checked = true;

      status.setAttribute("style", `border: 1px solid ${blue}`);
      status.getElementsByTagName("span")[0].style.backgroundColor = blue;
      status.getElementsByTagName("p")[0].style.color = blue;
    }

    if (item.yardimTipi === "yolcuTasima") {
      document.getElementById("addressField").style.display = "none";
      document.getElementById("cityField").style.display = "grid";
    }

    title.innerHTML = item.yardimTipi + " Yardımı Detay";
    adSoyad.value = item.adSoyad ? item.adSoyad : "";
    email.value = item.email ? item.email : "";
    tel.value = item.telefon ? item.telefon : "";
    kisiSayisi.value = item.kisiSayisi ? item.kisiSayisi : "";
    adres.value = item.adres ? item.adres : "";
    adresTarifi.value = item.adresTarifi ? item.adresTarifi : "";
    googleMapLink.href = item.googleMapLink ? item.googleMapLink : "";
    aciklama.value = item.aciklama ? item.aciklama : "";
    tweeterLink.value = item.tweetLink ? item.tweetLink : "";

    if (sehir) {
      sehir.value = item.sehir ? item.sehir : "";
      hedefSehir.value = item.hedefSehir ? item.hedefSehir : "";
    }

    updatedDate.innerHTML = "Son Güncelleme " + parseTime(item.updatedAt);
    createdDate.innerHTML = "Oluşturulma Tarihi " + parseTime(item.createdAt);
    yardimKayitId.value = id;

    var listWrapper = document.querySelector(".list");

    // clear listWrapper html
    listWrapper.innerHTML = "";

    yardimKayitlari.forEach(function (el) {
      listWrapper.innerHTML += getRowHtml(el);
    });
  });
}

function getData(url, params) {
  if (params) {
    url += "?";
    params.forEach((param) => {
      url += `${param.key}=${param.value}&`;
    });
  }

  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function parseTime(input) {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, "0");

  const minutesAgo = Math.floor((new Date() - date) / 1000 / 60);
  const daysAgo = Math.floor(minutesAgo / 60 / 24);

  if (minutesAgo < 60) {
    if (minutesAgo < 1) {
      return "az önce";
    }
    return `${minutesAgo} dakika önce`;
  } else if (daysAgo < 1) {
    return `${hour}:${minute}`;
  }

  return `${day}.${month}.${year} ${hour}:${minute}`;
}

function getRowHtml(item) {
  return `<div class="list-item">
    <div class="list-row">
        <div class="list-col">
           
            <div class="list-col">
                <span >
                    ${item.adSoyad}
                </span>
            </div>
            <div class="list-col">
                <span  >
                   ${item.email} 
                </span>
           </div>
            
            <div class="list-col">
                <span >
                    ${item.telefon}
                </span>
            </div>
        </div>
        
    </div>
    <div class="list-row">
        <div class="list-col">
            <div class="list-col">
               
                <span class="icon-line">
                ${item.aciklama}
                </span>
            </div>
          
        </div>
    </div>
</div>`;
}
