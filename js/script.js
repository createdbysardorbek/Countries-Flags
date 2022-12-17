class CountriesService {
    _urlBase = 'https://restcountries.com/v2/all?fields=name,capital,region,population,flags';

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

let wrapper = document.querySelector('.countries')

let countriesService = new CountriesService()

function getData() {
    countriesService.getSomeCountries(48).then(data => {
        data.forEach(elem => {
            renderTask(elem)
        });
    })
}

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

function some(num) {
    return String(num).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1,')
}

getData()

// Filter 

let filter = document.querySelector('.filter');
let menu = document.querySelector('.menu');

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


