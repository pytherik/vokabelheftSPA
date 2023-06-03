import {container} from './domElements.js'
import {title} from "./domElements.js";
import {headerElements} from "./headerElements.js";
import Login from './loginView.js';
import {StartView} from "./startView.js";

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
  container.innerHTML = '';
  headerElements('zuletz hinzugefügt');
  title.innerText = 'Start'
  const starter = new StartView();
  await starter.createListContainer();

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
      await loadStartPage();
    } catch (error) {
      console.log(error);
    }
  })
} else {
  loadStartPage();
}
