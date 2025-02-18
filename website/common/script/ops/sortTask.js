import get from 'lodash/get';
import findIndex from 'lodash/findIndex';
import i18n from '../i18n';
import preenTodos from '../libs/preenTodos';
import {BadRequest, NotFound,} from '../libs/errors';

// TODO used only in client, move there?

export default function sortTask (user, req = {}) {
  const id = get(req, 'params.id');
  let to = get(req, 'query.to');
  let fromParam = get(req, 'query.from');
  const taskType = get(req, 'params.taskType');

  const index = findIndex(user[`${taskType}s`], task => task._id === id);

  if (index === -1) {
    throw new NotFound(i18n.t('messageTaskNotFound', req.language));
  }
  if (to == null && fromParam == null) { // eslint-disable-line eqeqeq
    throw new BadRequest('?to=__&from=__ are required');
  }

  const tasks = user[`${taskType}s`];

  if (taskType === 'todo') {
    const preenedTasks = preenTodos(tasks);

    if (to !== -1) {
      to = tasks.indexOf(preenedTasks[to]);
    }

    fromParam = tasks.indexOf(preenedTasks[fromParam]);
  }

  const movedTask = tasks.splice(fromParam, 1)[0];

  if (to === -1) {
    tasks.push(movedTask);
  } else {
    tasks.splice(to, 0, movedTask);
  }

  return tasks;
}
