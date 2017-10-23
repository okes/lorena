/* @flow */

export const utilGetObjetForId = (currlist, newid, typeid, nametarget, nametwotarget) => {
  let namecuenta = '';
  let i;
  for (i = 0; i < currlist.length; i += 1) {
    if (currlist[i][typeid] === newid) {
      if (nametwotarget !== null && nametwotarget !== undefined) {
        const space = ' ';
        namecuenta = currlist[i][nametarget] + space + currlist[i][nametwotarget];
      } else {
        namecuenta = currlist[i][nametarget];
        break;
      }
    }
  }
  return namecuenta;
};

export const getWeekNumber = (_d) => {
  // Copy date so don't modify original
  const d = new Date(+_d);
  d.setHours(0, 0, 0, 0);
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  const paramd = 4;
  let paramd1 = 7;
  if (d.getDay()) {
    paramd1 = d.getDay();
  }

  d.setDate((d.getDate() + paramd) - paramd1);
  // Get first day of year
  const yearStart = new Date(d.getFullYear(), 0, 1);
  // Calculate full weeks to nearest Thursday
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  // Return array of year and week number
  return [d.getFullYear(), weekNo];
};

export const cloneArray = _arr => _arr.slice(0);

export const cloneArrayMax = (_arr, _maxi) => {
  const n = _arr.length;
  const otherarr = [];
  let i;
  for (i = 0; i < n; i += 1) {
    if (i < _maxi) {
      otherarr.push(_arr[i]);
    }
  }
  return otherarr;
};

export const utilDynamicSort = (property) => {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1); // eslint-disable-line no-param-reassign
  }
  /* eslint-disable max-len */
  return (a, b) => {
    const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0; // eslint-disable-line no-nested-ternary
    return result * sortOrder;
  };
  /* eslint-enable max-len */
};

export const sortLocal = (_arr, _idlocal) => {
  if (_arr) {
    const n = _arr.length;
    const otherarr = [];
    let i;
    for (i = 0; i < n; i += 1) {
      if (Number(_arr[i].idlocal) === Number(_idlocal)) {
        otherarr.push(_arr[i]);
      }
    }
    return otherarr;
  }

  return [];
};

export const getCuentas = (_arr, _oculto) => {
  if (_arr) {
    _arr.sort(utilDynamicSort('nametarget'));
    const n = _arr.length;
    const otherarr = [];
    let i;
    for (i = 0; i < n; i += 1) {
      if (_arr[i].oculto && Number(_arr[i].oculto) === 1) {
        if (_oculto === true) {
          otherarr.push(_arr[i]);
        }
      } else if (_oculto !== true) {
        otherarr.push(_arr[i]);
      }
    }

    return otherarr;
  }

  return [];
};

export const utilToMoney = (num) => {
  const n = Number(num).toString();
  const p = n.indexOf('.');
  const signo = '$';
  return signo + n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, ($0, i) => (p < 0 || i < p ? ($0 + '.') : $0)); // eslint-disable-line prefer-template
};

export const getRandomInt = (min, max) => {
  const suma = (max - min + 1); // eslint-disable-line no-mixed-operators
  return Math.floor(Math.random() * suma) + min; // eslint-disable-line no-mixed-operators
};
