import { shallow } from "enzyme";

import ItemComponent from "../../components/Item";
import formatMoney from "../../lib/formatMoney";

const fakeItem = {
  id: "ASD123",
  title: "A Cool Item",
  price: 5000,
  description: "Foo",
  image: "dog.jpg",
  largeImage: "large-dog.jpg"
};

describe("<Item/>", () => {
  it("renders price and title properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const PriceTag = wrapper.find("PriceTag");
    const TitleTag = wrapper.find("Title a");

    expect(PriceTag.children().text()).toBe(formatMoney(fakeItem.price));
    expect(TitleTag.text()).toBe(fakeItem.title);
  });

  it("renders image properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const ImageTag = wrapper.find("img");

    expect(ImageTag.props().src).toBe(fakeItem.image);
    expect(ImageTag.props().alt).toBe(fakeItem.title);
  });

  it("renders buttons properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const ButtonList = wrapper.find(".buttonList");

    expect(ButtonList.children()).toHaveLength(3);
    expect(ButtonList.find("Link").exists()).toBe(true);
    expect(ButtonList.find("AddToCart").exists()).toBe(true);
    expect(ButtonList.find("DeleteItem").exists()).toBe(true);
  });
});
