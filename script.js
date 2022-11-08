const buttons = document.querySelector('.buttons');
const display = document.querySelector('.display');
const nav = document.querySelector('.nav');
const episodeContainer = document.querySelector('.episodeContainer');
const characterContainer = document.querySelector('.characterContainer');
const charactersList = document.querySelector('.charactersList');
const more = document.querySelector('.more');

let url = 'https://rickandmortyapi.com/api/episode';
let urlCharacters = 'https://rickandmortyapi.com/api/character';
let add = 10;

async function getData(url, arr) {
  let res = await fetch(url);
  let data = await res.json();
  arr.push(...data.results);
  return arr;
}

async function getAllCharacters() {
  let allCharacters = [];
  for (let i = 1; i <= 42; i++) {
    allCharacters = await getData(`${urlCharacters}?page=${i}`, allCharacters);
  }
  return allCharacters;
}

async function getAllSeries() {
  let allSeries = [];
  for (let i = 1; i <= 3; i++) {
    allSeries = await getData(`${url}?page=${i}`, allSeries);
  }
  return allSeries;
}

async function getAllSeasons(allSeries) {
  let allSeasons = [];
  for (let i = 1; i <= 5; i++) {
    allSeasons.push([
      ...allSeries.filter((series) => series.episode.includes(`S0${i}`)),
    ]);
  }
  return allSeasons;
}

async function createSeasonButton(arr) {
  let makeUp = arr
    .map(
      (btn, key) => `
          <button class="btn button--active">SEASON ${key + 1}</button>
      `
    )
    .join('');
  buttons.insertAdjacentHTML('beforeEnd', makeUp);
}

async function createInfoSeason(season) {
  let makeUp = `
      <tr>
          <td>Серия</td>
          <td>Название</td>
          <td>Дата выхода</td>
      </tr>
      ${season
        .map(
          (series) => `
      <tr>
          <td>${series.episode}</td>
          <td>${series.name}</td>
          <td>${series.air_date}</td>
      </tr>
      `
        )
        .join('')}
  `;
  display.innerHTML = makeUp;
}

async function createInfoCharacters(characters) {
  let makeUp = characters
    .map(
      (character, key) => `
      <div class ='card' data-item=${key}>
        <h3>${character.name}</h3>
        <img class="cardImg" src = ${character.image} />
        <p ${
          character.status === 'unknown'
            ? 'class="unknown"'
            : character.status === 'Alive'
            ? 'class="alive"'
            : 'class="dead"'
        }>${character.status}</p>
      </div>
      `
    )
    .join('');
  charactersList.innerHTML = makeUp;
}
async function app() {
  let series = await getAllSeries();
  let seasons = await getAllSeasons(series);
  let characters = await getAllCharacters();
  createSeasonButton(seasons);
  createInfoCharacters(characters.slice(0, 10));

  let buttonSeason = document.querySelectorAll('.btn');

  more.addEventListener('click', function () {
    if (add <= 826) {
      add += 10;
      createInfoCharacters(characters.slice(0, add));
    }
  });

  nav.addEventListener('click', function (e) {
    buttonSeason.forEach((b) => b.classList.remove('button--active'));
    if (e.target.textContent === 'Episodes') {
      episodeContainer.classList.toggle('container--active');
      display.innerHTML = '';
    }
    if (e.target.textContent === 'Characters') {
      characterContainer.classList.toggle('container--active');
    }
  });

  buttons.addEventListener('click', function (e) {
    let btn = e.target.closest('.btn');
    if (!btn) return;
    buttonSeason.forEach((b) => b.classList.remove('button--active'));
    switch (btn.textContent) {
      case 'SEASON 1':
        createInfoSeason(seasons[0]);
        btn.classList.add('button--active');
        break;
      case 'SEASON 2':
        createInfoSeason(seasons[1]);
        btn.classList.add('button--active');
        break;
      case 'SEASON 3':
        createInfoSeason(seasons[2]);
        btn.classList.add('button--active');
        break;
      case 'SEASON 4':
        createInfoSeason(seasons[3]);
        btn.classList.add('button--active');
        break;
      case 'SEASON 5':
        createInfoSeason(seasons[4]);
        btn.classList.add('button--active');
        break;
      default:
        btn.classList.remove('button--active');
        break;
    }
  });
}

app();
