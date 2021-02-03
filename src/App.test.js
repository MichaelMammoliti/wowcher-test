import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";
import "jest-enzyme";
import branch1 from "../public/api/branch1.json";
import branch2 from "../public/api/branch2.json";
import branch3 from "../public/api/branch3.json";
import App, { mergeProducts, getTotal } from "./App";

configure({
  adapter: new Adapter()
});

const responses = {
  "api/branch1.json": branch1,
  "api/branch2.json": branch2,
  "api/branch3.json": branch3,
  "/api/branch1.json": branch1,
  "/api/branch2.json": branch2,
  "/api/branch3.json": branch3
};

global.fetch = endpoint =>
  Promise.resolve({
    json: () => Promise.resolve(responses[endpoint])
  });

// based on https://blog.pragmatists.com/genuine-guide-to-testing-react-redux-applications-6f3265c11f63
const flushAllPromises = () => new Promise(resolve => setImmediate(resolve));

export const flushRequestsAndUpdate = async enzymeWrapper => {
  await flushAllPromises();
  enzymeWrapper.update();
};

it("renders without crashing", () => {
  mount(<App />);
});

it("renders loading text initially", async () => {
  const app = mount(<App />);
  expect(app).toHaveText("Loading...");
});

it("renders a table after data load", async () => {
  const app = mount(<App />);
  expect(app).toHaveText("Loading...");
  await flushRequestsAndUpdate(app);
  expect(app.find("table")).toExist();
});

it("renders rows with product name as key", async () => {
  const app = mount(<App />);
  await flushRequestsAndUpdate(app);

  expect(
    app
      .find("table tbody tr")
      .at(56)
      .key()
  ).toEqual("Hominy");
  expect(
    app
      .find("table tbody tr")
      .at(73)
      .key()
  ).toEqual("Lychee");
});

it("renders table that is sorted ascending", async () => {
  const app = mount(<App />);
  await flushRequestsAndUpdate(app);
  expect(app.find("table")).toMatchSnapshot();
});

it("calculates total revenue of all branches", async () => {
  const app = mount(<App />);
  await flushRequestsAndUpdate(app);
  expect(app.find("tfoot td:last-child").text()).toEqual("2,102,619.44");
});

it("filters the displayed products", async () => {
  const app = mount(<App />);
  await flushRequestsAndUpdate(app);
  const changeEvent = { target: { value: "pear" } };
  app.find("input").simulate("change", changeEvent);

  expect(app.find("table")).toMatchSnapshot();
  expect(app.find("tfoot td:last-child").text()).toEqual("60,681.02");
});



it('calculated products', () => {
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

it('getTotal', () => {
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
