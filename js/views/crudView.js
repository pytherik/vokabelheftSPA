import {urlActionSwitch} from "../config.js";
import {loadStartPage} from "../functions/loadStartPage.js";

export class CrudView {

  buildInput = (num) => {
    const translationEl = document.createElement('div');
    translationEl.className = 'input-container';

    const translation = `<div class="input-element"><input type="text" class="modal-translation" data-input-id="${num}">
                   <button class="btn-modal btn-delete">-</button></div>`

    translationEl.insertAdjacentHTML('beforeend', translation);
    return translationEl;
  }

  async createNewWord() {
    console.log('okay clicked');
    const word = document.getElementById('word');
    const translations = document.querySelectorAll('.modal-translation');
    translations.forEach(tr => {
      console.log(tr.value);
    })
    console.log(word.value);
   }

  buildCreateForm() {
    const modal = document.querySelector('.modal-container');
    const innerModal = document.querySelector('.inner-modal');
    modal.style.display = 'block';

    const quitButton  = `<img src="../../assets/images/icons/quit.png" id="quit" alt="quit">`;
    let i = 0;
    const author = `<div class="modal-author">Author: ${localStorage.getItem('username')}</div>`
    const inputs = document.createElement('div');
    const word = `<div>New Word: <input type="text" class="modal-word" id="word"></div>`
    const translation = `<div class="input-element"></div><input type="text" class="modal-translation" id="word" data-input-id="${i}">
                   <button class="btn-modal btn-next">+</button></div>`

    inputs.insertAdjacentHTML('beforeend', translation)



    const textArea = document.createElement('textarea');
    textArea.className = 'description';
    textArea.setAttribute('rows', '5');

    const submit = document.createElement('button');
    submit.className = 'btn-submit';
    submit.innerText = 'okay';

    innerModal.insertAdjacentHTML('beforeend', quitButton);
    innerModal.insertAdjacentHTML('beforeend', author);
    innerModal.insertAdjacentHTML('beforeend', word);
    innerModal.insertAdjacentElement('beforeend', inputs);
    innerModal.insertAdjacentElement('beforeend', textArea);
    innerModal.insertAdjacentElement('beforeend', submit);

    const nextButton = document.querySelector('.btn-next');
    nextButton.addEventListener('click', () => {
      i++;
      inputs.insertAdjacentElement('beforeend', this.buildInput(i))
      const deletes = document.querySelectorAll('.btn-delete')
      const allInputs = document.querySelectorAll('.input-element');

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