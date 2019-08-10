import React from "react";

import CreateItem from "../components/CreateItem";
import PleaseSignIn from "../components/PleaseSignIn";

const Sell = () => {
  return (
    <PleaseSignIn>
      <p>Seller</p>
      <CreateItem />
    </PleaseSignIn>
  );
};

export default Sell;
