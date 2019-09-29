import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";

import Nav from "../components/Nav";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser, fakeCartItem } from "../lib/testUtils";

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } }
  }
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } }
  }
];

const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem(), fakeCartItem()]
        }
      }
    }
  }
];

describe("<Nav/>", () => {
  it("renders a minimal nav when signed out", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <Nav />
      </MockedProvider>
    );

    await wait(0);
    wrapper.update();

    const nav = wrapper.find('[data-test="nav"]');

    expect(toJSON(nav)).toMatchSnapshot();
  });

  it("renders full nav", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <Nav />
      </MockedProvider>
    );

    await wait(0);
    wrapper.update();

    const nav = wrapper.find('ul[data-test="nav"]');

    expect(nav.children().length).toBe(6);
    expect(nav.text()).toContain("Sign out");
  });

  it("renders the amount of items in the cart", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocksWithCartItems}>
        <Nav />
      </MockedProvider>
    );

    await wait(0);
    wrapper.update();

    const nav = wrapper.find("CartCount div.count");

    expect(nav.text()).toContain("6");
  });
});
