import {headerElements} from "../elements/headerElements.js";
import {navElements} from "../elements/navElements.js";
import {ListView} from "../views/listView.js";
import {CrudView} from "../views/crudView.js";
import {getTranslation, showTranslation} from "./translateFunctions.js";
import {getDescription} from "./getDescription.js";
import {session} from "../config.js";

const container = document.querySelector('.container');
const title =  document.querySelector('title');

export const loadStartPage = async () => {
  title.innerText = 'Start'
  container.innerHTML = '';
  const page = (session.lang === 'en') ? 'last added': 'zuletzt hinzugefügt';
  // const page = (localStorage.getItem('lang') === 'en') ? 'last added': 'zuletzt hinzugefügt';
  navElements();                        // language Flag-Buttons
  headerElements(page); // Überschriften

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


  //info Üben Buttons
  const buttonUser = document.getElementById('btn-user');
  const buttonAllUsers = document.getElementById('btn-all-users');

  buttonUser.addEventListener('click', () => {
    console.log('btn-user clicked');
  })

  buttonAllUsers.addEventListener('click', () => {
    console.log('btn-all-users clicked');
  })


  const addButtons = document.querySelectorAll('[data-add-word-id]');
  const removeButtons = document.querySelectorAll('[data-remove-word-id]');
  const editButtons = document.querySelectorAll('[data-edit-word-id]');
  const wordButtons = document.querySelectorAll('[data-word-id]');
  const allWordsButtons = document.querySelectorAll('[data-all-words-id]');


  //info Plus-Buttons zum hinzufügen einer Vokabel
  addButtons.forEach(addButton => {
    addButton.addEventListener('click', () => {
      const wordId = addButton.dataset.addWordId;
      const creator = new CrudView();
      creator.addWordToUserPool(wordId);
    })
  })

  //info Minus-Button zum rausschmeissen einer Vokabel
  removeButtons.forEach(removeButton => {
    removeButton.addEventListener('click', () => {
      //info wordId ist user_pool Tabellen-Id
      const wordId = removeButton.dataset.removeWordId;
      const remover = new CrudView();
      remover.removeWordFromUserPool(wordId);
    })
  })

  //info Übersetzung anzeigen lassen (Modal)
  //info           Liste UserPool
  wordButtons.forEach(wordButton => {
    wordButton.addEventListener('click', async () => {
      const wordId = wordButton.dataset.wordId;
      const wordclass = wordButton.dataset.wordclass;
      const authorName = wordButton.dataset.authorName;
      const translation = await getTranslation(wordId, wordclass);
      const description = await getDescription(wordId, session.userId, localStorage.getItem('lang'));
      console.log(description);
      console.log(translation);
      showTranslation(translation, wordclass, authorName, description);
    })
  })

  editButtons.forEach(editButton => {
    editButton.addEventListener('click', async () => {
      const wordId = editButton.dataset.editWordId;
      const wordclass = editButton.dataset.editWordclass;
      const authorName = editButton.dataset.editAuthorName;
      console.log(wordId, wordclass, authorName);
      const translation = await getTranslation(wordId, wordclass);
      const description = await getDescription(wordId, session.userId, localStorage.getItem('lang'));
      console.log(description);
      console.log(translation);
      const editor = new CrudView();
      editor.editDescripion(wordId, wordclass, authorName, translation, description);
    })
  })

  //info          Liste Alle Vokabeln
  allWordsButtons.forEach(allWordsButton => {
    allWordsButton.addEventListener('click', async () => {
      const id = allWordsButton.dataset.allWordsId;
      const wordclass = allWordsButton.dataset.wordclass;
      const authorName = allWordsButton.dataset.authorName;
      const translation = await getTranslation(id, wordclass);
      showTranslation(translation, wordclass, authorName, '');
    })
  })

  const newWord = document.querySelector('.btn-create');
  newWord.addEventListener('click', () => {
    console.log('newWord clicked');
    const creator = new CrudView();
    creator.buildCreateForm();
  })


  const logoutButton = document.querySelector('.btn-logout');
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('date');
    localStorage.removeItem('lang');
    location.reload();
  })
}
