import {session, urlActionSwitch} from "../config.js";
import {loadStartPage} from "../functions/loadStartPage.js";
import {getTranslation} from "../functions/translateFunctions.js";
import {getDescription} from "../functions/getDescription.js";

export class CrudView {

  buildInput = () => {
    const translationEl = document.createElement('div');
    translationEl.className = 'input-container';

    const translation = `<div class="input-element additional">
                           <input type="text" class="modal-input" autocomplete="off">
                            <button class="btn-modal btn-delete">-</button>
                          </div>`;

    translationEl.insertAdjacentHTML('beforeend', translation);
    return translationEl;
  }

  addTranslation = (translationValue) => {
    const translationEl = document.createElement('div');
    translationEl.className = 'input-container';

    const translation = `<div class="input-element">
                           <input type="text" class="modal-input no-border" value="${translationValue}" disabled> 
                          </div>`;

    translationEl.insertAdjacentHTML('beforeend', translation);
    return translationEl;
  }

  async updateDescription(wordId) {
    const description = document.querySelector('.modal-textarea').value;
    try {
      const formData = new FormData();
      formData.append('action', 'updateDescription');
      formData.append('wordId', wordId);
      formData.append('userId', session.userId);
      formData.append('lang', localStorage.getItem('lang'));
      formData.append('description', description);
      const result = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      })
      const response = await result.json();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  validateInput(word,translations) {
    const radios = document.getElementsByName('class');
    let radioCheck = false;
    radios.forEach(radio => {
      if (radio.checked === true){
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

    let translationsCheck = true;
    translations.forEach(tr => {
      if (tr.value.length < 1) {
        translationsCheck = false;
      }
    })
    if (translationsCheck === false) {
      document.getElementById('translation-warning').removeAttribute('hidden');
      return false;
    }
    return true;
  }

  async createNewWord() {
    console.log('okay clicked');
    console.log(localStorage.getItem('lang'));
    const word = document.getElementById('word').value;
    const translations = document.querySelectorAll('.modal-input');
    if (!this.validateInput(word, translations)){
      return;
    }
    const translationsArr = [];
    translations.forEach(tr => {
      translationsArr.push(tr.value);
    })
    const wordclass = document.querySelector(`input[name="class"]:checked`).value;
    const description = document.querySelector('.modal-textarea').value;
    try {
      const formData = new FormData();
      formData.append('action', 'createNewWord');
      formData.append('authorId', session.userId);
      formData.append('createdAt', session.date);
      formData.append('lang', localStorage.getItem('lang'));
      formData.append('word', word);
      formData.append('wordclass', wordclass);
      formData.append('translations', JSON.stringify(translationsArr));
      formData.append('description', description);
      const result = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      })
      const data = await result.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
    console.log(word);
    console.log(wordclass);
    console.log(translationsArr);
    console.log(description);
  }


  async buildCreateForm(wordId=0, wordclass='', authorName='') {
    const lang = localStorage.getItem('lang');
    console.log(lang);
    let wordTxt = (lang === 'en') ? 'New english word' : 'Neues deutsches Wort';
    const authorTxt = (lang === 'en') ? 'Author': 'Autor';
    const author = (authorName === '') ? session.username : authorName;
    const wordclassTxt = (lang === 'en') ? 'Wordclass' : 'Wortart';
    const translationTxt = (lang === 'en') ? 'Translations' : 'Bedeutungen';
    const descriptionTxt = (lang === 'en') ? 'Description': 'Beschreibung';
    const radioWarning = (lang === 'en') ? 'chose a wordclass' : 'wähle eine Wortart';
    const wordWarning = (lang === 'en') ? 'you must put sth. here!' : 'du musst etwas eintragen!';
    const modal = document.querySelector('.modal-container');
    const innerModal = document.querySelector('.inner-modal');
    innerModal.className = 'inner-modal';
    let translations = ['']
    let descriptionValue = '';
    let disabled = '';
    let hidden = '';
    let wordValue = ''
    let noBorder = '';
    if(wordId > 0) {
      innerModal.className = 'inner-edit-modal';
      wordTxt = (lang === 'en') ? 'Edit description for' : 'Beschreibung ändern';
      if (lang === 'de') {
        if(wordclass === 'noun') wordclass = 'Substantiv';
        if(wordclass === 'verb') wordclass = 'Verb';
        if(wordclass === 'adjective') wordclass = 'Adjektiv';
      }
      noBorder = ' no-border';
      disabled = 'disabled';
      hidden = 'hidden';
      const translation = await getTranslation(wordId, wordclass);
      descriptionValue = await getDescription(wordId, session.userId, localStorage.getItem('lang'));
      translations = translation.translations;
      wordValue = translation.word;
    }
    modal.style.display = 'block';

    const quitButton = `<img src="../../assets/images/icons/quit.png" id="quit" alt="quit">`;
    const authorContent = `<div><div class="modal-author">${authorTxt}: ${author}</div>`
    const inputsContainer = document.createElement('div');
    const wordContent = `<div class="modal-heading">${wordTxt}: </div>
                           <span id="word-warning" class="warning" hidden>${wordWarning}</span>
                           <input type="text" class="modal-native${noBorder}" id="word" value="${wordValue}" 
                           autocomplete="off" autofocus ${disabled}>
                         </div>`;
    const wordclassCheck = `<div class="modal-heading">${wordclassTxt}: ${wordclass}</div>
                              <span id="radio-warning" class="warning" hidden>${radioWarning}</span>
                              <div ${hidden}>
                                <input type="radio" value="noun" name="class"> noun
                                <input type="radio" value="verb" name="class"> verb
                                <input type="radio" value="adjective" name="class"> adjective
                              </div>`
    const translation = `<div>
                           <div class="modal-heading">${translationTxt}: </div>
                           <span id="translation-warning" class="warning" hidden>${wordWarning}<br></span>
                           <input type="text" class="modal-input${noBorder}" value="${translations[0]}" 
                           autocomplete="off" ${disabled}>
                           <button class="btn-modal btn-next" ${hidden}>+</button>
                         </div>`;

    const textArea = `<div class="modal-word">${descriptionTxt}</div>
                      <div class="modal-description">
                        <textarea class="modal-textarea" id="description" rows="3">${descriptionValue}</textarea>
                      </div>
                    </div>`;


    inputsContainer.insertAdjacentHTML('beforeend', translation)

    if (translations.length > 1) {
      for (let j = 1; j < translations.length; j++) {
        inputsContainer.insertAdjacentElement('beforeend', this.addTranslation(translations[j]));
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

    //info hinzufügen einer weiteren Übersetzung
    const nextButton = document.querySelector('.btn-next');
    nextButton.addEventListener('click', () => {
      const numTranslations = document.querySelectorAll('.input-element').length;
      if (numTranslations < 4) {
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

    submit.addEventListener('click', () => {
      if (wordId === 0) {
        this.createNewWord();
      } else {
        this.updateDescription(wordId);
      }
    })

    const quit = document.getElementById('quit');
    quit.addEventListener('click', () => {
      clearModal();
    })

    const clearModal = () => {
      innerModal.innerHTML = '';
      innerModal.className = 'inner-modal';
      modal.style.display = 'none';
    }
  }

  async addWordToUserPool(wordId, description = '') {
    console.log(wordId, description);
    const lang = localStorage.getItem('lang');
    try {
      const formData = new FormData();
      formData.append('action', 'addWordToUserPool');
      formData.append('userId', localStorage.getItem('userId'));
      formData.append('date', localStorage.getItem('date'));
      formData.append('wordId', wordId);
      formData.append('lang', lang);
      formData.append('description', description);
      const result = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      })
      const data = await result.json();
      console.log(data);
      loadStartPage();
    } catch (error) {
      console.log(error);
    }
  }

  async removeWordFromUserPool(wordId) {
    console.log(wordId)
    try {
      const formData = new FormData();
      formData.append('action', 'removeWordFromUserPool');
      formData.append('userId', localStorage.getItem('userId'));
      formData.append('id', wordId);
      const result = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      })
      const data = await result.json();
      console.log(data);
      loadStartPage();
    } catch (error) {
      console.log(error);
    }
  }
}