import cloneDeep from '@modules/lodash.clonedeep';

export default (value) => {
  const copyValue = cloneDeep(value);

  Object.keys(copyValue).forEach((key) => {
    if (copyValue[key] === null || copyValue[key] === false) {
      delete copyValue[key];
    }
  });

  return copyValue;
};
