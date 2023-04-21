import './index.scss';
import { fetchData } from './currencyconverter/fetchData';
import { Currency } from './currencyconverter/Currency';
import { Rate } from './currencyconverter/rate';

const currencySelect = document.getElementById('currencySelect') as HTMLSelectElement;
const amountInput = document.getElementById('amountInput') as HTMLInputElement;
const resultOutput = document.getElementById('resultOutput') as HTMLInputElement;
const ConverterState = {
    scale: 1,
    rate: 1,
    amout: 0,
};


fetchData<Currency[]>('https:www.nbrb.by/api/exrates/currencies')
    // ('https://www.nbrb.by/api/exrates/rates/USD', {parammode: 2})
    .then(
        (currencies) => {
            const fragment = document.createDocumentFragment();

            for (const { Cur_Abbreviation, Cur_Name_Eng } of currencies) {
                const optionElement = document.createElement('option');

                optionElement.value = Cur_Abbreviation;
                optionElement.textContent = `(${Cur_Abbreviation}) ${Cur_Name_Eng}`;
                fragment.appendChild(optionElement);
            }


            currencySelect?.replaceChildren(fragment);
            currencySelect.insertAdjacentHTML('afterbegin', '<option selected> Choose currency </option>');
            currencySelect.disabled = false;

            // console.info(rate);
        },
        (error) => console.error(error)
    );

currencySelect.addEventListener('change', () => {
    currencySelect.firstElementChild?.remove();

}, { once: true });

currencySelect.addEventListener('change', async () => {
    const currensyCode = currencySelect.value;
    const { Cur_Scale, Cur_OfficialRate } = await fetchData<Rate>(
        `https://www.nbrb.by/api/exrates/rates/${currensyCode}`,
        { parammode: 2 },
    );
    ConverterState.scale = Cur_Scale;
    ConverterState.rate = Cur_OfficialRate;

    calculateResult();

});

amountInput.addEventListener('input', () => {
    ConverterState.amout = Number(amountInput.value) || 0;

    calculateResult();
});

function calculateResult(): void {
    const { scale, rate, amout } = ConverterState;

    resultOutput.textContent = String(amout / rate * scale);
}






