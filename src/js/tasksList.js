import CreateForm from './addForm';

export default class TasksList {
  constructor(parent) {
    this.tasksHolder = document.querySelector(`[data-id=${parent}]`); // UL tag
    this.addNewTask = document.querySelector('[data-id=addNewTask]');
  }

  create() {
    this.addBtnsListeners();
  }

  addBtnsListeners() {
    this.addNewTask.addEventListener('click', () => {
      const kek = new CreateForm('main');
      kek.create('newTask');
    });

    this.tasksHolder.addEventListener('click', (event) => {
      const elementToAction = event.toElement.parentElement.parentElement.parentElement;

      if (event.toElement.getAttribute('data-id') === 'taskBtnDelete') {
        const kek = new CreateForm('main');
        kek.create('delete', elementToAction);
      } else if (event.toElement.getAttribute('data-id') === 'taskBtnEdit') {
        const kek = new CreateForm('main');
        kek.create('edit', elementToAction);
      } else if (event.toElement.getAttribute('data-id') === 'taskData' || event.toElement.getAttribute('data-id') === 'taskDate') {
        console.log('Нажали для подробной информации');
        const kek = new CreateForm('main');
        kek.fullInfo(elementToAction);
      }

      // eslint-disable-next-line no-param-reassign
      event = event || window.event; // кросс-браузерно
      if (event.stopPropagation) {
      // Вариант стандарта W3C:
        event.stopPropagation();
      } else {
      // Вариант Internet Explorer:
      // eslint-disable-next-line no-param-reassign
        event.cancelBubble = true;
      }
    });
  }
}
