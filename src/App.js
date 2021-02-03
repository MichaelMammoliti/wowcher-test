import React, { Component } from "react";

import fetchData from './api';

import "./App.css";

const ProductItem = ({ productData }) => (
  productData.map((productItem) => (
    <tr key={productItem.name}>
      <td>{productItem.name}</td>
      <td>{formatNumber(productItem.unitPrice * productItem.sold)}</td>
    </tr>
  )
));

const formatNumber = (number) => new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);

const sortProductsByName = (a, b) => (a.name < b.name) ? -1 : 1;

const getFilteredProducts = (filter, products) => {
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

  return Object.values(newProducts).sort(sortProductsByName);
};

export const getTotal = (products) => {
  const total = products.reduce((acc, productItem) => {
    const totalSold = productItem.unitPrice * productItem.sold;

    return acc + totalSold;
  }, 0);

  return formatNumber(total);
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      filter: '',
    };

    this.fetchProductsFulfilled = this.fetchProductsFulfilled.bind(this);
    this.fetchProductsRejected = this.fetchProductsRejected.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  fetchProductsPending() {
    this.setState({
      fetchProductsRequestStatus: 'pending',
    });
  }

  fetchProductsFulfilled(branches) {
    const branchesProducts = branches.map((branch) => branch.products);
    const products = mergeProducts(branchesProducts);

    this.setState({
      products,
      fetchProductsRequestStatus: 'fulfilled',
    });
  }

  fetchProductsRejected() {
    this.setState({
      products: [],
      fetchProductsRequestStatus: 'rejected',
    });
  }

  componentDidMount() {
    this.fetchProductsPending();

    fetchData()
      .then(this.fetchProductsFulfilled)
      .catch(this.fetchDataRejected)
  }

  handleInputChange(event) {
    this.setState({
      filter: event.target.value,
    });
  }

  getProducts() {
    const { filter, products } = this.state;

    const newProducts = filter ? getFilteredProducts(filter, products) : products;

    return newProducts;
  }

  render() {
    const { fetchProductsRequestStatus } = this.state;

    if (fetchProductsRequestStatus === 'pending') {
      return 'Loading...';
    }

    const products = this.getProducts();

    return (
      <div className="product-list">
        <label>Search Products</label>
        <input type="text" onChange={this.handleInputChange} />

        <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          <ProductItem productData={products} />
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td>{getTotal(products)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
  }
}

export default App;
