import {container} from './domElements.js'
import {title} from "./domElements.js";

export class StartView {

  constructor() {
    this.userId = localStorage.getItem('userId');
    this.username = localStorage.getItem('username');
  }

  async createUserListContainer() {
    const userContent = await this.getUsercontent();
    console.log(userContent);
    const table = document.createElement('div');
    table.className = 'table';
    const tableHeader = `<span class="table__header">Von ${this.username}</span>`;
    const latestEntries = document.createElement('div');
    latestEntries.className = 'latest-entries';
    latestEntries.id = 'user-table';
    const englishVocables = userContent.filter(content => content.english_id !== 0);
    console.log(englishVocables);
    const germanVocables =  userContent.filter(content => content.german_id !== 0);
    console.log(germanVocables);
    userContent.forEach((content) => {
      const word = content.word;
      latestEntries.insertAdjacentHTML('beforeend', `<span class="word"></span>${word}<span class="date">${content.added_at}</span>`)
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
      const content = await response.json();
      console.log(content);
      return content;
    } catch (error) {
      console.log(error);
    }
  }

  async getVocable(content) {

  }
}