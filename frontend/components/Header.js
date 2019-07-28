import React from "react";
import Nav from "./Nav";

const Header = () => {
  return (
    <div>
      <div className="bar">
        <Nav />
      </div>
      <div className="sub-bar">
        <p>Serach</p>
      </div>
      <div>Cart</div>
    </div>
  );
};

export default Header;
