import {session, urlActionSwitch} from "../config.js";
import {loadStartPage} from "../functions/loadStartPage.js";
import {getTranslation} from "../functions/translateFunctions.js";
import {getDescription} from "../functions/getDescription.js";
import {getDateTime} from "../functions/getDateTime.js";

export class CrudView {

  //info Erstellen zusätzlicher Inputs für mehr Übersetzungen incl. Delete zum Entfernen
  buildInput = () => {
    const translationEl = document.createElement('div');
    translationEl.className = 'input-container';

    const translation = `<div class="input-element additional">
                           <input type="text" class="modal-input" autocomplete="off">
                            <button class="btn-modal btn-delete">&#10006;</button>
                          </div>`;

    translationEl.insertAdjacentHTML('beforeend', translation);
    return translationEl;
  }

  //info im Edit Modus werden die Übersetzungen nur angezeigt, sind nicht veränderbar
  addTranslation = (to, translationValue) => {
    const translationEl = document.createElement('div');
    translationEl.className = 'input-container';

    const translation = `<div class="input-element">
                           <input type="text" class="modal-input no-border" value="${to}${translationValue}" disabled> 
                          </div>`;

    translationEl.insertAdjacentHTML('beforeend', translation);
    return translationEl;
  }

  //info Ablegen der im Edit erstellten oder geänderten Description in DB
  async updateDescription(wordId) {
    const description = document.querySelector('.modal-textarea').value;
    console.log(description);
    try {
      const formData = new FormData();
      formData.append('action', 'updateDescription');
      formData.append('wordId', wordId);
      formData.append('userId', localStorage.getItem('userId'));
      formData.append('lang', localStorage.getItem('lang'));
      formData.append('description', description);
      const result = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      })
      await result.json();
    } catch (error) {
      console.log(error);
    }
  }

  //info Überprüfen der Eingaben im Create Modus und Ausgabe von Warnungen
  validateInput(word, translations, lang) {
    let wordclassValue = '';
    const radios = document.getElementsByName('class');
    let radioCheck = false;
    radios.forEach(radio => {
      if (radio.checked === true) {
        wordclassValue = radio.value;
        radioCheck = true;
      }
    })

    if (radioCheck === false) {
      document.getElementById('radio-warning').removeAttribute('hidden');
      return false;
    }

    if (word.length < 1) {
      document.getElementById('word-warning').removeAttribute('hidden');
      return false;
    }

    if (lang === 'de' && wordclassValue === 'noun') {
      if ((word.split(' ').length > 1 && !['der','die','das'].includes(word.split(' ')[0]) ||
        (word.split(' ').length === 1))){
        document.getElementById('word-article-warning').removeAttribute('hidden');
        return false;
      }
    }

    let translationsCheck = true;
    let articleCheck = true;
    translations.forEach(tr => {
      if (lang === 'en' && wordclassValue === 'noun') {
        if ((tr.value.split(' ').length > 1 && !['der','die','das'].includes(tr.value.split(' ')[0]) ||
          (tr.value.split(' ').length === 1))){
          articleCheck = false;
        }
      }
      if (tr.value.length < 1) {
        translationsCheck = false;
      }
    })

    if (articleCheck === false) {
      document.getElementById('translation-article-warning').removeAttribute('hidden');
      return false;
    }

    if (translationsCheck === false) {
      document.getElementById('translation-warning').removeAttribute('hidden');
      return false;
    }
    return true;
  }

  //info Überprüfung einer im Gesamtbestand befindlichen Vokabel
  // auf Vorhandensein im UserPool beim Versuch sie neu zu Erstellen,
  // um sie diesem hinzuzufügen falls nicht
  async wordInUserPool(lang, userId, wordId) {
    try {
      const formData = new FormData();
      formData.append('action', 'getSinglePoolObject');
      formData.append('lang', lang);
      formData.append('userId', userId);
      formData.append('wordId', wordId);
      const response = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      })
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  //info Aufnehmen einer neuen Vokabel in DB
  async createNewWord() {
    const lang = localStorage.getItem('lang');
    let word = document.getElementById('word').value;
    let wordId = 0;
    let newWordMessage = '';
    //info Holen aller Werte aus den Input-Feldern
    const translations = document.querySelectorAll('.modal-input');
    if (!this.validateInput(word, translations, lang)) {
      return;
    }
    const wordclass = document.querySelector(`input[name="class"]:checked`).value;
    const description = document.querySelector('.modal-textarea').value;

    if (lang === 'de' && wordclass === 'noun') {
      const wordArr = word.split(' ')
      const capitalized = wordArr[1].charAt(0).toUpperCase() + wordArr[1].slice(1);
      word = [wordArr[0], capitalized].join(' ');
    }

    if (lang === 'en' && wordclass === 'verb') {
      if(word.split(' ').length > 1 && word.split(' ')[0] === 'to') {
        word = word.split(' ')[1];
      }
    }

    const translationsArr = [];
    let translation = ''
    translations.forEach(tr => {
      if (lang === 'en' && wordclass === 'noun') {
        const wordArr = tr.value.split(' ')
        const capitalized = wordArr[1].charAt(0).toUpperCase() + wordArr[1].slice(1);
        translation = [wordArr[0], capitalized].join(' ');
      } else if (lang === 'de' && wordclass === 'verb') {
        if(tr.value.split(' ').length > 1 && tr.value.split(' ')[0] === 'to') {
          translation = tr.value.split(' ')[1];
        } else {
          translation = tr.value;
        }
      } else {
        translation = tr.value;
      }
      translationsArr.push(translation);
    })

    try {
      const formData = new FormData();
      const dateTime = getDateTime();
      formData.append('action', 'createNewWord');
      formData.append('authorId', localStorage.getItem('userId'));
      formData.append('createdAt', dateTime);
      formData.append('lang', lang);
      formData.append('word', word);
      formData.append('wordclass', wordclass);
      formData.append('translations', JSON.stringify(translationsArr));
      formData.append('description', description);
      const result = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      })
      wordId = await result.json();
    } catch (error) {
      console.log(error);
    }
    //info wenn der Rückgabewert der DB Abfrage > 0 ist, ist die Vokabel schon vorhanden,
    if (Number(wordId) > 0) {
      //info dann wird überprüft, ob sie im Heft ist
      const wordInBook = await this.wordInUserPool(lang, session.userId, wordId);
      if (wordInBook === 'false') {
        //info und entweder diesem hinzugefügt oder nicht
        await this.addWordToUserPool(wordId);
        newWordMessage = (lang === 'en') ?
          'Existing word. Added to your book now!' :
          'Schon vorhanden. Jetzt auch im Heft!';
      } else {
        newWordMessage = (lang === 'en') ?
          'The word is already in your book' :
          'Das Wort ist schon im Heft';
      }
    } else {
      newWordMessage = (lang === 'en') ?
        'Word added to book and collection!' :
        'Wort erstellt in Heft und in Sammlung!';
    }

    //info Die Messages sind für 2 Sekunden sichtbar, dann wird Anzeige gelöscht
    document.querySelector('.new-word-message').innerText = `${newWordMessage}`;
    setTimeout(() => {
      this.clearModal();
      loadStartPage();
    }, 2000);
  }

  //info Aufbauen des Create Formulars, setzen und Vorbereiten benötigter Variablen
  async buildCreateForm(wordId = 0, wordclass = '', authorName = '') {
    const lang = localStorage.getItem('lang');
    let wordTxt = (lang === 'en') ? 'New english word' : 'Neues deutsches Wort';
    const authorTxt = (lang === 'en') ? 'Author' : 'Autor';
    const author = (authorName === '') ? session.username : authorName;
    const wordclassTxt = (lang === 'en') ? 'Wordclass' : 'Wortart';
    const translationTxt = (lang === 'en') ? 'Translations' : 'Bedeutungen';
    const descriptionTxt = (lang === 'en') ? 'Description' : 'Beschreibung';
    const radioWarning = (lang === 'en') ? 'chose a wordclass' : 'wähle eine Wortart';
    const wordWarning = (lang === 'en') ? 'must not be empty' : 'darf nicht leer sein';
    const articleWarning = (lang ==='en') ? 'german noun must have an article' : 'Substantive brauchen einen Artikel';
    const modal = document.querySelector('.modal-container');
    const innerModal = document.querySelector('.inner-modal');
    innerModal.className = 'inner-modal';
    let translations = ['']
    let descriptionValue = '';
    let to = '';
    let disabled = '';
    let hidden = '';
    let wordValue = ''
    let noBorder = '';
    //info Edit-Modus tritt ein, wenn eine wortId vorhanden ist (0 bedeutet nicht vorhanden)
    if (wordId > 0) {
      innerModal.className = 'inner-edit-modal';
      wordTxt = (lang === 'en') ? 'Edit description for' : 'Beschreibung ändern für';
      if (lang === 'de') {
        if (wordclass === 'noun') wordclass = 'Substantiv';
        if (wordclass === 'verb') wordclass = 'Verb';
        if (wordclass === 'adjective') wordclass = 'Adjektiv';
        if (wordclass === 'other') wordclass = 'andere';
      }
      //info alle Informationen bereitstellen um vorhandene Werte anzuzeigen und nur das
      // editieren der Description zuzulassen
      noBorder = ' no-border';
      disabled = 'disabled';
      hidden = 'hidden';
      const translation = await getTranslation(wordId, wordclass);
      descriptionValue = await getDescription(wordId, session.userId, localStorage.getItem('lang'));
      translations = translation.translations;
      if (lang === 'en' && wordclass === 'verb' ) {
        wordValue = 'to ' + translation.word;
      } else if (lang === 'de' && wordclass === 'Verb') {
        wordValue = translation.word;
        to = 'to ';
      } else {
        wordValue = translation.word;
      }
    }
    modal.style.display = 'block';
    const noun = (lang === 'en') ? 'noun' : 'Substantiv';
    const verb = (lang === 'en') ? 'verb' : 'Verb';
    const adjective = (lang === 'en') ? 'adjective' : 'Adjektiv';
    const other = (lang === 'en') ? 'other' : 'Andere';

    const quitButton = `<img src="./assets/images/icons/quit.png" id="quit" alt="quit">`;
    const authorContent = `<div>
                             <span class="new-word-message"></span>
                             <div class="modal-author">${authorTxt}: ${author}</div>`
    const wordContent = `<div class="modal-heading">${wordTxt}: </div>
                           <span id="word-warning" class="warning" hidden>${wordWarning}</span>
                           <span id="word-article-warning" class="warning" hidden>${articleWarning}</span>
                           <input type="text" class="modal-native${noBorder}" id="word" value="${wordValue}" 
                           autocomplete="off" ${disabled}>
                         </div>`;
    const wordclassCheck = `<div class="modal-heading">${wordclassTxt}: ${wordclass}</div>
                              <span id="radio-warning" class="warning" hidden>${radioWarning}</span>
                              <div ${hidden}>
                                <input type="radio" value="noun" name="class"> ${noun}
                                <input type="radio" value="verb" name="class"> ${verb}
                                <input type="radio" value="adjective" name="class"> ${adjective}
                                <input type="radio" value="other" name="class"> ${other}
                              </div>`
    const translation = `<div>
                           <div class="modal-heading">${translationTxt}: </div>
                           <span id="translation-warning" class="warning" hidden>${wordWarning}<br></span>
                           <span id="translation-article-warning" class="warning" hidden>${articleWarning}<br></span>
                           <input type="text" class="modal-input${noBorder}" value="${to}${translations[0]}" 
                           autocomplete="off" ${disabled}>
                           <button class="btn-modal btn-next" ${hidden}>&#43;</button>
                         </div>`;

    const textArea = `<div class="modal-description">${descriptionTxt}</div>
                      <div class="modal-description-content">
                        <textarea class="modal-textarea" id="description" rows="3">${descriptionValue}</textarea>
                      </div>
                    </div>`;

    //info Unterschiedliche Input Felder - erster Input mit plus Button
    const inputsContainer = document.createElement('div');
    inputsContainer.insertAdjacentHTML('beforeend', translation)

    if (translations.length > 1) {
      for (let j = 1; j < translations.length; j++) {
        inputsContainer.insertAdjacentElement('beforeend', this.addTranslation(to, translations[j]));
      }
    }

    const submit = document.createElement('button');
    submit.className = 'btn-submit';
    submit.innerText = 'okay';

    innerModal.insertAdjacentHTML('beforeend', quitButton);
    innerModal.insertAdjacentHTML('beforeend', authorContent);
    innerModal.insertAdjacentHTML('beforeend', wordContent);
    innerModal.insertAdjacentHTML('beforeend', wordclassCheck);
    innerModal.insertAdjacentElement('beforeend', inputsContainer);
    innerModal.insertAdjacentHTML('beforeend', textArea);
    innerModal.insertAdjacentElement('beforeend', submit);

    document.getElementById('word').focus();
    //info hinzufügen einer weiteren Übersetzung, 4 ist Maximum
    const nextButton = document.querySelector('.btn-next');
    nextButton.addEventListener('click', () => {
      const numTranslations = document.querySelectorAll('.input-element').length;
      if (numTranslations < 3) {
        inputsContainer.insertAdjacentElement('beforeend', this.buildInput());
      }
      //info Eventlistener zum Entfernen von Einträgen
      const deletes = document.querySelectorAll('.btn-delete');
      const allInputs = document.querySelectorAll('.additional');

      deletes.forEach((del, idx) => {
        del.addEventListener('click', () => {
          allInputs[idx].remove();
          console.log(idx);
        })
      })
    })

    //info wenn keine wordId geliefert wurde wird ein neues Wort hinzugefügt,
    // andernfalls updateDescription aufgerufen
    submit.addEventListener('click', () => {
      if (wordId === 0) {
        this.createNewWord();
      } else {
        this.updateDescription(wordId);
        clearModal();
        loadStartPage();
      }
    })

    const quit = document.getElementById('quit');
    quit.addEventListener('click', () => {
      clearModal();
    })

    const clearModal = () => {
      innerModal.innerHTML = '';
      //info className zurücksetzten, damit querySelect funktioniert
      // (wurde in inner-show-modal geändert, um Darstellung anzupassen)
      innerModal.className = 'inner-modal';
      modal.style.display = 'none';
    }
  }

  clearModal = () => {
    const modal = document.querySelector('.modal-container');
    const innerModal = document.querySelector('.inner-modal');
    innerModal.innerHTML = '';
    //info className zurücksetzten, damit querySelect funktioniert
    // (wurde in inner-show-modal geändert, um Darstellung anzupassen)
    innerModal.className = 'inner-modal';
    modal.style.display = 'none';
  }

  //info Wort kommt ins Heft, nach Dücken des plus Buttons oder im Fall
  // des Versuchs eine Vokabel zu erstellen die schon existiert
  async addWordToUserPool(wordId, description = '') {
    const lang = localStorage.getItem('lang');
    try {
      const formData = new FormData();
      formData.append('action', 'addWordToUserPool');
      formData.append('userId', localStorage.getItem('userId'));
      formData.append('wordId', wordId);
      formData.append('date', localStorage.getItem('date'));
      formData.append('lang', lang);
      formData.append('description', description);
      const result = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      })
      // const data = await result.json();
      await loadStartPage();
    } catch (error) {
      console.log(error);
    }
  }

  //info minus-Button wurde gedrückt, Vokabel wird aus Heft entfernt
  async removeWordFromUserPool(wordId) {
    try {
      const formData = new FormData();
      formData.append('action', 'removeWordFromUserPool');
      formData.append('userId', localStorage.getItem('userId'));
      formData.append('id', wordId);
      const result = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      })
      // const data = await result.json();
      await loadStartPage();
    } catch (error) {
      console.log(error);
    }
  }
}
