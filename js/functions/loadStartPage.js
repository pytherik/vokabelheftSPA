import {headerElements} from "../elements/headerElements.js";
import {navElements} from "../elements/navElements.js";
import {ListView} from "../views/listView.js";
import {CrudView} from "../views/crudView.js";
import {getTranslation, showTranslation} from "./translateFunctions.js";
const container = document.querySelector('.container');
const title =  document.querySelector('title');

export const loadStartPage = async () => {
  title.innerText = 'Start'
  container.innerHTML = '';
  navElements();                        // language Flag-Buttons
  headerElements('zuletzt hinzugefügt'); // Überschriften

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

  editButtons.forEach(editButton => {
    editButton.addEventListener('click', async () => {
      const wordId = editButton.dataset.editWordId;
      const word = editButton.dataset.editWord;
      const wordclass = editButton.dataset.editWordclass;
      const result = await getTranslation(wordId, wordclass)
      const translations = result.translations;
      const description = result.description;
      const author = editButton.dataset.editAuthor;
      console.log(wordId, wordclass, word, translations, description);
      const editor = new CrudView();
      editor.buildCreateForm(author, wordId, word, wordclass, translations, description);
    })
  })
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
      const id = wordButton.dataset.wordId;
      const wordclass = wordButton.dataset.wordclass;
      const authorName = wordButton.dataset.authorName;
      const translation = await getTranslation(id, wordclass);
      console.log(translation);
      showTranslation(translation, wordclass, authorName);
    })
  })

  //info          Liste Alle Vokabeln
  allWordsButtons.forEach(allWordsButton => {
    allWordsButton.addEventListener('click', async () => {
      const id = allWordsButton.dataset.allWordsId;
      const wordclass = allWordsButton.dataset.wordclass;
      const authorName = allWordsButton.dataset.authorName;
      const translation = await getTranslation(id, wordclass);
      showTranslation(translation, wordclass, authorName);
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
