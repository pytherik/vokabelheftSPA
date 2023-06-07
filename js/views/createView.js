import {urlActionSwitch} from "../config.js";
import {loadStartPage} from "../functions/loadStartPage.js";

export class CreateView {

  async addWordToUserPool(wordId, description='') {
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

    addDescription = (wordId, lang) => {
      let description = '';
      const text = lang === 'en' ? 'You may add a description:' : 'Du kannst eine Beschreibung hinzufügen:'
      const modal = document.querySelector('.modal-container');
      const innerModal = document.querySelector('.inner-modal');
      modal.style.display = 'block';
      let modalContent = `<div class="addDescription">${text}</div>`
      modalContent += `<input type="text" id="description">`;
      modalContent += `<button type="submit" id="add">okay</button>`;
      innerModal.insertAdjacentHTML('beforeend', modalContent);
      const add = document.getElementById('add');

      const clearModal = () => {
        innerModal.innerHTML = '';
        modal.style.display = 'none';
      }

      add.addEventListener('click', (e) => {
        e.preventDefault();
        description = document.getElementById('description').value;
        clearModal();
        this.addWordToUserPool(wordId, description);
      })
    }
}