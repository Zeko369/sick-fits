import formatMoney from "../lib/formatMoney";

describe("formatMoney function", () => {
  it("works with fractional dollars", () => {
    expect(formatMoney(1)).toEqual("$0.01");
    expect(formatMoney(40)).toEqual("$0.40");
  });

  it("removes cents for whole dollars", () => {
    expect(formatMoney(1000)).toEqual("$10");
    expect(formatMoney(500000)).toEqual("$5,000");
  });

  it("works with more money", () => {
    expect(formatMoney(12345)).toEqual("$123.45");
    expect(formatMoney(1234567)).toEqual("$12,345.67");
  });

  it("works with 0 dollars", () => {
    expect(formatMoney(0)).toEqual("$0");
  });
});
