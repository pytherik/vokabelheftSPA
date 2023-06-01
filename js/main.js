import {container} from './domElements.js'
import {title} from "./domElements.js";
import {header} from "./header.js";
import Login from './login.js';
import {StartPage} from "./startPage.js";

header();
let user;

const loadStartPage = () => {
  container.innerHTML='';
  header();
  const benutzer = user.name;
  const starter = new StartPage();
  starter.createUserListContainer(benutzer);
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
      const response = await fetch('http://localhost:63342/VokabelheftSPA/actionSwitch.php',
        {
          body: formData,
          method: 'POST'
        });
      user = await response.json();
      console.log(user);
      loadStartPage();

      console.log(user);
    } catch (error) {
      console.log(error);
    }
  })
}