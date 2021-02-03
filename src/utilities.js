export const formatNumber = (number) => new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

export const sortProductsByName = (products) => products.sort((a, b) => (a.name < b.name) ? -1 : 1);

export const getFilteredProducts = (filter, products) => {
  return products.filter((product) => {
    return product.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
  });
}

export const mergeProducts = (products) => {
  const newProducts = products.flat().reduce((acc, productItem) => {
    if (!acc[productItem.name]) {
      acc[productItem.name] = {...productItem};
    } else {
      acc[productItem.name].sold = acc[productItem.name].sold + productItem.sold;
    }

    return acc;
  }, {});

  return sortProductsByName(Object.values(newProducts));
};

export const getTotal = (products) => {
  const total = products.reduce((acc, productItem) => {
    const totalSold = productItem.unitPrice * productItem.sold;

    return acc + totalSold;
  }, 0);

  return formatNumber(total);
};
