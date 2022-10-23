const mapperData = ([key, label]) => ({ key, label });

export default {
  parsingMethods(state) {
    const methods = Object.entries(state.file?.parsingMethods ?? []);

    if (methods?.length) {
      return methods.map(mapperData);
    } else {
      return [];
    }
  },

  headersList(state) {
    const headers = Object.entries(state.file?.file?.headers ?? []);

    if (headers?.length) {
      return headers.map(mapperData);
    } else {
      return [];
    }
  },
};
