import {headerElements} from "./elements/headerElements.js";
import Login from './views/loginView.js';
import {ListView} from './views/listView.js';
import {langElements} from './elements/langElements.js';
import {urlActionSwitch} from './config.js';

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

  const buttonDe = document.getElementById('lang-de');
  const buttonEn = document.getElementById('lang-en');
  if (localStorage.getItem('lang') === 'en') {
    buttonDe.classList.add('inactive');
  } else {
    buttonEn.classList.add('inactive');
  }

  //info language Flag-Buttons
  buttonDe.addEventListener('click', async () => {
    localStorage.setItem('lang', 'de');
    await loadStartPage();
  })

  buttonEn.addEventListener('click', async () => {
    localStorage.setItem('lang', 'en');
    await loadStartPage();
  });


  const buttonUser = document.getElementById('btn-user');
  const buttonAllUsers = document.getElementById('btn-all-users');
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
    wordButton.addEventListener('click', async () => {
      const id = wordButton.dataset.wordId;
      const wordclass = wordButton.dataset.wordclass;
      const translation = await  getTranslation(id, wordclass);
      showTranslation(translation);
      console.log(translation);
    })
  })

  const showTranslation = (translation) => {
      const modal = document.querySelector('.modal-container');
      const innerModal = document.querySelector('.inner-modal');
      modal.style.display = 'block';

      let modalContent = `<button id="quit">quit</button>`
      modalContent += `<div class="translation">${translation.translations}</div>`

      innerModal.insertAdjacentHTML('beforeend', modalContent);

      const quit = document.getElementById('quit');
      quit.addEventListener('click', () => {
        innerModal.innerHTML = '';
        modal.style.display = 'none';
      })
  }

  allWordsButtons.forEach(allWordsButton => {
    allWordsButton.addEventListener('click', async () => {
      const id = allWordsButton.dataset.allWordsId;
      const wordlass = allWordsButton.dataset.wordclass;
      console.log(wordlass);
      const translation = await getTranslation(id, wordlass);
      showTranslation(translation);

    })
  })

  const getTranslation = async (id, wordclass) => {
    try {
      const formData = new FormData();
      formData.append('action', 'getTranslation');
      formData.append('id', id);
      formData.append('wordclass', wordclass)
      formData.append('lang', localStorage.getItem('lang'));
      const result = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      })
      return await result.json();
    } catch (error) {
      console.log(error);
    }
  }
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
