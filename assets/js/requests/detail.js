const title = document.getElementById('title');
const status = document.getElementById('status');
const adSoyad = document.getElementById('adSoyad');
const email = document.getElementById('email');
const tel = document.getElementById('telefon');
const kisiSayisi = document.getElementById('kisiSayisi').getElementsByTagName('input')[0];
const adres = document.getElementById('adres');
const adresTarifi = document.getElementById('adresTarifi').getElementsByTagName('input')[0];
const googleMapsLink = document.querySelector('#google-maps-link');
const tweeterLink = document.getElementById('tweetLink').getElementsByTagName('a')[0];
const googleMapLink = document.getElementById('googleMapLink').getElementsByTagName('a')[0];

const sehir = document.getElementById('sehir');
const hedefSehir = document.getElementById('hedefSehir').getElementsByTagName('input')[0];

const updatedDate = document.getElementById('updatedDate');
const createdDate = document.getElementById('createdDate');
const yardimKayitId = document.getElementById('yardimKayitId');

let type = '';

const alert = 'rgba(255, 181, 70, 1)';
const blue = 'rgba(71, 101, 255, 1)';
const red = 'rgb(255, 87, 97)';

function ready(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(getItem);

function getItem() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let type = params.type;
  const id = params.id;
  if (type === 'yardimet/') {
    document.getElementById('kisiSayisi').style.display = 'none';
    document.getElementById('googleMap').style.display = 'none';
    document.getElementsByClassName('acilDurumRadioWrapper')[0].setAttribute('style', 'display:none !important');
    document.getElementById('adresTarifi').style.display = 'none';
    document.getElementsByClassName('arabaDurum')[0]?.setAttribute('style', 'display:none !important');
    document.getElementById('tweetLink').style.display = 'none';
  }

  // get items
  getData(API_URL + type + id).then((item) => {
    const yardimKayitlari = item.yardimKaydi;
    item = item.results;
    console.log(item);

    const acilDurum = item.acilDurum;
    const yardimDurum = item.yardimDurumu;
    const aracDurum = item.fields.aracDurumu ? item.fields.aracDurumu : '';
    const fizikDurum = item.fizikiDurum ? item.fizikiDurum : '';
    const aciklama = item.aciklama || '';

    if (aracDurum) {
      var element = document.getElementById('aracDurum');
      element.classList.remove('cond-render');
      if (aracDurum === 'var') {
        document.getElementById('aracDurumVar').checked = true;
      } else if (aracDurum === 'yok') {
        document.getElementById('aracDurumYok').checked = true;
      }
    }

    if (fizikDurum) {
      document.getElementById('aciklamaValue').value = fizikDurum;
    }

    if (aciklama) {
      document.getElementById('aciklamaValue').value = aciklama;
    }

    status.getElementsByTagName('p')[0].innerHTML = yardimDurum + ' - ' + acilDurum;

    status.getElementsByTagName('p')[0].innerHTML = yardimDurum + ' - ' + acilDurum;
    if (acilDurum === 'kritik') {
      document.getElementById('kritik').checked = true;
      document.getElementById('orta').disabled = true;
      document.getElementById('normal').disabled = true;

      status.setAttribute('style', `border: 1px solid ${red}`);
      status.getElementsByTagName('span')[0].style.backgroundColor = red;
      status.getElementsByTagName('p')[0].style.color = red;
    } else if (acilDurum === 'orta') {
      document.getElementById('kritik').disabled = true;
      document.getElementById('orta').checked = true;
      document.getElementById('normal').disabled = true;

      status.setAttribute('style', `border: 1px solid ${alert}`);
      status.getElementsByTagName('span')[0].style.backgroundColor = alert;
      status.getElementsByTagName('p')[0].style.color = alert;
    } else {
      document.getElementById('kritik').disabled = true;
      document.getElementById('orta').disabled = true;
      document.getElementById('normal').checked = true;

      status.setAttribute('style', `border: 1px solid ${blue}`);
      status.getElementsByTagName('span')[0].style.backgroundColor = blue;
      status.getElementsByTagName('p')[0].style.color = blue;
    }
    if (item.yardimTipi === 'yolcuTasima') {
      document.getElementById('addressField').style.display = 'none';
      document.getElementById('cityField').style.display = 'grid';
    } else if (item.yardimTipi === 'isMakinasi' || item.yardimTipi === 'konaklama') {
      document.getElementById('addressField').style.display = 'none';
      const cityField = document.getElementById('cityField');
      document.getElementById('hedefSehir').style.display = 'none';
      cityField.classList.remove('form-col-2');
      cityField.style.display = 'grid';
    }

    title.innerHTML = item.yardimTipi + ' Yardımı Detay';
    type = item.yardimTipi;
    adSoyad.value = item.adSoyad ? item.adSoyad : '';
    email.value = item.email ? item.email : '';
    tel.value = item.telefon ? item.telefon : '';
    kisiSayisi.value = item.kisiSayisi ? item.kisiSayisi : '';
    adres.value = item.adres ? item.adres : '';
    adresTarifi.value = item.adresTarifi ? item.adresTarifi : '';
    tweeterLink.href = item.tweetLink ? item.tweetLink : '';
    tweeterLink.innerText = item.tweetLink ? item.tweetLink : '';
    googleMapLink.href = item.googleMapLink ? item.googleMapLink : '';
    googleMapLink.innerText = item.googleMapLink ? item.googleMapLink : '';

    googleMapsLink.setAttribute('href', item.adres ? `https://www.google.com/maps?q=${item.adres}` : '');

    if (sehir) {
      sehir.value = item.sehir ? item.sehir : '';
      hedefSehir.value = item.hedefSehir ? item.hedefSehir : '';
    }

    updatedDate.innerHTML = 'Son Güncelleme ' + parseTime(item.updatedAt);
    createdDate.innerHTML = 'Oluşturulma Tarihi ' + parseTime(item.createdAt);
    yardimKayitId.value = id;

    var listWrapper = document.querySelector('.list');

    // clear listWrapper html
    listWrapper.innerHTML = '';

    let endpoint = '';
    if (type == 'gidaSaglama' || type === 'yolcuTasima' || type === 'isMakinasi' || type === 'konaklama') {
      endpoint = 'ekleYardimEtKaydi';
      document.getElementById('yardimObjectForm').classList.add('cond-render');
      document.getElementById('yardimEtObjectForm').classList.remove('cond-render');
    } else {
      endpoint = 'ekleYardimKaydi';
      document.getElementById('yardimObjectForm').classList.remove('cond-render');
      document.getElementById('yardimEtObjectForm').classList.add('cond-render');
    }

    var form = document.getElementById('form');
    form.onsubmit = (event) => submission(event, endpoint, window.location.href);

    yardimKayitlari.forEach(function (el) {
      listWrapper.innerHTML += getRowHtml(el);
    });
  });
}

async function getData(url, params) {
  if (params) {
    url += '?';
    params.forEach((param) => {
      url += `${param.key}=${param.value}&`;
    });
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

function parseTime(input) {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, '0');

  const minutesAgo = Math.floor((new Date() - date) / 1000 / 60);
  const daysAgo = Math.floor(minutesAgo / 60 / 24);

  if (minutesAgo < 60) {
    if (minutesAgo < 1) {
      return 'az önce';
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
                <span  >
                   ${item.sonDurum} 
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
