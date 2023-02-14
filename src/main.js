import Swal from 'sweetalert2';
import './style.css';
const srcBtn = document.querySelector('#src-btn');
const coinList = document.querySelector('.coin-list');
const coinTitle = document.querySelector('.coint-title');
const inputCoin = document.querySelector('#input-coin');

function CreateBoard(name, value) {
  const elements = document.createElement('li');
  elements.innerHTML = `${name} <span class="yellow">${value}</span>`;
  return elements;
}

function createCoins(coins, baseCoin) {
  coinTitle.innerHTML = `Valores referentes a 1 ${baseCoin}`;
  coinList.innerHTML = '';
  coins.forEach((coin) => {
    const element = CreateBoard(coin.name, coin.value);
    coinList.appendChild(element);
  });
}

function fetchExportApi(baseCoin) {
  return fetch(`https://api.exchangerate.host/latest?base=${baseCoin}`)
    .then((response) => response.json())
    .then((dados) => {
      if (dados.base !== baseCoin) {
        throw new Error('Moeda não existe');
      }

      return dados;
    });
}


srcBtn.addEventListener('click', (event) => {
  event.preventDefault();

  const input = inputCoin.value;
  const upperCaseInput = input.toUpperCase();

  if (!upperCaseInput) {
    Swal.fire({
      title: 'Erro',
      text: 'Você precisa digitar uma moeda!',
      icon: 'error',
    });
    return;
  }
  fetchExportApi(upperCaseInput)
    .then((data) => {
      const rates = Object.entries(data.rates);
      const ratesObjct = rates.map((rate) => ({
        name: rate[0],
        value: parseFloat(rate[1]).toFixed(2),
      }));
      createCoins(ratesObjct, data.base);
    })
    .catch((error) => {
      Swal.fire({
        title: 'Erro',
        text: error.message,
        icon: 'error',
      });
    });
});
