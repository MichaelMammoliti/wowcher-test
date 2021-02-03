export const fetchProducts = () => {
  const promises = [
    fetch('api/branch1.json').then(r => r.json()),
    fetch('api/branch2.json').then(r => r.json()),
    fetch('api/branch3.json').then(r => r.json()),
  ];

  return Promise.all(promises);
};
