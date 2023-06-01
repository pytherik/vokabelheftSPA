import {container} from './domElements.js'
import {title} from "./domElements.js";

export class StartPage {
  createUserListContainer(benutzer) {
    const table = `<div class="table"><span class="table__header>">Von ${benutzer}</span>`;
    const userTable = `<div id="user-table" class="latest-entries"></div></div>`
    container.insertAdjacentHTML('beforeend', table);
    container.insertAdjacentHTML('beforeend', userTable);
  }
}