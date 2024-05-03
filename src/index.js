import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchEl: document.querySelector('#search-box'),
  countryInfo: document.querySelector('.country-info'),
  countryList: document.querySelector('.country-list'),
};

// const country_list = document.querySelector('.country-list');
// funkcja, która czyści elementy w html
const clearMarkup = ref => (ref.innerHTML = '');

const inputHandler = e => {
  // metoda trim pozbywa się znaków biłaych, tabulatorów, itd., znaków które mogłyby przeszkodzić w wyszukiwaniu danych
  const textInput = e.target.value.trim();
  // jeżeli tekstInput jest pusty, to wyczyć ul i div
  if (!textInput) {
    clearMarkup(refs.countryList);
    clearMarkup(refs.countryInfo);
    return;
  }
  // wysyłam fetchCountries - przeszukiwanie krajów, w odpowiedzi otrzymam obiekt lub tablicę obiektów
  fetchCountries(textInput)
    .then(data => {
      console.log(data);
      // jeżeli dane mają więcej niż 10 elementów, to dostaję odpowiedź
      if (data.length > 10) {
        // metoda do otrzymania boxa z informacją
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderMarkup(data);
    })
    .catch(err => {
      clearMarkup(refs.countryList);
      clearMarkup(refs.countryInfo);
      Notify.failure('Oops..., there is no country with that name');
    });
};

const renderMarkup = data => {
  // jeżeli długość podanych danych jest równa 1 to wyświetl dane dla wskazanego kraju zgodnie z funkcją createInfoMarkup
  if (data.length === 1) {
    clearMarkup(refs.countryList);
    const markupInfo = createInfoMarkup(data);
    refs.countryInfo.innerHTML = markupInfo;
  } else {
    clearMarkup(refs.countryInfo);
    const markupList = createListMarkup(data);
    refs.countryList.innerHTML = markupList;
  }
};
// funkcja, która przygotuje html i wyświetli listę
const createListMarkup = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
};

// funkcja, która wyświetli pojedynczy kraj z pełnymi informacjami
const createInfoMarkup = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<img src="${flags.png}" alt="${name.official}" width="200" height="100">
      <h1>${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};

// nadanie opóźnienia
refs.searchEl.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));
