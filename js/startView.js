import {container} from './domElements.js'
import {title} from "./domElements.js";

export class StartView {

  constructor() {
    this.userId = localStorage.getItem('userId');
    this.username = localStorage.getItem('username');
  }

  async createUserListContainer() {
    let wordId = 0;
    let wordLang = '';
    const userContent = await this.getUsercontent();
    console.log(userContent);
    const table = document.createElement('div');
    table.className = 'table';
    const tableHeader = `<span class="table__header">Von ${this.username}</span>`;
    const latestEntries = document.createElement('div');
    latestEntries.className = 'latest-entries';
    latestEntries.id = 'user-table';
    let idx = 0;
    userContent.forEach((content, idx) => {
      let addedAt = content.added_at;
      addedAt = addedAt.split('-').reverse().join('.');
      const word = content.word;
      if(content.english_id !== 0) {
        wordId = content.english_id;
        wordLang = 'en';
      } else {
        wordId = content.german_id;
        wordLang = 'de';
      }
      const lang = 'en';
      latestEntries.insertAdjacentHTML('beforeend',
        `<div class="row">
           <span class="word" data-id="${wordId}" data-lang="${wordLang}">${idx+1}. ${word}</span>
           <div><span class="date">(${wordLang}) ${addedAt}</span>
           <button class="edit">&#10000;</button>
           <button class="delete">&#10006;</button></div>
         </div>`)
    });
    table.insertAdjacentHTML('beforeend',tableHeader);
    table.insertAdjacentElement('beforeend',latestEntries);
    container.insertAdjacentElement('beforeend', table);

  }

  async getUsercontent() {
    try {
      const url = '//localhost:63342/vokabelheftSPA/actionSwitch.php';
      const formData = new FormData();
      formData.append('action', 'getUserContent');
      formData.append('userId', this.userId);
      const response = await fetch(url, {
        body: formData,
        method: 'POST'
      });

      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }
}