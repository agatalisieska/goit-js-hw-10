// przeszukanie na podstawie wpisanej nazwy
export const fetchCountries = name => {
  const BASE_URL = 'https://restcountries.com/v3.1/name/';
  const properties = 'fields=name,capital,population,flags,languages';

  // odwołanie do BASE_URL, podanie nazwy po której chcemy przeszukać, przekazujemy odpowiedź
  return fetch(`${BASE_URL}${name}?${properties}`).then(response => {
    // jeśli nie mamy odpowiedzi 200, to dostajemy ERROR
    console.log(!response.ok);
    if (!response.ok) {
      throw new Error(response.status);
    }
    // w innym wypadku zwrócenie danych w postaci obiektu wyciągniętego z JSON
    return response.json();
  });
};
