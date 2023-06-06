import {headerElements} from "../elements/headerElements.js";
import {langElements} from "../elements/langElements.js";
import {ListView} from "../views/listView.js";
import {CreateView} from "../views/createView.js";
import {getTranslation, showTranslation} from "./translateFunctions.js";
const container = document.querySelector('.container');
const title =  document.querySelector('title');

export const loadStartPage = async () => {
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
      const wordId = addButton.dataset.addWordId;
      const creator = new CreateView();
      creator.addDescription(wordId, localStorage.getItem('lang'));
    })
  })

  wordButtons.forEach(wordButton => {
    wordButton.addEventListener('click', async () => {
      const id = wordButton.dataset.wordId;
      const wordclass = wordButton.dataset.wordclass;
      const authorName = wordButton.dataset.authorName;
      const translation = await  getTranslation(id, wordclass);
      showTranslation(translation, wordclass, authorName);
    })
  })

  allWordsButtons.forEach(allWordsButton => {
    allWordsButton.addEventListener('click', async () => {
      const id = allWordsButton.dataset.allWordsId;
      const wordclass = allWordsButton.dataset.wordclass;
      const authorName = allWordsButton.dataset.authorName;
      const translation = await getTranslation(id, wordclass);
      showTranslation(translation, wordclass, authorName);
    })
  })
}
