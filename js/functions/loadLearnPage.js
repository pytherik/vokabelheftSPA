import {headerElements} from "../elements/headerElements.js";
import {navElements} from "../elements/navElements.js";
import {LearnView} from "../views/learnView.js";
import {loadStartPage} from "./loadStartPage.js";
import {logout} from "./logout.js";

const container = document.querySelector('.container');
const title = document.querySelector('title');

export const loadLearnPage = async (mode) => {
  const username = localStorage.getItem('username');
  let page = '';
  title.innerText = 'Learn'
  container.innerHTML = '';

  //info mode für Lernmodus: eigene (false) oder alle (true) Vokabeln
  if (mode) {
     page = (localStorage.getItem('lang') === 'en') ?
       `Hello ${username}! Practice all learners' vocabulary`:
       `Hallo ${username}! Übe die Vokabeln aller Lernenden`;
  } else {
     page = (localStorage.getItem('lang') === 'en') ?
       `Hello ${username}! Practice your vocabulary`:
       `Hallo ${username}! Übe deine Vokabeln`;
  }

  //info Navigation und Übeschriften erstellen
  navElements();        // language Flag-Buttons, create new entry, logout
  headerElements(page); // Überschriften


  //info Seiteninhalt aufbauen
  const trainer = new LearnView(mode);
  await trainer.createStatisticsContainer();
  await trainer.practice();
  //info Sprachbuttons holen
  const buttonDe = document.getElementById('lang-de');
  const buttonEn = document.getElementById('lang-en');
  if (localStorage.getItem('lang') === 'en') {
    buttonDe.classList.add('inactive');
  } else {
    buttonEn.classList.add('inactive');
  }

  //info zu deutsch wechseln
  buttonDe.addEventListener('click', async () => {
    localStorage.setItem('lang', 'de');
    await loadLearnPage(mode);
  })

  //info zu englisch wechseln
  buttonEn.addEventListener('click', async () => {
    localStorage.setItem('lang', 'en');
    await loadLearnPage(mode);
  });

  //info create Button in Home Button ändern
  const homeButton = document.querySelector('.btn-create');
  homeButton.innerText = (localStorage.getItem('lang') === 'en') ? 'back to StartPage' : 'zurück zur Startseite';
  homeButton.addEventListener('click', () => loadStartPage());

  const logoutButton = document.querySelector('.btn-logout');
  logoutButton.addEventListener('click', () => logout());
}
