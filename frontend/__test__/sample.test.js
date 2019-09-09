describe("sample test 101", () => {
  it("works as expected", () => {
    expect(1).toEqual(1);
  });

  it("handles ranges", () => {
    const age = 200;
    expect(age).toBeGreaterThan(100);
  });

  // add .only to skip others or change to fit (focus)
  // add .skip to skip this or change to xit

  it("is broken", () => {
    const arr = ["foo", "bar"];
    expect(arr).toEqual(arr);
    expect(arr).toContain("foo");
  });
});
