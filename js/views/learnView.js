import {urlActionSwitch} from "../config.js";

const container = document.querySelector('.container');

export class LearnView {
  constructor() {
    this.userId = localStorage.getItem('userId');
    this.username = localStorage.getItem('username');
    this.registeredAt = localStorage.getItem('registeredAt');
    this.date = localStorage.getItem('date');
  }

  buildTableElement = (headerContent, tableId) => {
    const table = document.createElement('div');
    table.className = 'stats-table';
    table.id = tableId;
    const tableHeader = `<span class="stats-table__header">${headerContent}</span>`;
    table.insertAdjacentHTML('beforeend', tableHeader);
    return table
  }


  async createStatisticsContainer() {
    let content;
    content = document.createElement('div');
    content.className = 'content';
    const todayAt = this.date.split(' ');
    const today = todayAt[0].split('-').reverse().join('.');
    const time = todayAt[1];

    const firstDayAt = this.registeredAt.split(' ');
    const firstDay = firstDayAt[0].split('-').reverse().join('.');
    const firstTime = firstDayAt[1];

    const headerContent1 = (localStorage.getItem('lang') === 'en') ? `of ${today} at ${time}` : `Von ${today} um ${time}`;
    const table1 = this.buildTableElement(headerContent1, 'stats-today');

    const headerContent2 = (localStorage.getItem('lang') === 'en') ? `since ${firstDay}, ${firstTime} until today` : `seit ${firstDay}, ${firstTime} bis heute`;
    const table2 = this.buildTableElement(headerContent2, 'stats-total');


    // info Statistik aufbauen für Session heute
    let latestStats = await this.getLatestStats(this.date);
    table1.insertAdjacentElement('beforeend', latestStats);
    content.insertAdjacentElement('beforeend', table1);

    // info Statistik aufbauen alle Sessions
    latestStats = await this.getLatestStats('0');

    table2.insertAdjacentElement('beforeend', latestStats);
    content.insertAdjacentElement('beforeend', table2);

    content.insertAdjacentElement('beforeend', table1)
    content.insertAdjacentElement('beforeend', table2)
    container.insertAdjacentElement('beforeend', content);


  }

  getLatestStats = async(date) => {
    const latestStats = document.createElement('div');
    latestStats.className = 'latest-stats';

    let statistics = await this.getStatistics(date);
    const rightTxt = (localStorage.getItem('lang') === 'en') ? 'Right' : 'Richtig';
    const wrongTxt = (localStorage.getItem('lang') === 'en') ? `Wrong ` : 'Falsch ';
    const stats = `<div class="is-right"><span>${rightTxt}:</span><span> ${statistics[0]}</span></div>
                   <div class="is-wrong"><span>${wrongTxt}:</span><span> ${statistics[1]-statistics[0]}</span></div>
                   <div class="total-stat"><span>Total&nbsp;&nbsp;&nbsp;:</span><span> ${statistics[1]}</span></div>`

    latestStats.insertAdjacentHTML('beforeend', stats);
    return latestStats;
  }

  getStatistics = async (date) => {
    try {
      const formData = new FormData();
      formData.append('action', 'getStatistics');
      formData.append('userId', this.userId);
      formData.append('date', date);
      const response = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      })
      return await response.json();
    } catch (error) {
      console.log(error);
    }

  }
}