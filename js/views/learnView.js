import {urlActionSwitch} from "../config.js";
import {loadLearnPage} from "../functions/loadLearnPage.js";
import {loadStartPage} from "../functions/loadStartPage.js";

const container = document.querySelector('.container');

export class LearnView {
  constructor(mode) {
    //info Boolean mode entscheidet ob Heft- oder alle Vokabeln gelernt werden (true = alle)
    this.mode = mode;
    this.userId = localStorage.getItem('userId');
    this.username = localStorage.getItem('username');
    this.registeredAt = localStorage.getItem('registeredAt');
    this.date = localStorage.getItem('date');
  }

  //info table-Elemente für Statistik Inhalte erstellen
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
    content.className = 'stats-content';

    //info heutiges Datum formatieren
    const todayAt = this.date.split(' ');
    const today = todayAt[0].split('-').reverse().join('.');
    const time = todayAt[1];

    //info Eintrittsdatum formatieren
    const firstDayAt = this.registeredAt.split(' ');
    const firstDay = firstDayAt[0].split('-').reverse().join('.');
    const firstTime = firstDayAt[1];

    //info Tabellenüberschriften hinzufügen
    const headerContent1 = (localStorage.getItem('lang') === 'en') ? `${today} at ${time}` : `${today} um ${time}`;
    const table1 = this.buildTableElement(headerContent1, 'stats-today');

    const headerContent2 = (localStorage.getItem('lang') === 'en') ? `since ${firstDay} until today` : `seit ${firstDay} bis heute`;
    const table2 = this.buildTableElement(headerContent2, 'stats-total');


    //info Statistik aufbauen für Session heute
    let latestStats = await this.getLatestStats(this.date);
    table1.insertAdjacentElement('beforeend', latestStats);
    content.insertAdjacentElement('beforeend', table1);

    //info Statistik aufbauen alle Sessions
    latestStats = await this.getLatestStats('0');

    table2.insertAdjacentElement('beforeend', latestStats);
    content.insertAdjacentElement('beforeend', table2);

