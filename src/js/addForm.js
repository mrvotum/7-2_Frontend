/* eslint-disable no-unused-vars */
import SetDayNow from './setDayNow';
import ValidateForm from './ValidateForm';
import API from './api.js';

// eslint-disable-next-line import/no-extraneous-dependencies
const uuid = require('uuid');

export default class CreateForm {
  constructor(parent) {
    this.parentEl = document.querySelector(`[data-id=${parent}]`); // main
    this.tasksHolder = document.querySelector('[data-id=tasksHolder]'); // Ul
    this.idCount = 0;
  }

  create(formType, elementToAction, status) {
    if (formType === 'newTask') {
      console.log('функция новой задачи');
      this.addNewTask();
    } else if (formType === 'delete') {
      console.log('функция удаления');
      this.removeTask(elementToAction);
    } else if (formType === 'loadTasks') {
      console.log('загрузка задач с сервера');
      this.loadTasks(elementToAction);
    } else if (formType === 'edit') {
      console.log('функция редактирования');
      this.editTask(elementToAction);
    } else {
      console.log('функция изменения статуса');
      const dateTime = new SetDayNow(new Date());
      this.editTaskStatus(elementToAction, status, dateTime.create());
    }
  }

  addNewTask() {
    const formEl = document.createElement('form');
    formEl.className = 'formTask';
    formEl.setAttribute('data-id', 'formTask');
    formEl.innerHTML = `<h3 class="title">Добавить тикет</h3>
      <label for="describe">Краткое описание</label>
      <input data-id="describeField" class="describeField" id="describe" type="text" autocomplete="off" required>
      <label for="fullDescribe">Подробное описание</label>
      <textarea data-id="fullDescribeField" class="fullDescribeField" id="fullDescribe" required></textarea>
      <div class="formBtnHolder">
        <input class="btn" value="Отмена" type="reset">
        <input class="btn" value="Ok" type="submit">
      </div>`;


    this.parentEl.appendChild(formEl);
    const describeField = document.querySelector('[data-id=describeField]');
    describeField.focus();
    this.addBtnsListeners(formEl);
  }

  loadTasks() {
    console.log('Загружаю с сервера данные...');
    const api = new API('https://seven-two.herokuapp.com/TicketFull');
    this.fromServer(api);
  }

  editTask(elementToAction) {
    const dataArr = elementToAction.children[0].children[1];
    // тут хранится информация
    // 0 - краткая
    // 0 children[0].getAttribute('data-fullData') - полная
    // 1 - дата и время
    const formEl = document.createElement('form');
    formEl.className = 'formTask';
    formEl.setAttribute('data-id', 'formTask');

    formEl.innerHTML = `<h3 class="title">Изменить тикет</h3>
      <label for="describe">Краткое описание</label>
      <input data-id="describeField" class="describeField" id="describe" type="text" value="${dataArr.children[0].textContent}" autocomplete="off" required>
      <label for="fullDescribe">Подробное описание</label>
      <textarea data-id="fullDescribeField" class="fullDescribeField" id="fullDescribe" required>${dataArr.children[0].getAttribute('data-fullData')}</textarea>
      <div class="formBtnHolder">
        <input class="btn" value="Отмена" type="reset">
        <input class="btn" value="Ok" type="submit">
      </div>`;

    this.parentEl.appendChild(formEl);
    this.addBtnsListeners(formEl, dataArr, 'edit');
  }

  removeTask(elementToAction) {
    const formEl = document.createElement('form');
    formEl.className = 'formDeleteTask';
    formEl.setAttribute('data-id', 'formDeleteTask');
    formEl.innerHTML = `<h3 class="title">Удалить тикет</h3>
    <span>Вы уверены, что хотите удалить тикет? Это действие необратимо.</span>
    <div class="formBtnHolder">
      <input class="btn" value="Отмена" type="reset">
      <input class="btn" value="Ok" type="submit">
    </div>`;

    this.parentEl.appendChild(formEl);
    this.addBtnsListeners(formEl, elementToAction, 'del');
    console.log(`удалять решили этот объект: ${elementToAction.className}`);
  }

