import {getUsercontent} from "../functions/userContent.js";

const container = document.querySelector('.container');

export class ListView {

  constructor() {
    this.userId = localStorage.getItem('userId');
    this.username = localStorage.getItem('username');
  }

  buildTableElement = (headerContent, tableId) => {
    const table = document.createElement('div');
    table.className = 'table';
    table.id = tableId
    const tableHeader = `<span class="table__header">${headerContent}</span>`;
    table.insertAdjacentHTML('beforeend', tableHeader);
    return table
  }

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
  async createListContainer(firstBuild=false) {
    let content;
    if (firstBuild) {
      content = document.createElement('div');
      content.className = 'content';
    } else {
      content = document.querySelector('.content');
      content.innerHTML = '';
      const buttonElement = document.querySelector('.button-container');
      buttonElement.parentNode.removeChild(buttonElement);
    }

    const headerContent1 = (localStorage.getItem('lang') === 'en') ? `by ${this.username}` : `Von ${this.username}`;
    const table1 = this.buildTableElement(headerContent1,'table1');

    const headerContent2 = (localStorage.getItem('lang') === 'en') ? `by all learners` : `Von allen Lernenden`;
    const table2 = this.buildTableElement(headerContent2, 'table2');

    const btnTxt1 = (localStorage.getItem('lang') === 'en') ? 'practice my vocabulary': 'meine Vokabeln üben';
    const btnTxt2 = (localStorage.getItem('lang') === 'en') ? 'practice all vocabulary': 'alle Vokabeln üben';

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

    container.insertAdjacentElement('beforeend', content);
    // container.insertAdjacentElement('beforeend', this.buildButtonElements());
  }

  //info Listenansicht: allUsers=false - mein Heft, =true - von allen Usern
  async getLatestEntries(allUsers = false) {
    let lastestEntriesId = 'user-table;';
    let dataId = 'word-id';
    let myContent;
    if (allUsers) {
      //info myContent wird benötigt um zu checken ob eine Vokabel schon im Heft ist
      myContent = await getUsercontent(false)
      lastestEntriesId = 'all-users-table';
      dataId = 'all-words-id'
    }
    const userContent = await getUsercontent(allUsers);
    console.log(userContent);
    const latestEntries = document.createElement('div');
    latestEntries.className = 'latest-entries';
    latestEntries.id = lastestEntriesId;
    let row = '';
    const titleAdd = (localStorage.getItem('lang') === 'en') ? 'add to book': 'zum Heft hizufügen';
    const titleRemove = (localStorage.getItem('lang') === 'en') ? 'remove from book': 'aus Heft entfernen';
    const titleEdit = (localStorage.getItem('lang') === 'en') ? 'edit': 'bearbeiten';
    console.log(userContent);
    userContent.forEach((content, idx) => {
      let addedAt = content.created_at;
      addedAt = addedAt.split('-').reverse().join('.');
      row =
        `<div class="row">
           <div>
              <span class="word"  
               data-${dataId}="${content.word_id}" 
               data-wordclass="${content.wordclass}"
               data-author-name="${content.author_name}">
                ${idx + 1}. ${content.word} (${content.wordclass.slice(0, 1)})
              </span>
            </div>
           <div>
              <span class="date"> ${addedAt}</span>
              <span class="author"> (${content.author_name})</span>`;
      if (allUsers) {
        //info Überprüfung ob das Wort schon im Heft ist, Auswahl der Buttons
        const result = this.checkUserContent(myContent, content.word_id);
        if(result === true){
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
        row +=
          `<button class="edit" data-edit-word-id="${content.word_id}"
                                data-edit-word="${content.word}"
                                data-edit-wordclass="${content.wordclass}"
                                data-edit-author-name="${content.author_name}"
                                
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

  checkUserContent = (myContent, wordId) => {
    let result = false;
    myContent.forEach(content => {
      if (content.word_id === wordId) {
        result = true;
      }
    })
    return result;
  }

  // getUsercontent = async (allUsers) => {
  //   const lang = localStorage.getItem('lang');
  //   let fetchId = this.userId;
  //   if (allUsers) {
  //     fetchId = 0;
  //   }
  //   try {
  //     const formData = new FormData();
  //     formData.append('action', 'getUserContent');
  //     formData.append('userId', fetchId);
  //     formData.append('lang', lang);
  //     const response = await fetch(urlActionSwitch, {
  //       body: formData,
  //       method: 'POST'
  //     });
  //     return await response.json();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}