import {session, urlActionSwitch} from "../config.js";
import {loadStartPage} from "../functions/loadStartPage.js";

export class CrudView {

  buildInput = (value = '') => {
    const translationEl = document.createElement('div');
    translationEl.className = 'input-container';

    const translation = `<div class="input-element additional">
                           <input type="text" class="modal-translation" value="${value}">
                            <button class="btn-modal btn-delete">-</button>
                          </div>`;

    translationEl.insertAdjacentHTML('beforeend', translation);
    return translationEl;
  }

  async editDescripion(wordId, wordclass, authorName, translation, description){
    const lang = localStorage.getItem('lang');
    const vonBy = (lang === 'en') ? 'by': 'von';
    const descriptionTxt = (lang === 'en') ? 'edit Description:' : 'Beschreibung ändern:';
    const btnTxt = (lang === 'en') ? 'submit': 'übernehmen';
    if (lang === 'de') {
      if (wordclass === 'verb') wordclass = 'Verb';
      if (wordclass === 'noun') wordclass = 'Substantiv';
      if (wordclass === 'adjective') wordclass = 'Adjektiv';
    }
    const translationsTxt = (lang === 'en') ? 'Translations': 'Überstzungen';
    const modal = document.querySelector('.modal-container');
    const innerModal = document.querySelector('.inner-modal');
    modal.style.display = 'block';
    let modalContent = `<img src="../../assets/images/icons/quit.png" id="quit" alt="quit">
                        <div class="modal-author">${vonBy} ${authorName}</div>
                        <div>
                          <span class="modal-word">${translation.word}</span> 
                          <span class="modal-wordclass"> <i>(${wordclass})</i>:</span>
                        </div>
                        <div class="modal-translation">${translationsTxt}:</div>
                        <ul class="translation">`;
    translation.translations.forEach(translation => {
    modalContent +=  `<li class="modal-word">${translation}</li>`;
    })
    modalContent += `</ul>
                     <div class="modal-description">${descriptionTxt}</div>
                     <div class="modal-description">
                       <textarea class="description" id="description">${description}</textarea>
                     </div>
                     <div class="modal-submit">
                       <button id="submit">${btnTxt}</button>
                     </div>`;

    innerModal.insertAdjacentHTML('beforeend', modalContent);

    const btnSubmit = document.getElementById('submit');
    btnSubmit.addEventListener('click', async () => {
      try {
        const formData = new FormData();
        const newDescription = document.getElementById('description').value;
        formData.append('action', 'editDescription');
        formData.append('description', newDescription);
        formData.append('userId', session.userId);
        formData.append('wordId', wordId);
        formData.append('lang', lang);
        const result = await fetch(urlActionSwitch, {
          body: formData,
          method: 'POST'
        })
        const data = await result.json();
      } catch (error) {
        console.log(error);
      }
    })
    const quit = document.getElementById('quit');
    quit.addEventListener('click', () => {
      innerModal.innerHTML = '';
      modal.style.display = 'none';
    })
  }

  async createNewWord(wordId = 0) {

    console.log('okay clicked');
    const word = document.getElementById('word').value;
    const wordclass = document.querySelector(`input[name="class"]:checked`).value;
    const translations = document.querySelectorAll('.modal-translation');
    const translationsArr = [];
    translations.forEach(tr => {
      translationsArr.push(tr.value);
    })
    const description = document.querySelector('.description').value;
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


  buildCreateForm(author = session.username, wordId = 0, word = '', wordclass, translations = [''], description = '') {
    const lang = localStorage.getItem('lang');
    const wordTxt = (lang === 'en') ? 'New word' : 'Neues Wort';
    const authorTxt = (lang === 'en') ? 'Author': 'Autor';
    const wordclassTxt = (lang === 'en') ? 'Wordclass' : 'Wortart';
    const descriptioTxt = (lang === 'en') ? 'Description': 'Beschreibung';
    const modal = document.querySelector('.modal-container');
    const innerModal = document.querySelector('.inner-modal');
    modal.style.display = 'block';

    const quitButton = `<img src="../../assets/images/icons/quit.png" id="quit" alt="quit">`;
    const authorContent = `<div class="modal-author">${authorTxt}: ${author}</div>`
    const inputsContainer = document.createElement('div');
    const wordContent = `<div>${wordTxt}: 
                           <input type="text" class="modal-word" id="word" value="${word}">
                         </div>`;
    const wordclassCheck = `<div>${wordclassTxt}: </div>
                            <div>
                              <input type="radio" value="noun" name="class"> noun
                              <input type="radio" value="verb" name="class"> verb
                              <input type="radio" value="adjective" name="class"> adjective
                            </div>`
    const translation = `<div class="input-element">
                           <input type="text" class="modal-input" value="${translations[0]}">
                           <button class="btn-modal btn-next">+</button>
                         </div>`;

    const textArea = `<textarea class="description`;

    inputsContainer.insertAdjacentHTML('beforeend', translation)
    if (translations.length > 1) {
      for (let j = 1; j < translations.length; j++) {
        inputsContainer.insertAdjacentElement('beforeend', this.buildInput(translations[j]));
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
      this.createNewWord(wordId);
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