  addBtnsListeners(btnsParent, elementToAction, delEl) {
    // находим кнопки в полученной форме
    this.parent = document.querySelector(`[data-id=${btnsParent.getAttribute('data-id')}]`);

    const btnSubmit = this.parent.querySelector('[type=submit]');
    btnSubmit.addEventListener('click', () => {
      event.preventDefault();
      if (delEl === 'del') {
        console.log('Нажал на удалить');

        // удаление с сервера
        const idEl = elementToAction.id;
        const api = new API('https://seven-two.herokuapp.com/TicketFull');
        console.info(`id for delete = ${idEl}`);
        this.removeElById(api, idEl);
        // удаление с сервера

        this.parent.remove();
        elementToAction.remove();
      } else if (delEl === 'edit') {
        const checkForm = new ValidateForm('formTask');
        if (checkForm.create()) {
          console.log('Нажал на редактировать');
          const describe = document.querySelector('[data-id=describeField]').value;
          const fullDescribe = document.querySelector('[data-id=fullDescribeField]').value;
          const idEl = elementToAction.parentElement.parentElement.id;

          const elementToActionDescribe = elementToAction.children[0]; // пришлось из-за lint
          elementToActionDescribe.textContent = describe; // краткая
          elementToAction.children[0].setAttribute('data-fullData', fullDescribe); // полная
          const dateTime = new SetDayNow(new Date());

          const elementToActionTime = elementToAction.children[1]; // пришлось из-за lint
          elementToActionTime.textContent = dateTime.create(); // дата-время

          // отправляем на сервер
          const api = new API('https://seven-two.herokuapp.com/TicketFull');
          this.toServerEdit(idEl, api, describe, fullDescribe, false, dateTime.create());
          // отправляем на сервер

          this.parent.remove();
        }
      } else {
        console.log('Нажал на добавить');
        const describe = document.querySelector('[data-id=describeField]').value;
        const fullDescribe = document.querySelector('[data-id=fullDescribeField]').value;
        // проверка формы
        const checkForm = new ValidateForm('formTask');
        if (checkForm.create()) {
          const dateTime = new SetDayNow(new Date());

          const liEl = document.createElement('li');
          this.idCount = this.idCountFun();
          liEl.id = uuid.v4();
          liEl.className = 'taskHolder';
          liEl.innerHTML = `<div class="task">
            <div class="taskCheckboxHolder">
              <input class="taskCheckbox" type="checkbox">
              <span class="taskCheckboxStyle"></span>
            </div>
            <div data-id="taskInfoHolder" class="taskInfoHolder">
              <span data-id="taskData" data-fullData="${fullDescribe}" class="taskData">${describe}</span>
              <span data-id="taskDate" class="taskDate">${dateTime.create()}</span>
            </div>
            <div class="taskBtnsHolder">
              <span data-id="taskBtnEdit" class="taskBtn">&#9998;</span>
              <span data-id="taskBtnDelete" class="taskBtn">&#215;</span>
            </div>
          </div>`;

          this.idCount += 1;

          // отправляем на сервер
          const api = new API('https://seven-two.herokuapp.com/TicketFull');
          this.toServerNew(api, describe, fullDescribe);
          // отправляем на сервер

          // перезагружаем страницу, чтобы появились правильные id
          // с интервалом, чтобы успело отправиться на сервер
          // setTimeout(() => {
          //   location.reload(true);
          // }, 500);

          this.tasksHolder.appendChild(liEl);
          this.parent.remove();
        }
      }
    });

    const btnReset = this.parent.querySelector('[type=reset]');
    btnReset.addEventListener('click', () => {
      console.log('отмена');
      this.parent.remove();
    });
  }

  fullInfo(elementToAction) {
    const dataArr = elementToAction.children[0].children[1];
    const spanEl = document.createElement('span');
    spanEl.className = 'taskDataFull';
    spanEl.setAttribute('data-id', 'taskDataFull');
    spanEl.textContent = dataArr.children[0].getAttribute('data-fullData');

    dataArr.appendChild(spanEl);

    setTimeout(() => {
      spanEl.remove();
    }, 1500);
  }

  // Работа с сервером
  toServerNew(api, name, description) {
    const apiK = api;
    const keKname = name;
    const keKdescription = description;
    const dateTime = new SetDayNow(new Date());

    async function addNewTaskToServer() {
      // добавляем тикет
      const TicketFull = await apiK.add({
        id: '',
        name: keKname,
        description: keKdescription,
        status: false,
        created: dateTime.create(),
      });
    }

    addNewTaskToServer();
  }

  toServerEdit(id, api, describe, fullDescribe, statusTask, dateTime) {
    async function editTaskToServer(ID) {
      // редактируем тикет
      const TicketFull = await api.edit({
        id: ID,
        name: describe,
        description: fullDescribe,
        status: statusTask,
        created: dateTime,
      });
    }

    editTaskToServer(id);
  }

  fromServer(api) {
    const apiK = api;

    async function loadFromServer() {
      const TicketFull = await apiK.load();
      const data = await TicketFull.json();

      // для каждого элемента из БД сервера
      for (let i = 0; i < data.length; i += 1) {
        const describe = data[i].name;
        const fullDescribe = data[i].description;

        const dateTime = data[i].created;

        const liEl = document.createElement('li');
        liEl.id = data[i].id;
        liEl.className = 'taskHolder';
        let taskStatus = null;
        if (data[i].status) {
          taskStatus = 'checked';
        }
        liEl.innerHTML = `<div class="task">
          <div class="taskCheckboxHolder">
            <input class="taskCheckbox" type="checkbox" ${taskStatus}>
            <span class="taskCheckboxStyle"></span>
          </div>
          <div data-id="taskInfoHolder" class="taskInfoHolder">
            <span data-id="taskData" data-fullData="${fullDescribe}" class="taskData">${describe}</span>
            <span data-id="taskDate" class="taskDate">${dateTime}</span>
          </div>
          <div class="taskBtnsHolder">
            <span data-id="taskBtnEdit" class="taskBtn">&#9998;</span>
            <span data-id="taskBtnDelete" class="taskBtn">&#215;</span>
          </div>
        </div>`;

        const tasksHolder = document.querySelector('[data-id=tasksHolder]');

        tasksHolder.appendChild(liEl);
        // id += 1;
      }
    }

    loadFromServer();
  }

  removeElById(api, idEl) {
    async function deleteEl(id) {
      const TicketFull = await api.remove(id);
    }

    deleteEl(idEl);
  }

  // чтобы понять сколько элементов на странице
  idCountFun() {
    function idCount() {
      const tasksHolder = document.querySelector('[data-id=tasksHolder]');
      const elementsCount = tasksHolder.childElementCount;
      return elementsCount;
    }

    return idCount();
  }

  editTaskStatus(elementToAction, statusTask, dateTime) {
    const api = new API('https://seven-two.herokuapp.com/TicketStatusUpdate');
    const elementId = elementToAction.id;

    async function editStatus(ID) {
      const TicketFull = await api.edit({
        id: ID,
        status: statusTask,
        created: dateTime,
      });
    }

    editStatus(elementId);
  }
}
