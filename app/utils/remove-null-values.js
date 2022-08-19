import cloneDeep from 'lodash.clonedeep';

export default (value) => {
  const copyValue = cloneDeep(value);

  Object.keys(copyValue).forEach((key) => {
    if (copyValue[key] === null) {
      delete copyValue[key];
    }
  });

  return copyValue;
};
