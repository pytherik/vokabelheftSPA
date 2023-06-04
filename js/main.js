import {headerElements} from "./elements/headerElements.js";
import Login from './views/loginView.js';
import {ListView} from "./views/listView.js";
import {buttonElements} from "./elements/buttonElements.js";
import {langElements} from "./elements/langElements.js";

const container = document.querySelector('.container');
const title =  document.querySelector('title');
function clearStorage() {
  let session = sessionStorage.getItem('register');
  if (session == null) {
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
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


const loadStartPage = async () => {
  title.innerText = 'Start'
  container.innerHTML = '';
  headerElements('zuletzt hinzugefügt');
  langElements();

  const buttonDe = document.getElementById('lang-de');
  buttonDe.addEventListener('click', () => {
    console.log('btn-de clicked');
    localStorage.setItem('lang', 'de');
    loadStartPage();
  })

  const buttonEn = document.getElementById('lang-en');
  buttonEn.addEventListener('click', () => {
    console.log('btn-en clicked');
    localStorage.setItem('lang', 'en');
    loadStartPage();
  });

  const starter = new ListView();
  await starter.createListContainer();
  buttonElements();
  const buttonUser = document.getElementById('btn-user');
  buttonUser.addEventListener('click', () => {
    console.log('btn-user clicked');
  })
  const buttonAllUsers = document.getElementById('btn-all-users');
  buttonAllUsers.addEventListener('click', () => {
    console.log('btn-all-users clicked');
  })
}



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
      const response = await fetch('http://localhost:63342/vokabelheftSPA/actionSwitch.php',
        {
          body: formData,
          method: 'POST'
        });
      const user = await response.json();
      console.log(user);
      localStorage.setItem('username', user.name);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('lang', 'en');
      await loadStartPage();
    } catch (error) {
      console.log(error);
    }
  })
} else {
  loadStartPage();
}
