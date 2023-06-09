import {session, urlActionSwitch} from "../config.js";
import {loadStartPage} from "../functions/loadStartPage.js";
import {getTranslation} from "../functions/translateFunctions.js";
import {getDescription} from "../functions/getDescription.js";

export class CrudView {

  buildInput = (translationValue, disabled) => {
    const translationEl = document.createElement('div');
    translationEl.className = 'input-container';

    const translation = `<div class="input-element additional">
                           <input type="text" class="modal-input no-border" autocomplete="off" value="${translationValue}" ${disabled}>
                            <button class="btn-modal btn-delete" hidden>-</button>
                          </div>`;

    translationEl.insertAdjacentHTML('beforeend', translation);
    return translationEl;
  }

  async createNewWord() {
    console.log('okay clicked');
    console.log(localStorage.getItem('lang'));
    const word = document.getElementById('word').value;
    const wordclass = document.querySelector(`input[name="class"]:checked`).value;
    const translations = document.querySelectorAll('.modal-input');
    const translationsArr = [];
    translations.forEach(tr => {
      translationsArr.push(tr.value);
    })
    const description = document.querySelector('.modal-textarea').value;
    try {
      const formData = new FormData();
      formData.append('action', 'createNewWord');
      formData.append('authorId', localStorage.getItem('userId'));
      formData.append('createdAt', localStorage.getItem('date'));
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
    const wordclassTxt = (lang === 'en') ? 'Wordclass' : 'Wortart';
    const descriptionTxt = (lang === 'en') ? 'Description': 'Beschreibung';
    const modal = document.querySelector('.modal-container');
    const innerModal = document.querySelector('.inner-modal');
    let translations = ['']
    let descriptionValue = '';
    let disabled = '';
    let hidden = '';
    let wordValue = ''
    let noBorder = '';
    if(wordId > 0) {
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
    const authorContent = `<div class="modal-author">${authorTxt}: ${session.username}</div>`
    const inputsContainer = document.createElement('div');
    const wordContent = `<div class="modal-word">${wordTxt}: 
                           <input type="text" class="modal-native${noBorder}" id="word" value="${wordValue}" 
                           autocomplete="off" autofocus ${disabled}>
                         </div>`;
    const wordclassCheck = `<div class="modal-label">${wordclassTxt}: ${wordclass}</div>
                            <div ${hidden}>
                              <input type="radio" value="noun" name="class"> noun
                              <input type="radio" value="verb" name="class"> verb
                              <input type="radio" value="adjective" name="class"> adjective
                            </div>`
    const translation = `<div class="input-element">
                           <input type="text" class="modal-input${noBorder}" autocomplete="off" value="${translations[0]}" ${disabled}>
                           <button class="btn-modal btn-next" ${hidden}>+</button>
                         </div>`;

    const textArea = `<div class="modal-label">${descriptionTxt}</div>
                      <div class="modal-description">
                        <textarea class="modal-textarea" id="description" rows="3">${descriptionValue}</textarea>
                      </div>`;


    inputsContainer.insertAdjacentHTML('beforeend', translation)

    if (translations.length > 1) {
      for (let j = 1; j < translations.length; j++) {
        inputsContainer.insertAdjacentElement('beforeend', this.buildInput(translations[j]), disabled);
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
      this.createNewWord();
    })

    const quit = document.getElementById('quit');
    quit.addEventListener('click', () => {
      clearModal();
    })

    const clearModal = () => {
      innerModal.innerHTML = '';
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