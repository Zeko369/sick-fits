import { mount } from "enzyme";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";

import PleaseSignIn from "../components/PleaseSignIn";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser } from "../lib/testUtils";

const notSignedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: null
      }
    }
  }
];

const signedInMocks = [
  {
    request: {
      query: CURRENT_USER_QUERY
    },
    result: {
      data: {
        me: fakeUser()
      }
    }
  }
];

describe("<PleaseSignIn>", () => {
  it("renders the sign in dialog to logged out users", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    );

    expect(wrapper.text()).toContain("Loading...");

    await wait(0);
    wrapper.update();

    expect(wrapper.text()).toContain("Please sign in");
    expect(wrapper.find("SignIn").exists()).toBe(true);
  });

  const Foo = () => <p>Foobar</p>;

  it("renders the child component", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <Foo />
        </PleaseSignIn>
      </MockedProvider>
    );

    await wait(0);
    wrapper.update();

    expect(wrapper.find("Foo").exists()).toBe(true);
    expect(wrapper.find("Foo").text()).toContain("Foobar");
  });
});
