import {urlActionSwitch} from "../config.js";
import {loadStartPage} from "../functions/loadStartPage.js";

export class CrudView {

  buildInput = (value='') => {
    const translationEl = document.createElement('div');
    translationEl.className = 'input-container';

    const translation = `<div class="input-element additional">
                           <input type="text" class="modal-translation" value="${value}">
                            <button class="btn-modal btn-delete">-</button>
                          </div>`;

    translationEl.insertAdjacentHTML('beforeend', translation);
    return translationEl;
  }

  async createNewWord(wordId=0) {

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

  buildCreateForm(author=localStorage.getItem('username'),wordId=0, word='', wordclass, translations=[''], description='') {
    const modal = document.querySelector('.modal-container');
    const innerModal = document.querySelector('.inner-modal');
    modal.style.display = 'block';

    const quitButton  = `<img src="../../assets/images/icons/quit.png" id="quit" alt="quit">`;
    const authorContent = `<div class="modal-author">Author: ${author}</div>`
    const inputsContainer = document.createElement('div');
    const wordContent = `<div>New Word: 
                           <input type="text" class="modal-word" id="word" value="${word}">
                         </div>`;
    const wordclassCheck = `<div>Wortart: <br>
                         <input type="radio" value="noun" name="class"> noun
                         <input type="radio" value="verb" name="class"> verb
                         <input type="radio" value="adjective" name="class"> adjective
                       </div>`
    const translation = `<div class="input-element">
                           <input type="text" class="modal-translation" value="${translations[0]}">
                           <button class="btn-modal btn-next">+</button>
                         </div>`;

    inputsContainer.insertAdjacentHTML('beforeend', translation)
    if (translations.length > 1) {
      for (let j = 1; j < translations.length; j++) {
        inputsContainer.insertAdjacentElement('beforeend', this.buildInput(translations[j]));
      }
    }

    const textArea = document.createElement('textarea');
    textArea.className = 'description';
    textArea.setAttribute('rows', '5');
    textArea.value = description;

    const submit = document.createElement('button');
    submit.className = 'btn-submit';
    submit.innerText = 'okay';


    innerModal.insertAdjacentHTML('beforeend', quitButton);
    innerModal.insertAdjacentHTML('beforeend', authorContent);
    innerModal.insertAdjacentHTML('beforeend', wordContent);
    innerModal.insertAdjacentHTML('beforeend', wordclassCheck);
    innerModal.insertAdjacentElement('beforeend', inputsContainer);
    innerModal.insertAdjacentElement('beforeend', textArea);
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