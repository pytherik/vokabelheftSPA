const title = document.querySelector('title');
const container = document.querySelector('.container');

export class Login {
  createUserInputs () {
    title.textContent = 'User-Login';
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    let form = `<label for="name">Name</label>`;
    form += `<input type="text" name="name" id="name" autocomplete="off">`;
    form += `<label for="password">Passwort</label>`;
    form += `<input type="password" name="password" id="password">`;
    form += `<button type="submit" id="formSubmit">bestätigen und los</button>`;

    formContainer.insertAdjacentHTML('beforeend', form);

    container.insertAdjacentElement('beforeend', formContainer);
  }
}