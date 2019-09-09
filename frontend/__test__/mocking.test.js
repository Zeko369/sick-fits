class Person {
  constructor(name, foods) {
    this.name = name;
    this.foods = foods;
  }
  fetchFavFood() {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.foods), 2000);
    });
  }
}

describe("mocking learning", () => {
  it("mocks a reg function", () => {
    const fetchDogs = jest.fn();
    fetchDogs("foobar");

    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith("foobar");

    fetchDogs("barfoo");
    expect(fetchDogs).toHaveBeenCalledTimes(2);
  });

  it("can create a person", () => {
    const me = new Person("Foo", ["Pizza"]);
    expect(me.name).toBe("Foo");
  });

  it("can fetch food", async () => {
    const me = new Person("Foo", ["Pizza"]);

    me.fetchFavFood = jest.fn().mockResolvedValue(["Pizza"]);
    const favFoods = await me.fetchFavFood();

    expect(favFoods).toContain("Pizza");
  });

  it("mocks a promise function", () => {});
});
