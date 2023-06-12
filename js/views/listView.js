import {urlActionSwitch} from "../config.js";

const container = document.querySelector('.container');

export class ListView {

  constructor() {
    this.userId = localStorage.getItem('userId');
    this.username = localStorage.getItem('username');
  }
  //info table-Elemente für Wortlisten erstellen
  buildTableElement = (headerContent, tableId) => {
    const table = document.createElement('div');
    table.className = 'table';
    table.id = tableId
    const tableHeader = `<span class="table__header">${headerContent}</span>`;
    table.insertAdjacentHTML('beforeend', tableHeader);
    return table
  }

  //info Üben-Buttons erstellen
  buildButtonElement = (btnText, idName) => {
    const buttonEl = document.createElement('div');
    buttonEl.className = 'button-container';
    const button = document.createElement('button');
    button.className = 'btn-green-big';
    button.id = idName;
    button.innerText = btnText;

    buttonEl.insertAdjacentElement('beforeend', button);
    return buttonEl;
  }

  //info Aufbauen der Inhalte für UserPool und Gesamt Inhalt
  async createListContainer() {
    //info content Container enthält die Wortlisten
    let content;
    content = document.createElement('div');
    content.className = 'content';

    //info Tabellenüberschriften nach Sprache erstellen
    const headerContent1 = (localStorage.getItem('lang') === 'en') ? `${this.username}` : `${this.username}`;
    const table1 = this.buildTableElement(headerContent1, 'table1');

    const headerContent2 = (localStorage.getItem('lang') === 'en') ? `all learners` : `allen Lernenden`;
    const table2 = this.buildTableElement(headerContent2, 'table2');

    //info Buttontext nach Sprache erstellen
    const btnTxt1 = (localStorage.getItem('lang') === 'en') ? 'practice my vocabulary' : 'meine Vokabeln üben';
    const btnTxt2 = (localStorage.getItem('lang') === 'en') ? 'practice all vocabulary' : 'alle Vokabeln üben';

    //info Tabelle aufbauen UserPool
    let latestEntries = await this.getLatestEntries()
    table1.insertAdjacentElement('beforeend', latestEntries);
    table1.insertAdjacentElement('beforeend', this.buildButtonElement(btnTxt1, 'btn-user'));
    content.insertAdjacentElement('beforeend', table1);

    // info Tabelle aufbauen Alle User
    latestEntries = await this.getLatestEntries(true)
    table2.insertAdjacentElement('beforeend', latestEntries);
    table2.insertAdjacentElement('beforeend', this.buildButtonElement(btnTxt2, 'btn-all-users'));
    content.insertAdjacentElement('beforeend', table2);

    //info Einfügen in Container-Element macht content Sichtbar
    container.insertAdjacentElement('beforeend', content);
  }

  //info Listenansicht für eigenes Heft (false) oder für alle User (true)
  async getLatestEntries(allUsers = false) {
    let lastestEntriesId = 'user-table;';
    let dataId = 'word-id';
    let myContent;
    if (allUsers) {
      //info zum setzten des plus Buttons oder des Häkchens wird myContent(eigenes Heft)
      // benötigt, um zu Prüfen ob die Vokabel schon im Heft ist
      myContent = await this.getUsercontent(false)
      //info setzten der Id's zur späteren Unterscheidung für die event listener
      lastestEntriesId = 'all-users-table';
      dataId = 'all-words-id'
    }

    //info allUsers wird beim erstellen der Tabellen zweimal aufgerufen
    // (true oder false in getLatestEntries gesetzt)
    const userContent = await this.getUsercontent(allUsers);
    const latestEntries = document.createElement('div');
    latestEntries.className = 'latest-entries';
    latestEntries.id = lastestEntriesId;
    let row = '';
    const titleAdd = (localStorage.getItem('lang') === 'en') ? 'add to book' : 'zum Heft hizufügen';
    const titleRemove = (localStorage.getItem('lang') === 'en') ? 'remove from book' : 'aus Heft entfernen';
    const titleEdit = (localStorage.getItem('lang') === 'en') ? 'edit' : 'bearbeiten';
    console.log(userContent[0])
    userContent.forEach((content, idx) => {
      let addedAt = content.created_at;
      addedAt = addedAt.split('-').reverse().join('.');
      row = `<div class="row">
               <div>
                 <span class="word" data-${dataId}="${content.word_id}" 
                                    data-wordclass="${content.wordclass}"
                                    data-author-name="${content.author_name}">
                    <span class="right">${('0' + Number(idx+1)).slice(-2)}.
                    <small><em>(${content.wordclass.slice(0, 1)})</em></small>
                    </span>
                    <span> ${content.word}</span>
                  </span>
                </div>
              <div>
                <span class="date"> ${addedAt}</span>
                <span class="author"> (${content.author_name})</span>`;

      if (allUsers) {
        //info Überprüfung ob das Wort schon im Heft ist, Auswahl der Buttons
        const result = this.checkUserContent(myContent, content.word_id);
        if (result === true) {
          row += `<span class="included">&#10004</span>
                </div>
              </div>`;
        } else {
          row += `<button class="add" data-add-word-id="${content.word_id}" title="${titleAdd}">
                    <img class="add-img" src="../../assets/images/icons/add.png" alt="add">
                  </button>
                </div>
              </div`;
        }
      } else {
        row += `<button class="edit" data-edit-word-id="${content.word_id}"
                                     data-edit-word="${content.word}"
                                     data-edit-wordclass="${content.wordclass}"
                                     data-edit-author-name="${content.author_name}"
                                     data-edit-author-id="${content.created_by}"
                                     title="edit word">
                  <img class="edit-img" src="../../assets/images/icons/edit2.png" alt="edit" title="${titleEdit}">
                </button>
                <button class="remove" data-remove-word-id="${content.id}" title="${titleRemove}">
                  <img class="remove-img" src="../../assets/images/icons/remove.png" alt="remove">
                </button>
              </div>
            </div>`
      }
      latestEntries.insertAdjacentHTML('beforeend', row);
    });
    //info bei einem leeren Heft bekommt der User eine Information
    if (row === '') {
      const message = (localStorage.getItem('lang') === 'en') ? 'Your Vocabulary Book is empty' : 'Dein Vokabelheft ist leer!';
      const text = (localStorage.getItem('lang') === 'en') ?
        `Create new vocabularies on your own or get some to your book by clicking the <img src="../assets/images/icons/add.png"> from all learners` :
        `Erstelle eigene Vokabeln oder klicke das <img src="../assets/images/icons/add.png"> von allen Lernenden und hole sie in dein Heft!!`;
      row = `<h2 class="message-empty">${message}</h2><div class="text-empty"><p>${text}</p></div>`;
      latestEntries.insertAdjacentHTML('beforeend', row);
    }

    return latestEntries;
  }

  //info Überprüfung der Vokabeln auf Vorhandensein im Heft
  checkUserContent = (myContent, wordId) => {
    let result = false;
    myContent.forEach(content => {
      if (content.word_id === wordId) {
        result = true;
      }
    })
    return result;
  }

  //info holen der Vokabeln aus der Datenbank
  getUsercontent = async (allUsers) => {
    const lang = localStorage.getItem('lang');
    let fetchId = this.userId;
    if (allUsers) {
      fetchId = 0;
    }
    try {
      const formData = new FormData();
      formData.append('action', 'getUserContent');
      formData.append('userId', this.userId);
      formData.append('fetchId', fetchId);
      formData.append('lang', lang);
      const response = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }
}