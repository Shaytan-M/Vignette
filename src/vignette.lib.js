const countries = [
    { iso: 'at', name: 'Austria' },
    { iso: 'ch', name: 'Switzerland' },
    { iso: 'si', name: 'Slovenia' },
    { iso: 'hu', name: 'Hungary' },
    { iso: 'sk', name: 'Slovakia' },
    { iso: 'cz', name: 'Czechia' },
    { iso: 'ro', name: 'Romania' },
    { iso: 'bg', name: 'Bulgaria' },
];

function createElementWithClass(element, classElement = '', appendIn = false) {
    const elem = document.createElement(element);
    elem.className = classElement;
    if (appendIn) {
        return appendIn.appendChild(elem);
    } else {
        return elem;
    }
}

export function createCardElement(title, description) {
    const card = createElementWithClass('div', 'vignette-cards-item');

    const cardTitle = createElementWithClass('h3', '', card);
    cardTitle.textContent = title;

    const cardDescription = createElementWithClass('p', '', card);
    cardDescription.textContent = description;

    return card;
}

export function createCountrySelect(countries, onChangeCallback) {
    const select = document.createElement('select');

    countries.forEach((country) => {
        const option = document.createElement('option');
        option.value = country.iso;
        option.textContent = country.name;
        select.appendChild(option);
    });

    select.addEventListener('change', (event) => {
        const selectedCountry = event.target.value;
        onChangeCallback(selectedCountry);
    });

    return select;
}

export function createCardsWrapper(onChangeCallback) {
    const wrapper = createElementWithClass('div', 'vignette-cards-wrapper');
    const selectWrapper = createElementWithClass('div', 'vignette-select-wrapper', wrapper);
    const cardsRow = createElementWithClass('div', 'vignette-cards-row', wrapper);
    const select = createCountrySelect(countries, onChangeCallback);
    selectWrapper.appendChild(select);
    return wrapper;
}

export async function fetchData(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer zpka_2e72513582f446a59e7df2997b7b4ee4_49a8220e',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export function updateCards(data) {
    const cardsRow = document.querySelector('.vignette-cards-row');
    cardsRow.innerHTML = ''; // Очистка існуючих карток
    data.result.forEach((product, index) => {
        const card = createCardElement(`Product ${index + 1}`, product.name);
        cardsRow.appendChild(card);
    });
}
