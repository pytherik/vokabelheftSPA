import {urlActionSwitch} from "../config.js";
import {loadStartPage} from "../functions/loadStartPage.js";

export class CrudView {

  buildInput = (value='') => {
    const translationEl = document.createElement('div');
    translationEl.className = 'input-container';

    const translation = `<div class="input-element">
                           <input type="text" class="modal-translation" value="${value}">
                            <button class="btn-modal btn-delete">-</button>
                          </div>`;

    translationEl.insertAdjacentHTML('beforeend', translation);
    return translationEl;
  }

  async editOrCreateWord(wordId=0) {

    console.log('okay clicked');
    const word = document.getElementById('word');
    const description = document.querySelector('.description');
    const translations = document.querySelectorAll('.modal-translation');
    translations.forEach(tr => {
      console.log(tr.value);
    })
    console.log(word.value);
    console.log(description.value);
   }

  buildCreateForm(author=localStorage.getItem('username'),wordId=0, word='', wordclass, translations=[''], description='') {
    const modal = document.querySelector('.modal-container');
    const innerModal = document.querySelector('.inner-modal');
    modal.style.display = 'block';

    const quitButton  = `<img src="../../assets/images/icons/quit.png" id="quit" alt="quit">`;
    let i = 0;
    const authorContent = `<div class="modal-author">Author: ${author}</div>`
    const inputsContainer = document.createElement('div');
    const wordContent = `<div>New Word: 
                           <input type="text" class="modal-word" id="word" value="${word}">
                         </div>`;

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
    innerModal.insertAdjacentElement('beforeend', inputsContainer);
    innerModal.insertAdjacentElement('beforeend', textArea);
    innerModal.insertAdjacentElement('beforeend', submit);

    //info hinzufügen einer weiteren Übersetzung
    const nextButton = document.querySelector('.btn-next');
    nextButton.addEventListener('click', () => {
      i++;
      inputsContainer.insertAdjacentElement('beforeend', this.buildInput());
      //info Eventlistener zum Entfernen von Einträgen
      const deletes = document.querySelectorAll('.btn-delete');
      const allInputs = document.querySelectorAll('.input-element');

      deletes.forEach((del, idx) => {
        del.addEventListener('click', () => {
          allInputs[idx].remove();
          console.log(idx);
        })
      })
    })

    submit.addEventListener('click', () => {
      this.editOrCreateWord(wordId);
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