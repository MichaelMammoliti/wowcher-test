import { mergeProducts, getTotal, sortProductsByName } from './utilities';

describe('utilities', () => {

  describe('mergeProducts', () => {
    it('it should return the correct payload', () => {
      const products = [
        {
          "id": "039",
          "name": "Cactus Pear",
          "unitPrice": 14.48,
          "sold": 604
        },
        {
          "id": "040",
          "name": "aaa",
          "unitPrice": 2,
          "sold": 2
        },
        {
          "id": "039",
          "name": "Cactus Pear",
          "unitPrice": 14.48,
          "sold": 862
        },
      ];

      const expected = [
        {
          "id": "039",
          "name": "Cactus Pear",
          "unitPrice": 14.48,
          "sold": 1466,
        },
        {
          "id": "040",
          "name": "aaa",
          "unitPrice": 2,
          "sold": 2
        },
      ]
      expect(mergeProducts(products)).toEqual(expected);
    });
  });

  describe('getTotal', () => {
    it('it should return the correct payload', () => {
      const products = [
        {
          id: '000',
          unitPrice: 10,
          sold: 10,
        },
        {
          id: '000',
          unitPrice: 10,
          sold: 20,
        },
        {
          id: '000',
          unitPrice: 10,
          sold: 30,
        },
      ];

      const expected = "600.00";

      expect(getTotal(products)).toEqual(expected);
    });
  });

  describe('sortProductsByName', () => {
    it('it should return the correct payload', () => {
      const products = [
        { name: 'z' },
        { name: 'a' },
        { name: 'd' },
        { name: 'b' },
      ];

      const expected = [
        { name: 'a' },
        { name: 'b' },
        { name: 'd' },
        { name: 'z' },
      ];

      expect(sortProductsByName(products)).toEqual(expected);
    });
  });
});
