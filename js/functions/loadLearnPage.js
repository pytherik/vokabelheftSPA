import {headerElements} from "../elements/headerElements.js";
import {navElements} from "../elements/navElements.js";
import {LearnView} from "../views/learnView.js";
import {session} from "../config.js";
import {loadStartPage} from "./loadStartPage.js";

const container = document.querySelector('.container');
const title = document.querySelector('title');

export const loadLearnPage = async (mode) => {
  let page = '';
  title.innerText = 'Learn'
  container.innerHTML = '';
  if (mode) {
     page = (localStorage.getItem('lang') === 'en') ?
       `Hello ${session.username}! Practice all learners' vocabulary`:
       `Hallo ${session.username}! Übe die Vokabeln aller Lernenden`;
  } else {
     page = (localStorage.getItem('lang') === 'en') ?
       `Hello ${session.username}! Practice your vocabulary`:
       `Hallo ${session.username}! Übe deine Vokabeln`;
  }
  navElements();        // language Flag-Buttons, create new entry, logout
  headerElements(page); // Überschriften
  const homeButton = document.querySelector('.btn-create');
  homeButton.innerText = (localStorage.getItem('lang') === 'en') ? 'back to StartPage' : 'zurück zur Startseite';

  const trainer = new LearnView();
  await trainer.createStatisticsContainer();

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
    await loadLearnPage(mode);
  })

  buttonEn.addEventListener('click', async () => {
    localStorage.setItem('lang', 'en');
    await loadLearnPage(mode);
  });
  homeButton.addEventListener('click', () => loadStartPage());
}