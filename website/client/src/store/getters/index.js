import {flattenAndNamespace} from '@/libs/store/helpers/internals';
import * as user from './user';
import * as shops from './shops';
import * as tasks from './tasks';
import * as party from './party';
import * as members from './members';
import * as worldState from './worldState';

// Getters should be named as 'getterName' and can be accessed as 'namespace:getterName'
// Example: gems in user.js -> 'user:gems'

const getters = flattenAndNamespace({
  user,
  tasks,
  party,
  members,
  shops,
  worldState,
});

export default getters;