    content.insertAdjacentElement('beforeend', table1)
    content.insertAdjacentElement('beforeend', table2)
    container.insertAdjacentElement('beforeend', content);
  }

  //info Statistikausgabe nach Datum liefern
  getLatestStats = async (date) => {
    const latestStats = document.createElement('div');
    latestStats.className = 'latest-stats';

    let statistics = await this.getStatistics(date);
    const rightTxt = (localStorage.getItem('lang') === 'en') ? 'Right' : 'Richtig';
    const wrongTxt = (localStorage.getItem('lang') === 'en') ? `Wrong ` : 'Falsch ';
    const stats = `<div class="is-right"><span>${rightTxt}</span><span> ${statistics[0]}</span></div>
                   <div class="is-wrong"><span>${wrongTxt}</span><span> ${statistics[1] - statistics[0]}</span></div>
                   <div class="total-stat"><span>Total</span><span> ${statistics[1]}</span></div>`

    latestStats.insertAdjacentHTML('beforeend', stats);
    return latestStats;
  }

  //info verschiedene DB Abfrage je nach Datum
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

  practice = async () => {
    const lang = localStorage.getItem('lang');
    const questContainer = document.createElement('div');
    questContainer.className = 'question';
    //info hole Zufallswort
    const wordData = await this.getRandomWord();
    //info Textinhalte nach Sprachmodus festlegen
    let wordclassTxt = `Wordclass: ${wordData.wordclass}`;
    const word = wordData.word;
    let answerWarning = ''
    const to = (lang === 'en' && wordData.wordclass === 'verb') ? 'to ' : '';

    const questionTxt = (lang === 'en') ? 'What is the translation for the word' : 'Wie lautet die Übersetzung für';
    const checkAnswer = (lang === 'en') ? 'verify answer' : 'Antwort prüfen';

    if (lang === 'de') {
      if (wordclassTxt === 'Wordclass: noun') wordclassTxt = 'Wortart: Substantiv';
      if (wordclassTxt === 'Wordclass: verb') wordclassTxt = 'Wortart: Verb';
      if (wordclassTxt === 'Wordclass: adjective') wordclassTxt = 'Wortart: Adjektiv';
      if (wordclassTxt === 'Wordclass: other') wordclassTxt = 'Wortart: Andere';
    }

    //info Aufbau der Abfrage-Sektion
    const question = `<div class="wordclass">${wordclassTxt}</div>
                      <div class="question">${questionTxt}</div>
                      <div class="quest-word">${to}${word}</div>
                      <div class="answer"><input type="text" id="answer" autocomplete="off"></div>`;

    const submit = `<button class="btn-answer btn-green-big">${checkAnswer}</button>
                   <div class="answer-warning">
                     <span class="warning" id="answer-warning">${answerWarning}</span>
                   </div>`;
    questContainer.insertAdjacentHTML('beforeend', question);
    container.insertAdjacentElement('beforeend', questContainer);
    container.insertAdjacentHTML('beforeend', submit);

    //info Autofocus auf das Input-Feld legen
    document.getElementById('answer').focus();

    //info Prüfen ob etwas eingegeben wurde, Warnmitteilung geben
    const answerButton = document.querySelector('.btn-answer');
    answerButton.addEventListener('click', () => {
      const answer = document.getElementById('answer').value;
      if (answer.length > 0) {
        document.getElementById('answer-warning').innerText = '';
        this.verifyAnswer(wordData, answer);
      } else {
        answerWarning = (localStorage.getItem('lang') === 'en') ?
          'your answer must not be empty' :
          'deine Antwort darf nicht leer sein!';
        document.getElementById('answer-warning').innerText = answerWarning;
      }
    });
  }

  //info Zufallswort aus DB holen
  getRandomWord = async () => {
    try {
      const mode = this.mode ? 'true' : 'false';
      const formData = new FormData();
      formData.append('action', 'getRandomWord');
      formData.append('userId', localStorage.getItem('userId'));
      formData.append('lang', localStorage.getItem('lang'))
      formData.append('mode', mode);
      const response = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      })
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  //info die Antwort prüfen und Success-Modale aufrufen
  verifyAnswer = async (wordData, answer) => {
    if (answer.split(' ')[0] === 'to') answer = answer.split(' ')[1];
    if (wordData.translations.includes(answer)) {
      await this.updateStatistics(wordData, true);
      this.showSuccess(wordData, answer, true);
    } else {
      await this.updateStatistics(wordData, false);
      this.showSuccess(wordData, answer, false);
    }
  }

  //info Ergebnis in DB statistics Tabelle speichern
  updateStatistics = async (wordData, isCorrect) => {
    const isRight = isCorrect ? 'true' : 'false';
    try {
      const formData = new FormData();
      formData.append('action', 'updateStatistics');
      formData.append('userId', localStorage.getItem('userId'));
      formData.append('lang', localStorage.getItem('lang'));
      formData.append('isRight', isRight);
      formData.append('wordId', wordData.id);
      formData.append('date', localStorage.getItem('date'));
      const response = await fetch(urlActionSwitch, {
        body: formData,
        method: 'POST'
      })
      // return await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  //info Success-Modal erstellen
  showSuccess = (wordData, answer, isCorrect) => {
    const lang = localStorage.getItem('lang');
    let heading = '';
    let comment = '';
    let hint = '';
    let to = '';
    //info Boolean isCorrect entscheidet über Inhalt, Inhalt nach Sprache erzeugen
    if (isCorrect) {
      if (lang === 'de' && wordData.wordclass === 'verb') to = 'to ';
      heading = (lang === 'en') ? 'Congratulations!' : 'Glückwunsch!';
      comment = (lang === 'en') ?
        `${to}${answer} is correct!` : `${to}${answer} ist korrekt!`
      if (wordData.translations.length > 1) {
        hint = (lang === 'en') ?
          `There are further translations for the word` :
          `Es gibt noch mehr Übersetzungen für das Wort`;
      } else {
        hint = (lang === 'en') ?
          `No further translations for!` :
          `Keine weiteren Übersetzungen für`;
      }
    } else {
      hint = (lang === 'en') ?
        `Correct translation(s) for:` :
        `Korrekte Übersetzung(en) für`;

      heading = (lang === 'en') ? 'WTF!' : 'Hmpf!';
      comment = (lang === 'en') ?
        `${to}${answer} is wrong!` : `${to}${answer} ist falsch!`
    }

    const nextBtnTxt = (lang === 'en') ? 'go on' : 'weiter';
    const backBtnTxt = (lang === 'en') ? 'stop it' : 'aufhören';
    to = '';
    //info DOM Modal Elemente holen und Inhalte einfügen
    const modal = document.querySelector('.modal-container');
    modal.style.display = 'block';
    const innerModal = document.querySelector('.inner-modal');
    if (lang === 'en' && wordData.wordclass === 'verb') to = 'to ';
    innerModal.className = 'inner-success-modal';
    let modalContent = `<div><h1 class="success-heading">${heading}</h1>
                        <div class="success-comment"><h2>${comment}</h2></div>
                        <div class="success-hint">${hint}</div>
                        <div class="success-word">${to}${wordData.word}</div></div>`;
    //info wenn Antwort richtig war nur weitere Übersetzungen anzeigen, sonst alle
    if (isCorrect && wordData.translations.length > 1 || !isCorrect) {
      if (lang === 'de' && wordData.wordclass === 'verb') to = 'to ';
      modalContent += `<div><ul class="modal-list">`;
      for (let i = 0; i < wordData.translations.length; i++) {
        if (wordData.translation !== answer){
          modalContent += `<li class="list-item">${to}${wordData.translations[i]}</li>`;
        }
      }
      modalContent += `</ul></div>`;
    }
    modalContent += `<div class="modal-buttons">
                       <button class="btn-success" id="next-btn">${nextBtnTxt}</button>
                       <button class="btn-success" id="back-btn">${backBtnTxt}</button></div></div>`;
    innerModal.insertAdjacentHTML('beforeend', modalContent);
    modal.insertAdjacentElement('beforeend', innerModal);
    if (isCorrect) {
      document.querySelector('.success-comment').classList.remove('wrong');
      document.querySelector('.success-comment').classList.add('correct');
    } else {
      document.querySelector('.success-comment').classList.remove('correct');
      document.querySelector('.success-comment').classList.add('wrong');
    }
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    //info Fokus auf Weiterlernen legen, je nach click verschiedene Seiten (learn oder start aufrufen)
    nextBtn.focus();
    nextBtn.addEventListener('click', async () => {
      this.clearModal();
      await loadLearnPage(this.mode);
    })
    backBtn.addEventListener('click', async () => {
      this.clearModal();
      await loadStartPage();
    })
  }

  //info Funktion löscht Modal und setzt die css Klasse auf Original zurück (.inner-modal)
  clearModal = () => {
    const modal = document.querySelector('.modal-container');
    const innerModal = document.querySelector('.inner-success-modal');
    innerModal.innerHTML = '';
    //info className zurücksetzten, damit querySelect funktioniert
    // (wurde in inner-show-modal geändert, um Darstellung anzupassen)
    innerModal.className = 'inner-modal';
    modal.style.display = 'none';
  }
}