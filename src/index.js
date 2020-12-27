import './styles.css';
import debounce from 'lodash.debounce';
import setFullInfoTemplate from './template/temp.hbs';
import setBaseInfoTemplate from './template/temp2.hbs';
import '@pnotify/core/dist/PNotify.css';
import * as PNotify from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';

const countriesDataBaseUrl = 'https://restcountries.eu/rest/v2/name/';
const itemsRef = document.querySelector('[class=result]');
const inputRef = document.querySelector('[class=input-field]');

function setMarkUp(url, event) {
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response;
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.length > 1 && data.length < 10) {
                return itemsRef.insertAdjacentHTML(
                    'beforeend',
                    setBaseInfoTemplate(data),
                );
            }
            if (data.length === 1) {
                return itemsRef.insertAdjacentHTML(
                    'beforeend',
                    setFullInfoTemplate(data),
                );
            } else {
                return PNotify.error({
                    stack: window.maxOpenWait,
                    text:
                        'To many maches found! Plese enter a more specific query!',
                    icon: true,
                    delay: 1500,
                });
            }
        })
        .catch(err => {
            console.log(err);
            event.target.value = '';
            PNotify.error({
                text: 'Incorect input! Please, try again!',
                icon: true,
                delay: 2000,
            });
        });
}

const debounceFn = debounce(event => {
    itemsRef.innerHTML = '';
    if (!event.target.value) {
        return;
    }
    let searchResponse = countriesDataBaseUrl + inputRef.value;
    setMarkUp(searchResponse, event);
}, 1000);

inputRef.addEventListener('input', debounceFn);
