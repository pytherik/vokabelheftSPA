import {urlActionSwitch} from "./config.js";
import {headerElements} from "./elements/headerElements.js";
import {Login} from './views/loginView.js';
import {loadStartPage} from './functions/loadStartPage.js'


function clearStorage() {
  let session = sessionStorage.getItem('register');
  if (session == null) {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('lang');
    localStorage.removeItem('date');
  }
  sessionStorage.setItem('register', 1);
}
window.addEventListener('load', clearStorage);

// window.onbeforeunload = function() {
//   localStorage.removeItem('username');
//   localStorage.removeItem('userId');
//   return '';
// }


if(!localStorage.getItem('username')){
  localStorage.setItem('username','');
  }

let username = localStorage.getItem('username');

if(!username) {
  headerElements('Anmeldung');
  const login = new Login();
  login.createUserInputs();
  const submit = document.getElementById('formSubmit');
  const nameInput = document.getElementById('name');
  const passInput = document.getElementById('password');
  submit.addEventListener('click', async(e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', nameInput.value);
      formData.append('password', passInput.value);
      formData.append('action', 'userLogin');
      const response = await fetch(urlActionSwitch,
        {
          body: formData,
          method: 'POST'
        });

      const user = await response.json();
      console.log(user);

      let date = new Date().toLocaleDateString();
      let time = new Date().toTimeString();

      date = date.split('.').reverse().join('-');
      time = time.split(' ')[0];
      const dateTime = `${date} ${time}`;
      localStorage.setItem('username', user.name);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('lang', 'en');
      localStorage.setItem('date', dateTime);
      await loadStartPage();
    } catch (error) {
      console.log(error);
    }
  })
} else {
  loadStartPage();
}
