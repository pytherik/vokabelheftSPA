export const buttonElements = () => {
  const container = document.querySelector('.container');

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'button-container';
  const learnUserContent = `<button class="btn-green-big" id="btn-user">meine Vokabeln üben</button>`;
  const learnAllUsersContent = `<button class="btn-green-big" id="btn-all-users">alle Vokabeln üben</button>`;

  buttonContainer.insertAdjacentHTML('beforeend', learnUserContent);
  buttonContainer.insertAdjacentHTML('beforeend', learnAllUsersContent);

  container.insertAdjacentElement('beforeend', buttonContainer);
}

