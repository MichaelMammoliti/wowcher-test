import React from 'react';

import { formatNumber } from '../utilities';

const ProductItem = ({ productData }) => (
  productData.map((productItem) => (
    <tr key={productItem.name}>
      <td>{productItem.name}</td>
      <td>{formatNumber(productItem.unitPrice * productItem.sold)}</td>
    </tr>
  )
));

export default ProductItem;
