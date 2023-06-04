const container = document.querySelector('.container');

export class ListView {

  constructor() {
    this.userId = localStorage.getItem('userId');
    this.username = localStorage.getItem('username');
    this.lang = localStorage.getItem('lang');
  }
  buildTableElement = (headerContent) => {
    const table = document.createElement('div');
    table.className = 'table';
    const tableHeader = `<span class="table__header">Von ${headerContent}</span>`;
    table.insertAdjacentHTML('beforeend',tableHeader);
    return table
  }

  async createListContainer() {
    const content = document.createElement('div');
    content.className = 'content';
    let table = this.buildTableElement(this.username);

    //info get all for user
    let latestEntries = await this.getLatestEntries()
    table.insertAdjacentElement('beforeend', latestEntries);
    content.insertAdjacentElement('beforeend', table);
    table = this.buildTableElement(' allen Lernenden');

    // info get all for all users
    latestEntries = await this.getLatestEntries(true)
    table.insertAdjacentElement('beforeend', latestEntries);
    content.insertAdjacentElement('beforeend', table);

    container.insertAdjacentElement('beforeend', content);
  }

   async getLatestEntries(allUsers=false) {
    let lastestEntriesId = 'user-table;'
    if(allUsers) {
       lastestEntriesId = 'all-users-table';
    }
    const userContent = await this.getUsercontent(allUsers);
    console.log(userContent);
    const latestEntries = document.createElement('div');
    latestEntries.className = 'latest-entries';
    latestEntries.id = lastestEntriesId;
    userContent.forEach((content, idx) => {
      let addedAt = content.created_at;
      addedAt = addedAt.split('-').reverse().join('.');
      latestEntries.insertAdjacentHTML('beforeend',
        `<div class="row">
           <div><span class="word" data-id="${content.word_id}">${idx+1}. ${content.word} (${content.wordclass.slice(0,1)})</span></div>
           <div><span class="date"> ${addedAt}</span><span class="author"> (${content.author_name})</span>
           <button class="edit">&#10000;</button>
           <button class="delete">&#10006;</button></div>
         </div>`)
    });
    return latestEntries;
  }


  getUsercontent = async (allUsers) => {
    let fetchId = this.userId;
    if (allUsers) {
      fetchId = 0;
    }
    try {
      const url = '//localhost:63342/vokabelheftSPA/actionSwitch.php';
      const formData = new FormData();
      formData.append('action', 'getUserContent');
      formData.append('userId', fetchId);
      formData.append('lang', this.lang);
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