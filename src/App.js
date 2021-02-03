import React, { Component } from "react";

import { mergeProducts, getFilteredProducts, getTotal } from './utilities';
import * as ProductAPI from './api';

import ProductItem from './components/ProductItem.js';

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      filter: '',
      fetchProductsRequestStatus: '',
    };

    this.fetchProductsFulfilled = this.fetchProductsFulfilled.bind(this);
    this.fetchProductsRejected = this.fetchProductsRejected.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // Lifecycle Events
  // =============================================
  componentDidMount() {
    this.fetchProductsPending();

    ProductAPI.fetchProducts()
      .then(this.fetchProductsFulfilled)
      .catch(this.fetchProductsRejected)
  }

  // Async
  // =============================================
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

  fetchProducts() {
    this.fetchProductsPending();

    ProductAPI.fetchProducts()
      .then(this.fetchProductsFulfilled)
      .catch(this.fetchProductsRejected);
  }

  // DOM Events
  // =============================================
  handleInputChange(event) {
    this.setState({
      filter: event.target.value,
    });
  }

  // Utilties
  // =============================================
  getProducts() {
    const { filter, products } = this.state;

    const newProducts = filter ? getFilteredProducts(filter, products) : products;

    return newProducts;
  };

  // Render
  // =============================================
  render() {
    const { fetchProductsRequestStatus } = this.state;

    if (fetchProductsRequestStatus === 'pending') {
      return 'Loading...';
    }

    const products = this.getProducts();

    return (
      <div className="product-list">
        <label htmlFor="search">Search Products</label>
        <input type="text" id="search" onChange={this.handleInputChange} />

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
