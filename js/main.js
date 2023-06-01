import {container} from './domElements.js'
import {title} from "./domElements.js";
import {header} from "./header.js";
import Login from './login.js';
import {StartPage} from "./startPage.js";


header();
if(!localStorage.getItem('username')){
  localStorage.setItem('username','');
  }

let username = localStorage.getItem('username');
const loadStartPage = (user) => {
  container.innerHTML='';
  header();
  const starter = new StartPage();
  starter.createUserListContainer(user);
  // container.innerHTML = `<h1>Hallo ${benutzer}</h1>`;

}
if(!username) {
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
      loadStartPage(user.name);
      localStorage.setItem('username', user.name);
      localStorage.setItem('userId', user.id);

      console.log(user.name);
    } catch (error) {
      console.log(error);
    }
  })
} else {
  loadStartPage(localStorage.getItem('username'));
}
