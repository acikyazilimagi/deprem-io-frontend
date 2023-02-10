//const API_URL = "https://deprem-27jjydhzba-ew.a.run.app/";
const API_URL = "https://deprem-27jjydhzba-ew.a.run.app/";

const filterButton = document.querySelector("#filter-button");
const filterHelpType = document.querySelector("#filter-help-type");
const filterHelpQ = document.querySelector("#filter-help-q");
const filterHelpStatus = document.querySelector("#filter-help-status");
const filterLocation = document.querySelector("#filter-help-location");
const filterDest = document.querySelector("#filter-help-dest");

const paginationPrevButton = document.querySelector("#pagination-prev");
const paginationNextButton = document.querySelector("#pagination-next");
const paginationCurrentPage = document.querySelector(
  "#pagination-current-page"
);
const paginationTotalPage = document.querySelector("#pagination-total-page");

function ready(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(function () {
  getRows();
});

filterButton.addEventListener("click", function (e) {
  e.preventDefault();

  getFilteredRows();
});

paginationNextButton.addEventListener("click", function (e) {
  e.preventDefault();

  var currentPage = parseInt(paginationCurrentPage.innerHTML);

  if (currentPage >= parseInt(paginationTotalPage.innerHTML)) {
    return;
  }

  getRows(currentPage + 1);
});

paginationPrevButton.addEventListener("click", function (e) {
  e.preventDefault();

  var currentPage = parseInt(paginationCurrentPage.innerHTML);

  if (currentPage <= 1) {
    return;
  }

  getRows(currentPage - 1);
});

function getRows(page, limit) {
  page = page || 1;
  limit = limit || 10;

  var totalPage = 0;
  var helpType = filterHelpType.value;

  // get items
  getData(API_URL + "yardimet", [
    { key: "page", value: page },
    { key: "limit", value: limit },
    { key: "yardimTipi", value: helpType },
  ])
    .then((items) => {
      // update total page value
      totalPage = items.totalPage;

      var listWrapper = document.querySelector(".list");

      // clear listWrapper html
      listWrapper.innerHTML = "";

      items.data.forEach(function (item) {
        listWrapper.innerHTML += getRowHtml(item);
      });
    })
    .finally(() => {
      // update pagination info in html
      paginationCurrentPage.innerHTML = page;
      paginationTotalPage.innerHTML = totalPage;
    });
}

function getFilteredRows(page, limit) {
  page = page || 1;
  limit = limit || 10;

  var totalPage = 0;
  var helpType = filterHelpType.value;
  var helpQ = filterHelpQ.value;
  var helpStatus = filterHelpStatus.value;
  var location = "";
  var dest = "";

  if (filterLocation) {
    location = filterLocation.value;
  }

  if (filterDest) {
    dest = filterDest.value;
  }

  console.log(dest);

  // get items
  getData(API_URL + "ara-yardimet/", [
    { key: "q", value: helpQ },
    { key: "yardimDurumu", value: helpStatus },
    { key: "yardimTipi", value: helpType },
    { key: "sehir", value: location },
    { key: "hedefSehir", value: dest },
  ])
    .then((items) => {
      console.log(items);
      // update total page value
      totalPage = items.totalPage;
      var listWrapper = document.querySelector(".list");
      // clear listWrapper html
      listWrapper.innerHTML = "";

      items.forEach(function (item) {
        listWrapper.innerHTML += getRowHtml(item);
      });
    })
    .finally(() => {
      // update pagination info in html
      paginationCurrentPage.innerHTML = page;
      paginationTotalPage.innerHTML = totalPage;
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

function getRowHtml(item) {
  var classColor;
  var durumMessage;
  if (item.yardimDurumu === "bekleniyor") {
    classColor = "status-ok";
    durumMessage = "Yardıma Hazır";
  } else if (item.yardimDurumu === "yolda") {
    classColor = "status-waiting";
  } else if (item.yardimDurumu === "yapildi") {
    classColor = "status-unknown";
    durumMessage = "Yardım Yapıldı";
  }

  return `<div class="list-item">
    <div class="list-row">
        <div class="list-col">
            <div class="list-col">
                <span class="status ${classColor}">
                    <i></i> ${
                      item.yardimTipi
                    } - <span class="emergency">${durumMessage}</span>
                </span>
            </div>
            <div class="list-col">
                <span >
                    ${item.adSoyad}
                </span>
            </div>
            <div class="list-col">
                <span >
                    ${item.telefon}
                </span>
            </div>
        </div>
        <div class="list-col btn-detail-wrap">
        <a href="../../../yardim-detay/detay.html?id=${
          item._id
        }&type=yardimet/" class="btn-detail">
        Detaya Git
       </a>
        </div>
    </div>
    <div class="list-row">
        <div class="list-col">
            <div class="list-col">
                <span class="icon-line">
                    <i class="icon icon-pin blue"></i>
                    ${item.adres} - ${item.adresTarifi}
                </span>
            </div>
            <div class="list-col">
                <span class="icon-line">
                    <i class="icon icon-alarm blue"></i>
                    ${parseTime(item.updatedAt)}
                </span>
            </div>
        </div>
    </div>
</div>`;
}
