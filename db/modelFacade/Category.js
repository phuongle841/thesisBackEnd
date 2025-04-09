module.exports.CategoryModel = (data) => {
  const result = data.map((category) => {
    const { category_name } = category;
    const input = {
      categoryTitle: category_name,
      categoryImage: "",
      categoryDescription: "",
    };
    return input;
  });
  return result;
};
