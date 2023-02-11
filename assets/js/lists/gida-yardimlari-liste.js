const API_URL = "https://deprem-27jjydhzba-ew.a.run.app/";

const filterButton = document.querySelector("#filter-button");
const filterTargetCity = document.querySelector("#filter-hedef-sehir");

const paginationPrevButton = document.querySelector("#pagination-prev");
const paginationNextButton = document.querySelector("#pagination-next");
const paginationCurrentPage = document.querySelector("#pagination-current-page");
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

    getRows();
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
    var targetCity = filterTargetCity.value;

    // get items
    getData(API_URL + "yardimet", [
        { key: "page", value: page },
        { key: "limit", value: limit },
        { key: "yardimTipi", value: "gidaSaglama" },
        { key: "hedefSehir", value: targetCity },
    ]).then((items) => {

        // update total page value
        totalPage = items.totalPage

        var listWrapper = document.querySelector(".list");

        // clear listWrapper html
        listWrapper.innerHTML = "";

        items.data.forEach(function (item) {
            listWrapper.innerHTML += getRowHtml(item);
        });
    }
    ).finally(() => {
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
    return `<div class="list-item">
    <div class="list-row">
        <div class="list-col">
            <div class="list-col">
                <span class="status status-waiting" style="text-transform: capitalize;">
                    <i></i>Yardım ${item.yardimDurumu} 
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
            <a href="#" class="btn-detail">
                Detaya Git
            </a>
        </div>
    </div>
    <div class="list-row">
        <div class="list-col">
            <div class="list-col">
                <span class="icon-line">
                    <i class="icon icon-pin blue"></i>
                    ${item.hedefSehir} - ${item.fields.adres}
                </span>
                <span class="icon-line">
                <svg style="margin-right: 4px;" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill='rgba(71, 101, 255)' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>               
                ${item.aciklama}
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