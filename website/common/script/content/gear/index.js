import each from 'lodash/each';
import defaults from 'lodash/defaults';
import moment from 'moment';

import {CLASSES, GEAR_TYPES,} from '../constants';
import {ownsItem} from './gear-helper';

import weapon from './weapon';
import armor from './armor';
import head from './head';
import shield from './shield';
import back from './back';
import body from './body';
import headAccessory from './head-accessory';
import eyewear from './eyewear';

const gear = {
  weapon,
  armor,
  head,
  shield,
  back,
  body,
  headAccessory,
  eyewear,
};

/*
  The gear is exported as a tree (defined above), and a flat list
  (eg, {weapon_healer_1: .., shield_special_0: ...}) since
  they are needed in different forms at different points in the app
 */
const flat = {};

each(GEAR_TYPES, type => {
  const allGearTypes = CLASSES.concat(['base', 'special', 'mystery', 'armoire']);

  each(allGearTypes, klass => {
    each(gear[type][klass], (item, index) => {
      const key = `${type}_${klass}_${index}`;
      const set = `${klass}-${index}`;

      defaults(item, {
        type,
        key,
        set,
        klass,
        index,
        str: 0,
        int: 0,
        per: 0,
        con: 0,
        canBuy: () => false,
      });

      if (item.event) {
        const canOwnFuncTrue = () => true;
        const _canOwn = item.canOwn || canOwnFuncTrue;

        item.canOwn = user => {
          const userHasOwnedItem = ownsItem(key)(user);
          const eventIsCurrent = moment()
            .isAfter(item.event.start) && moment().isBefore(item.event.end);
          const compatibleWithUserClass = item.specialClass
            ? user.stats.class === item.specialClass
            : true;

          return _canOwn(user) && (userHasOwnedItem || eventIsCurrent) && compatibleWithUserClass;
        };
      }

      if (item.mystery || key.indexOf('takeThis') !== -1) {
        item.canOwn = ownsItem(key);
      }

      flat[key] = item;
    });
  });
});

export default {
  tree: gear,
  flat,
};
