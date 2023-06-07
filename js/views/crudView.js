import {urlActionSwitch} from "../config.js";
import {loadStartPage} from "../functions/loadStartPage.js";

export class CrudView {
  async createNewWord() {
    console.log('urein createNewWord');
    const modal = document.querySelector('.modal-container');
    const innerModal = document.querySelector('.inner-modal');
    modal.style.display = 'block';

    const quitButton  = `<img src="../../assets/images/icons/quit.png" id="quit" alt="quit">`;
    const formContainer = document.createElement('div');
    formContainer.className = 'modal-form-container';

    let i = 0;
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container'
    const authorField = `<div class="modal-author">Author: ${localStorage.getItem('username')}</div>`
    const wordField = `<label for="word">Neues Wort:</label>
                        <input type="text" class="modal-input" id="word" data-input-id="${i}"><br>`
    const tralsationsField = `<div>
                                <label for="t1">1.</label>
                                <input class="modal-input" id="t1">
                                <button class="modal-button"> + </button>
                                <button class="modal-button"> - </button>
                              </div>
                              <div hidden>
                                <label for="t2">2.</label>
                                <input class="modal-input" id="t2">
                                <button class="modal-button"> + </button>
                                <button class="modal-button"> - </button>
                              </div>
                              <div hidden><label for="t3">3.</label>
                                <input class="modal-input" id="t3">
                                <button class="modal-button"> + </button>
                                <button class="modal-button"> - </button>
                               </div>`;

    inputContainer.insertAdjacentHTML('beforeend',wordField);

    inputContainer.insertAdjacentHTML('beforeend', tralsationsField);
    const textArea = document.createElement('textarea');
    textArea.className = 'description';
    textArea.setAttribute('cols', '30');
    textArea.setAttribute('rows', '5');

    formContainer.insertAdjacentElement('beforeend', inputContainer);
    formContainer.insertAdjacentElement('beforeend', textArea);

    innerModal.insertAdjacentHTML('beforeend', quitButton);
    innerModal.insertAdjacentHTML('beforeend', authorField);
    innerModal.insertAdjacentElement('beforeend', formContainer);

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