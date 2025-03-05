module.exports.CategoryModel = (data) => {
  const result = data.map((csvrow) => {
    const { id, category_name } = csvrow;
    const input = {
      categoryTitle: category_name,
      categoryImage: "",
      categoryDescription: "",
    };
    return input;
  });
  return result;
};
