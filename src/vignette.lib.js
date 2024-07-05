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

export async function onChangeCountry(selectedCountry) {
    try {
        await fetchData(selectedCountry);
    } catch (error) {
        console.error('Error:', error);
    }
}

export function createCardsWrapper() {
    const wrapper = createElementWithClass('div', 'vignette-cards-wrapper');
    const selectWrapper = createElementWithClass('div', 'vignette-select-wrapper', wrapper);
    const cardsRow = createElementWithClass('div', 'vignette-cards-row', wrapper);
    const select = createCountrySelect(countries, onChangeCountry);
    selectWrapper.appendChild(select);
    return wrapper;
}

export async function fetchData(country = 'at') {
    try {
        const response = await fetch(
            `https://sandbox-api.vignette.id/public/products?country=${country}&type=vignette&currency=UAH`,
            {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer zpka_2e72513582f446a59e7df2997b7b4ee4_49a8220e',
                },
            },
        );
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        updateCards(data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export function updateCards(data) {
    const cardsRow = document.querySelector('.vignette-cards-row');
    cardsRow.innerHTML = ''; // Очистка існуючих карток
    data.result.forEach((product) => {
        const card = createCardElement(product.title);
        cardsRow.appendChild(card);
    });
}
