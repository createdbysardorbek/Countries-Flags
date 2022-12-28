// ======================
// class for giving request to api and displaying some countries
class CountriesService {
    _urlBase = 'countries.json';

    getResource = async () => {
        let res = await fetch(this._urlBase)

        if (!res.ok) {
            throw new Error(`Quyidagi ${this._urlBase}da ${res.status} xatolik yuzaga keldi`)
        }
        return await res.json()
    }

    getSomeCountries = (count) => {
        return this.getResource().then((data) => {
            return data.slice(0, count)
        })
    }
}

// ======================
// Choosing parent element in html to add country cards

let wrapper = document.querySelector('.countries')

let countriesService = new CountriesService()

// ======================
// Loading

let loading = document.createElement("div")
loading.innerHTML = `
	<img src="img/loading.svg" alt="" />
`
loading.style.cssText = `
	display:flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100vh;
	background-color: #202C36;
`
document.body.prepend(loading)

// =====================
// Function displays given amount of countries

function getData() {
    countriesService.getSomeCountries(48).then(data => {
        data.forEach(elem => {
            renderTask(elem)
        });
    })
        .then(() => loading.style.display = 'none')
}

// ======================
// Adding country cards from received api

function renderTask(elem) {
    let { name, region, capital, population, flags } = elem
    wrapper.innerHTML += `
                <div class='item'>
                <div class='item__img'>
                <img src=${flags.png} alt=${name}>
                </div>
                 <div class='item__wrapper'>
                <div class='item__title'>
                    ${name}
                </div>
                <div class="item__popul">
                    <span>Population:</span> ${population ? some(population) : `not found`}
                </div>
                <div class="item__region">
                    <span>Region:</span> ${region}
                </div>
                <div class="item__capital">
                    <span>Capital:</span> ${capital ? capital : `not found`}
                </div>
                </div>
            </div>

        `
}

// ======================
// Making population numbers more readible

function some(num) {
    return String(num).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1,')
}

getData()

// =======================
// Choosing drop-down menu 

let filter = document.querySelector('.filter');
let menu = document.querySelector('.menu');

// =======================
// Giving client events to drop-down menus 

filter.addEventListener('mouseover', () => menu.style.display = 'block');
filter.addEventListener('mouseout', () => menu.style.display = 'none');

menu.addEventListener('click', (e) => {
    let region = e.target.innerHTML;
    countriesService.getResource().then(data => {
        let reg = data.filter(elem => elem.region === region);
        return reg;
    }).then(res => {
        wrapper.innerHTML = '';
        res.forEach(elem => {
            renderTask(elem)
        })
    })
})

// =======================
// Choosing searching input

let inpValue = document.querySelector('#search');

// =======================
// Function displays searched country

function showSingleCountry(e) {
    e.preventDefault();
    let names = inpValue.value;
    countriesService.getResource().then(data => {
        let finder = data.find(elem => elem.name.includes(names));
        return finder;
    }).then((data) => {
        wrapper.innerHTML = '';
        renderTask(data);
        inpValue.value = '';
    }).catch(() => {
        wrapper.innerHTML = '';
        wrapper.innerHTML = `<h2 style="color: white;">Country not found.</h2>`
    })
}

// =======================
// Choosing form and giving client event 

document.querySelector('form').addEventListener('submit', showSingleCountry);