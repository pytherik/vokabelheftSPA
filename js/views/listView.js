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
    const tableHeader = `<span class="table__header">Von ${headerContent}</span>`;
    table.insertAdjacentHTML('beforeend', tableHeader);
    return table
  }
  buildButtonElements = () => {
    const container = document.querySelector('.container');

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    const learnUserContent = `<button class="btn-green-big" id="btn-user">meine Vokabeln üben</button>`;
    const learnAllUsersContent = `<button class="btn-green-big" id="btn-all-users">alle Vokabeln üben</button>`;

    buttonContainer.insertAdjacentHTML('beforeend', learnUserContent);
    buttonContainer.insertAdjacentHTML('beforeend', learnAllUsersContent);

    return buttonContainer;
  }

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
    const table1 = this.buildTableElement(this.username, 'table1');
    const table2 = this.buildTableElement(' allen Lernenden', 'table2');

    //info get all for user
    let latestEntries = await this.getLatestEntries()
    table1.insertAdjacentElement('beforeend', latestEntries);
    content.insertAdjacentElement('beforeend', table1);

    // info get all for all users
    latestEntries = await this.getLatestEntries(true)
    table2.insertAdjacentElement('beforeend', latestEntries);
    content.insertAdjacentElement('beforeend', table2);

    container.insertAdjacentElement('beforeend', content);
    container.insertAdjacentElement('beforeend', this.buildButtonElements());
  }

  async getLatestEntries(allUsers = false) {
    let lastestEntriesId = 'user-table;';
    let dataId = 'word-id';
    let myContent;
    if (allUsers) {
      myContent = await this.getUsercontent(false)
      lastestEntriesId = 'all-users-table';
      dataId = 'all-words-id'
    }
    const userContent = await this.getUsercontent(allUsers);
    console.log(userContent);
    const latestEntries = document.createElement('div');
    latestEntries.className = 'latest-entries';
    latestEntries.id = lastestEntriesId;
    let row = '';
    userContent.forEach((content, idx) => {
      let addedAt = content.created_at;
      addedAt = addedAt.split('-').reverse().join('.');
      row =
        `<div class="row">
           <div><span class="word" data-${dataId}="${content.word_id}">${idx + 1}. ${content.word} (${content.wordclass.slice(0, 1)})</span></div>
           <div><span class="date"> ${addedAt}</span><span class="author"> (${content.author_name})</span>`;
      if (allUsers) {
        const result = this.checkUserContent(myContent, content.word_id);
        if(result === true){
          row += `<span class="remove">&#10004</span></div></div>`;
        } else {
          row += `<button class="add">+</button></div></div`;
        }
      } else {
        row +=
          `<button class="edit">&#10000;</button>
           <button class="delete">&#10006;</button></div>
         </div>`

      }

      latestEntries.insertAdjacentHTML('beforeend', row);
    });
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

  getUsercontent = async (allUsers) => {
    const lang = localStorage.getItem('lang');
    let fetchId = this.userId;
    if (allUsers) {
      fetchId = 0;
    }
    try {
      const url = '//localhost:63342/vokabelheftSPA/actionSwitch.php';
      const formData = new FormData();
      formData.append('action', 'getUserContent');
      formData.append('userId', fetchId);
      formData.append('lang', lang);
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