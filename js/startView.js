  import {container} from './domElements.js'
import {title} from "./domElements.js";

export class StartPage {

  constructor() {
  this.userId = localStorage.getItem('userId');
  this.username = localStorage.getItem('username');
  }

  async createUserListContainer(benutzer) {
    const table = `<div class="table"><span class="table__header>">Von ${benutzer}</span>
     <div id="user-table" class="latest-entries"></div></div>`
    container.insertAdjacentHTML('beforeend', table);
    await this.getUsercontent();
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
    } catch (error) {
      console.log(error);
    }
  }
}