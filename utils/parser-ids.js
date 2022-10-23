export default (params) => {
  const list = [];

  if (params.has('id')) {
    return params.get('id');
  } else {
    for (let k of params.entries()) {
      const [key, value] = k;

      if (key === 'id[]') list.push(value);
    }

    return list;
  }
};
