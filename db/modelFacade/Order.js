module.exports.OrderModel = (data, dates, userId, productIds) => {
  const row = [];
  data.forEach((orders, index) => {
    const productId = productIds[index];
    orders.forEach((order, j) => {
      row.push({
        owner: { connect: { userId } },
        Product: { connect: productId },
        quantity: parseInt(order.number_sold),
        orderDate: dates[j],
      });
    });
  });
  return row;
};
