const normalize = (data, schema) => {
  let normalizedData = {};
  data.forEach((item, idx) => {
    const normalizedObj = {
      [item[schema.options.idAttribute]]: {
        ...item,
      },
    };
    normalizedData = { ...normalizedData, ...normalizedObj };
  });

  return {
    entities: { [schema.name]: normalizedData },
    result: normalizedData,
  };
};

const schema = {
  Entity: (name, schema, options) => ({
    name,
    schema,
    options,
  }),
};

module.exports = {
  normalize,
  schema,
};
