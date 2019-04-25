import SetDayNow from './setDayNow';
import ValidateForm from './ValidateForm';

export default class CreateForm {
  constructor(parent) {
    this.parentEl = document.querySelector(`[data-id=${parent}]`); // main
    this.tasksHolder = document.querySelector('[data-id=tasksHolder]'); // Ul
  }

  create(formType, elementToAction) {
    if (formType === 'newTask') {
      console.log('функция новой задачи');
      this.addNewTask();
    } else if (formType === 'delete') {
      console.log('функция удаления');
      this.removeTask(elementToAction);
    } else {
      console.log('функция редактирования');
      this.editTask(elementToAction);
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
    this.addBtnsListeners(formEl);
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
        this.parent.remove();
        elementToAction.remove();
      } else if (delEl === 'edit') {
        const checkForm = new ValidateForm('formTask');
        if (checkForm.create()) {
          console.log('Нажал на редактировать');
          const describe = document.querySelector('[data-id=describeField]').value;
          const fullDescribe = document.querySelector('[data-id=fullDescribeField]').value;

          const elementToActionDescribe = elementToAction.children[0]; // пришлось из-за lint
          elementToActionDescribe.textContent = describe; // краткая
          elementToAction.children[0].setAttribute('data-fullData', fullDescribe); // полная
          const dateTime = new SetDayNow(new Date());

          const elementToActionTime = elementToAction.children[1]; // пришлось из-за lint
          elementToActionTime.textContent = dateTime.create(); // дата-время
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

          console.log(this.tasksHolder);
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
}
