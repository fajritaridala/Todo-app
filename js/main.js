/**
 * @param DOMContentLoaded = memuat && memastikan, semua elemen HTML menjadi DOM
 */
document.addEventListener('DOMContentLoaded', () => {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addTodo();
  });

  // add todo
  function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;

    const generateID = generateId();
    const todoObject = generateTodoObject(
      generateID,
      textTodo,
      timestamp,
      false
    );

    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function generateId() {
    return +new Date();
  }

  function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
      id,
      task,
      timestamp,
      isCompleted,
    };
  }

  const todos = [];
  const RENDER_EVENT = 'render-todo';

  document.addEventListener(RENDER_EVENT, () => {
    console.log(todos);
  });

  // todo list
  function makeTodo(todoObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    // add check, uncheck, and delete todo
    if (todoObject.isCompleted) {
      // button
      const undoButton = document.createElement('button');
      const trashButton = document.createElement('button');

      undoButton.classList.add('undo-button');
      trashButton.classList.add('trash-button');

      // event
      undoButton.addEventListener('click', () => {
        undoTaskFromCompleted(todoObject.id);
      });
      trashButton.addEventListener('click', () => {
        removeTaskFromCompleted(todoObject.id);
      });

      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');

      checkButton.addEventListener('click', () => {
        addTaskToCompleted(todoObject.id);
      });

      container.append(checkButton);
    }

    return container;
  }

  function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function findTodo(todoId) {
    for (const todoItem of todos) {
      if (todoItem.id === todoId) return todoItem;
    }
    return null;
  }

  function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);

    if (todoTarget === -1) return;

    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function findTodoIndex(todoId) {
    for (const index in todos) {
      if (todos[index].id === todoId) return index;
    }
    return -1;
  }

  function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  document.addEventListener(RENDER_EVENT, () => {
    // console.log(todos);
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';

    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';

    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      if (!todoItem.isCompleted) uncompletedTODOList.append(todoElement);
      else completedTODOList.append(todoElement);
    }
  });
});
