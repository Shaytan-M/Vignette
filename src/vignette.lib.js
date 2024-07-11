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
const carTypes = [
    {
        name: 'Car',
        type: '2a',
    },
    {
        name: 'Motorcycle',
        type: '1m',
    },
    {
        name: 'Van',
        type: '2b',
    },
];
const order = {
    terms_and_privacy_accepted: true,
    order_has_been_paid: true,
    email: 'user@example.com',
    user: [
        {
            email: 'user@example.com',
            user_name: 'John Smith',
            passport_number: 'FP123452',
        },
    ],
    cars: [
        {
            country: 'ua',
            plate: 'AA4544AA',
            vin_code: 'VWT045FD9812VB341',
        },
    ],
    products: [
        {
            custom_id: '',
            name: '',
            start_date: 0,
            period: 0,
        },
    ],
    interchange_fee: {
        amount: 0.33,
        currency: 'EUR',
    },
};
const select = {
    country: {},
};
const active = {
    country: {},
};

// Create Function

function createElementWithClass(
    element,
    classElement = '',
    appendIn = false,
    productInfo,
    eventClick,
) {
    const elem = document.createElement(element);
    elem.className = classElement;
    if (eventClick) {
        elem.addEventListener('click', (event) => {
            eventClick(productInfo, event);
        });
    }
    if (appendIn) {
        return appendIn.appendChild(elem);
    } else {
        return elem;
    }
}

export function createCountryBlock(countries, appendIn) {
    countries.forEach((country) => {
        const countryBlock = createElementWithClass(
            'div',
            'countryBlock',
            appendIn,
            country,
            onChangeCountry,
        );
        countryBlock.textContent = country.name;
    });
    return select;
}

export function createCarTypes(appendIn) {
    const carTypesWrapper = createElementWithClass('div', 'vignette-car-types-wrapper');
    carTypes.forEach((car) => {
        const card = createElementWithClass('div', 'vignette-cards-item');
        const cardTitle = createElementWithClass('h2', '', card);
        const button = createElementWithClass('div', 'btn', card, car, createPriceElements);
        cardTitle.textContent = car.name;
        button.textContent = 'Select';
        carTypesWrapper.appendChild(card);
    });
    appendIn.appendChild(carTypesWrapper);
}
export async function createPriceElements(productInfo) {
    let prices = Object.keys(productInfo.price);
    const priceRow = document.querySelector('.vignette-price-row');
    priceRow.innerHTML = ''; // Очистка існуючих карток цін
    selectProductType(productInfo);
    prices.forEach((key) => {
        const obj = productInfo.price[key];
        obj.days = parseFloat(key);
        const priceItem = createElementWithClass(
            'div',
            'vignette-price-item',
            priceRow,
            obj,
            selectPrice,
        );
        priceItem.textContent = `${key}Days - ${obj.total_price + obj.currency}`;
    });
}

// Main Create
export function createCardsWrapper() {
    const section = createElementWithClass('div', 'vignette-section');
    createElementWithClass('h2', 'vignette-line', section).textContent = 'Choose country';
    const selectWrapper = createElementWithClass('div', 'vignette-select-wrapper', section);
    createElementWithClass('h2', 'vignette-line', section).textContent =
        'Information about the car';
    const cardsRow = createElementWithClass('div', 'vignette-car-info-row', section);
    const input = createElementWithClass('input', 'vignette-input-car-number', section);
    input.type = 'text';
    input.placeholder = 'Number of the car';
    const price = createElementWithClass('div', 'vignette-price-row', section);
    const buyRow = createElementWithClass('div', 'vignette-buy-row', section);
    const buyButton = createElementWithClass(
        'div',
        'vignette-buy-btn btn',
        buyRow,
        order,
        createOrder,
    );
    buyButton.textContent = 'Buy';
    createCountryBlock(countries, selectWrapper);
    createCarTypes(cardsRow);
    return section;
}

// Event Function
function selectProductType(product) {
    order.products[0].custom_id = self.crypto.randomUUID();
    order.products[0].name = product.name;
    order.products[0].start_date = Math.floor(Date.now() / 1000);
}
export async function selectPrice(price, event) {
    order.products[0].period = price.days;
    order.interchange_fee.amount = price.total_price;
    order.interchange_fee.currency = price.currency;
    document.querySelectorAll('.vignette-price-item').forEach((element) => {
        element.classList.remove('active');
    });
    event.target.classList.add('active');
}

export async function onChangeCountry(selectedCountry, event) {
    try {
        document.querySelectorAll('.countryBlock').forEach((element) => {
            element.classList.remove('active');
        });
        event.target.classList.add('active');
        await fetchData(selectedCountry.iso);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Api

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
async function createOrder(order) {
    console.log(order);
    try {
        const response = await fetch(`https://sandbox-api.vignette.id/public/orders`, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer zpka_2e72513582f446a59e7df2997b7b4ee4_49a8220e',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
export function updateCards(data) {
    const priceRow = document.querySelector('.vignette-price-row');
    priceRow.innerHTML = ''; // Очистка існуючих карток цін
}
