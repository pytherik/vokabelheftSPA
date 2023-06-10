const title = document.querySelector('title');
const container = document.querySelector('.container');

export class Login {
  createUserInputs () {
    title.textContent = 'User-Login';
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    let form = `<label for="name">Name</label>
                <span id="name-warning" class="warning"></span>
                <input type="text" name="name" id="name" autocomplete="off">
                <label for="password">Passwort</label>
                <span id="pass-warning" class="warning"></span>
                <input type="password" name="password" id="password">
                <button type="submit" id="formSubmit">bestätigen und los</button>`;

    formContainer.insertAdjacentHTML('beforeend', form);

    container.insertAdjacentElement('beforeend', formContainer);
  }
}