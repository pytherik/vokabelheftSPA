import {headerElements} from "../elements/headerElements.js";
import {navElements} from "../elements/navElements.js";
import {ListView} from "../views/listView.js";
import {CrudView} from "../views/crudView.js";
import {getTranslation, showTranslation} from "./translateFunctions.js";
import {getDescription} from "./getDescription.js";
import {session} from "../config.js";
import {loadLearnPage} from "./loadLearnPage.js";
import {logout} from "./logout.js";

const container = document.querySelector('.container');
const title =  document.querySelector('title');

export const loadStartPage = async () => {

  title.innerText = 'Start'
  container.innerHTML = '';
  const page = (localStorage.getItem('lang') === 'en') ? 'last added by ...': 'zuletzt hinzugefügt von ...';
  navElements();        // language Flag-Buttons, create new entry, logout
  headerElements(page); // Überschriften
  const starter = new ListView();

  //info firstBuild=true: Aufruf erstellt Seite startPage
  await starter.createListContainer();

  const buttonDe = document.getElementById('lang-de');
  const buttonEn = document.getElementById('lang-en');
  if (localStorage.getItem('lang') === 'en') {
    buttonDe.classList.add('inactive');
  } else {
    buttonEn.classList.add('inactive');
  }

  //info Sprache auf deutsch ändern
  buttonDe.addEventListener('click', async () => {
    localStorage.setItem('lang', 'de');
    await loadStartPage();
  })

  //info Sprache auf englisch ändern
  buttonEn.addEventListener('click', async () => {
    localStorage.setItem('lang', 'en');
    await loadStartPage();
  });

  //info Buttons führen zur learnPage
  const buttonUser = document.getElementById('btn-user');
  const buttonAllUsers = document.getElementById('btn-all-users');

  //info nur Vokabeln des aktuellen Benutzers abfragen
  buttonUser.addEventListener('click', () => loadLearnPage(false));

  //info Vokabeln von allen Benutzern abfragen
  buttonAllUsers.addEventListener('click', () => {
    loadLearnPage(true);
  })


  const addButtons = document.querySelectorAll('[data-add-word-id]');
  const removeButtons = document.querySelectorAll('[data-remove-word-id]');
  const editButtons = document.querySelectorAll('[data-edit-word-id]');
  const wordButtons = document.querySelectorAll('[data-word-id]');
  const allWordsButtons = document.querySelectorAll('[data-all-words-id]');

  const creator = new CrudView();


  //info Plus-Buttons zum hinzufügen einer Vokabel
  addButtons.forEach(addButton => {
    addButton.addEventListener('click', () => {
      const wordId = addButton.dataset.addWordId;
      creator.addWordToUserPool(wordId);
    })
  })

  //info Minus-Button zum rausschmeissen einer Vokabel
  removeButtons.forEach(removeButton => {
    removeButton.addEventListener('click', () => {
      //info wordId ist user_pool Tabellen-Id
      const wordId = removeButton.dataset.removeWordId;
      creator.removeWordFromUserPool(wordId);
    })
  })

  //info  Übersetzung für Wort aus Liste UserPool
  wordButtons.forEach(wordButton => {
    wordButton.addEventListener('click', async () => {
      const wordId = wordButton.dataset.wordId;
      const wordclass = wordButton.dataset.wordclass;
      const authorName = wordButton.dataset.authorName;
      const translation = await getTranslation(wordId, wordclass);
      let description = await getDescription(wordId, session.userId, localStorage.getItem('lang'));
      if (description === '') {
        description = (localStorage.getItem('lang') === 'en') ?
          `click edit                            
                           <span class="edit-small">
                            <img class="edit-img" src="./assets/images/icons/edit2.png" alt="edit" >
                           </span> to add a description` :
          `füge mit Edit 
                           <span class="edit-small">
                            <img class="edit-img" src="./assets/images/icons/edit2.png" alt="edit" >
                           </span> eine Beschreibung hinzu`;
      }
      showTranslation(translation, wordclass, authorName, description);
    })
  })

  //info Übersetung für Wort aus Liste Alle Vokabeln
  allWordsButtons.forEach(allWordsButton => {
    allWordsButton.addEventListener('click', async () => {
      const id = allWordsButton.dataset.allWordsId;
      const wordclass = allWordsButton.dataset.wordclass;
      const authorName = allWordsButton.dataset.authorName;
      const translation = await getTranslation(id, wordclass);
      const description = (localStorage.getItem('lang') === 'en') ?
        'create or edit the description in your book!' :
        'erstelle oder ändere die Beschreibung in deinem Heft!';
      showTranslation(translation, wordclass, authorName, description);
    })
  })

  //info mit edit lässt sich die Beschreibung ändern, nichts anderes
  editButtons.forEach(editButton => {
    editButton.addEventListener('click', async () => {
      const wordId = editButton.dataset.editWordId;
      const wordclass = editButton.dataset.editWordclass;
      const authorName = editButton.dataset.editAuthorName;
      await creator.buildCreateForm(Number(wordId), wordclass, authorName);
    })
  })

  //info Modal mit Erstellen-Formular wird erstellt
  document.querySelector('.btn-create').addEventListener(
    'click', creator.buildCreateForm);

  //info Suchfunktion für alle Vokabeln
  const searchAllInput = document.getElementById('search-all');
  const allWords = document.querySelectorAll('[data-all-words-id-row]');
  searchAllInput.addEventListener('input', (e) => {
    const value = e.target.value;
    allWords.forEach(word => {
      //info Ausblenden aller Wörter in denen value nicht enthalten ist
      const contentWord = word.dataset.allWordsIdRow.toLowerCase();
      const isVisible = contentWord.includes(value.toLowerCase())
      word.classList.toggle('hide', !isVisible);
    })
  })

  //info Suchfunktion für Vokabeln aus dem Heft
  const searchInput = document.getElementById('search-user');
  const words = document.querySelectorAll('[data-word-id-row]');
  searchInput.addEventListener('input', (e) => {
    const value = e.target.value;
    words.forEach(word => {
      //info Ausblenden aller Wörter in denen value nicht enthalten ist
      const contentWord = word.dataset.wordIdRow.toLowerCase();
      const isVisible = contentWord.includes(value.toLowerCase())
      word.classList.toggle('hide', !isVisible);
    })
  })

  document.querySelector('.btn-logout').addEventListener('click', logout);
}
