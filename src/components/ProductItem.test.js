import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import "jest-enzyme";

import ProductItem from './ProductItem';

configure({
  adapter: new Adapter()
});

describe('ProductItem', () => {
  it('should render correctly', () => {
    const props = {
      productData: [
        {
          name: 'somethig',
          unitPrice: 10,
          sold: 10,
        }
      ]
    };

    const unit = shallow(<ProductItem {...props} />);

    expect(unit).toMatchSnapshot();
  });
})

export default ProductItem;
