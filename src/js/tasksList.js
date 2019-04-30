import CreateForm from './addForm';

export default class TasksList {
  constructor(parent) {
    this.tasksHolder = document.querySelector(`[data-id=${parent}]`); // UL tag
    this.addNewTask = document.querySelector('[data-id=addNewTask]');
  }

  create() {
    const makeForm = new CreateForm('main');
    makeForm.create('loadTasks');
    this.addBtnsListeners();
  }

  addBtnsListeners() {
    this.addNewTask.addEventListener('click', () => {
      const makeForm = new CreateForm('main');
      makeForm.create('newTask');
    });

    this.tasksHolder.addEventListener('click', (event) => {
      const elementToAction = event.toElement.parentElement.parentElement.parentElement;

      if (event.toElement.getAttribute('data-id') === 'taskBtnDelete') {
        const makeForm = new CreateForm('main');
        makeForm.create('delete', elementToAction);
      } else if (event.toElement.getAttribute('data-id') === 'taskBtnEdit') {
        const makeForm = new CreateForm('main');
        makeForm.create('edit', elementToAction);
      } else if (event.toElement.getAttribute('data-id') === 'taskData' || event.toElement.getAttribute('data-id') === 'taskDate') {
        console.log('Нажали для подробной информации');
        const makeForm = new CreateForm('main');
        makeForm.fullInfo(elementToAction);
      } else if (event.toElement.getAttribute('type') === 'checkbox') {
        console.log('изменение статуса задачи');
        const makeForm = new CreateForm('main');
        makeForm.create('changeStatus', elementToAction, event.toElement.checked);
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
