const title = document.querySelector('title');
const container = document.querySelector('.container');

export default class Login {
  createUserInputs () {
    title.textContent = 'User-Login';
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    const inputNameLabel = `<label for="name">Name</label>`;
    const inputName = `<input type="text" name="name" id="name" autocomplete="off">`;
    const inputPasswordLabel = `<label for="password">Passwort</label>`;
    const inputPassword = `<input type="password" name="password" id="password">`;
    const submit = `<button type="submit" id="formSubmit">bestätigen und los</button>`;

    formContainer.insertAdjacentHTML('beforeend', inputNameLabel)
    formContainer.insertAdjacentHTML('beforeend', inputName)
    formContainer.insertAdjacentHTML('beforeend', inputPasswordLabel)
    formContainer.insertAdjacentHTML('beforeend', inputPassword)
    formContainer.insertAdjacentHTML('beforeend', submit);

    container.insertAdjacentElement('beforeend', formContainer);
  }
}