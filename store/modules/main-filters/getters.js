const reduceCategories = (previousValue, currentValue) => {
  const [id, name] = currentValue;

  return [
    ...previousValue,
    {
      value: id,
      name,
    },
  ];
};

export default {
  categoriesList(state) {
    return Object.entries(state.categories).reduce(reduceCategories, []);
  },
};
