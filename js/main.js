import {headerElements} from "./elements/headerElements.js";
import Login from './views/loginView.js';
import {ListView} from "./views/listView.js";
import {langElements} from "./elements/langElements.js";

const container = document.querySelector('.container');
const title =  document.querySelector('title');

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


const loadStartPage = async () => {
  title.innerText = 'Start'
  container.innerHTML = '';
  headerElements('zuletzt hinzugefügt'); // Überschriften
  langElements();                        // language Flag-Buttons

  const starter = new ListView();

  //info firstBuild=true: erster Aufruf erstellt .content - div
  await starter.createListContainer(true);

  const buttonUser = document.getElementById('btn-user');
  const buttonAllUsers = document.getElementById('btn-all-users');
  const buttonDe = document.getElementById('lang-de');
  const buttonEn = document.getElementById('lang-en');

  //info language Flag-Buttons
  buttonDe.addEventListener('click', async () => {
    buttonEn.classList.add('inactive');
    buttonDe.classList.remove('inactive');
    localStorage.setItem('lang', 'de');
    await starter.createListContainer(); // firstBuild=false füllt .content neu
  })

  buttonEn.addEventListener('click', async () => {
    buttonEn.classList.remove('inactive');
    buttonDe.classList.add('inactive');
    localStorage.setItem('lang', 'en');
    await starter.createListContainer(); // firstBuild=false füllt .content neu
  });

  //info Üben Buttons
  buttonUser.addEventListener('click', () => {
    console.log('btn-user clicked');
  })

  buttonAllUsers.addEventListener('click', () => {
    console.log('btn-all-users clicked');
  })

  const addButtons = document.querySelectorAll('[data-add-word-id]');
  const wordButtons = document.querySelectorAll('[data-word-id]');
  const allWordsButtons = document.querySelectorAll('[data-all-words-id]');
  addButtons.forEach(addButton => {
    addButton.addEventListener('click', () => {
      console.log(addButton.dataset.addWordId);
    })
  })

  wordButtons.forEach(wordButton => {
    wordButton.addEventListener('click', () => {
      console.log(wordButton.dataset.wordId);
    })
  })

  allWordsButtons.forEach(allWordsButton => {
    allWordsButton.addEventListener('click', () => {
      console.log(allWordsButton.dataset.allWordsId);
    })
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
