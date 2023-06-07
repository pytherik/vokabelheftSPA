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
