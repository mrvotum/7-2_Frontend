export default class ValidateForm {
  constructor(validateElA) {
    this.form = document.querySelector(`[data-id=${validateElA}]`);
  }

  create() {
    const isValid = this.form.checkValidity();

    if (!isValid) {
      const first = [...this.form.elements].find(o => !o.validity.valid);
      first.focus();

      if (first.validity.typeMismatch === false) {
        first.customError = 'Необходимо ввести данные';
      }

      const error = document.createElement('span');
      error.className = 'formError';
      error.setAttribute('data-id', 'formError');
      error.textContent = first.customError;
      first.offsetParent.appendChild(error);
      error.style.top = `${first.offsetTop + first.offsetHeight}px`;

      setTimeout(() => {
        error.remove();
      }, 1500);
    } else {
      return true;
    }
  }
}
