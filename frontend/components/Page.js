import React, { Component } from "react";
import Meta from "./Meta";
import Header from "./Header";
import styled from "styled-components";

const Button = styled.button`
  color: white;
  background-color: red;
  font-size: 100px;

  span {
    font-size: 50px;
  }
`;

class Page extends Component {
  render() {
    return (
      <div>
        <Meta />
        <Header />
        <Button>
          <span>Emoji</span>Click me
        </Button>
        {this.props.children}
      </div>
    );
  }
}

export default Page;
