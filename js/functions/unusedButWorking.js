//info wurde in CrudView verwendet, als Prompt von add action
addDescription = (wordId, lang) => {
  let description = '';
  const text = lang === 'en' ? 'You may add a description:' : 'Du kannst eine Beschreibung hinzufügen:'
  const modal = document.querySelector('.modal-container');
  const innerModal = document.querySelector('.inner-modal');
  modal.style.display = 'block';
  let modalContent = `<div class="addDescription">${text}</div>`
  modalContent += `<input type="text" id="description">`;
  modalContent += `<button type="submit" id="add">okay</button>`;
  innerModal.insertAdjacentHTML('beforeend', modalContent);
  const add = document.getElementById('add');

  const clearModal = () => {
    innerModal.innerHTML = '';
    modal.style.display = 'none';
  }

  add.addEventListener('click', (e) => {
    e.preventDefault();
    description = document.getElementById('description').value;
    clearModal();
    this.addWordToUserPool(wordId, description);
  })
}
// async editDescripion(wordId, wordclass, authorName, translation, description){
//   const lang = localStorage.getItem('lang');
//   const vonBy = (lang === 'en') ? 'by': 'von';
//   const descriptionTxt = (lang === 'en') ? 'edit Description:' : 'Beschreibung ändern:';
//   const btnTxt = (lang === 'en') ? 'submit': 'übernehmen';
//   if (lang === 'de') {
//     if (wordclass === 'verb') wordclass = 'Verb';
//     if (wordclass === 'noun') wordclass = 'Substantiv';
//     if (wordclass === 'adjective') wordclass = 'Adjektiv';
//   }
//   const translationsTxt = (lang === 'en') ? 'Translations': 'Überstzungen';
//   const modal = document.querySelector('.modal-container');
//   const innerModal = document.querySelector('.inner-modal');
//   modal.style.display = 'block';
//   let modalContent = `<img src="../../assets/images/icons/quit.png" id="quit" alt="quit">
//                       <div class="modal-author">${vonBy} ${authorName}</div>
//                       <div>
//                         <span class="modal-word">${translation.word}</span>
//                         <span class="modal-wordclass"> <i>(${wordclass})</i>:</span>
//                       </div>
//                       <div class="modal-translation">${translationsTxt}:</div>
//                       <ul class="translation">`;
//   translation.translations.forEach(translation => {
//   modalContent +=  `<li class="modal-word">${translation}</li>`;
//   })
//   modalContent += `</ul>
//                    <div class="modal-description">${descriptionTxt}</div>
//                    <div class="modal-description">
//                      <textarea class="description" id="description" rows="3">${description}</textarea>
//                    </div>
//                    <div class="modal-submit">
//                      <button id="submit">${btnTxt}</button>
//                    </div>`;
//
//   innerModal.insertAdjacentHTML('beforeend', modalContent);
//
//   const btnSubmit = document.getElementById('submit');
//   btnSubmit.addEventListener('click', async () => {
//     try {
//       const formData = new FormData();
//       const newDescription = document.getElementById('description').value;
//       formData.append('action', 'editDescription');
//       formData.append('description', newDescription);
//       formData.append('userId', session.userId);
//       formData.append('wordId', wordId);
//       formData.append('lang', lang);
//       const result = await fetch(urlActionSwitch, {
//         body: formData,
//         method: 'POST'
//       })
//       const data = await result.json();
//     } catch (error) {
//       console.log(error);
//     }
//   })
//   const quit = document.getElementById('quit');
//   quit.addEventListener('click', () => {
//     innerModal.innerHTML = '';
//     modal.style.display = 'none';
//   })
// }
