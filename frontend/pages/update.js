import React from "react";

import UpdateItem from "../components/UpdateItem";

const Sell = props => {
  return (
    <div>
      <p>Seller</p>
      <UpdateItem id={props.query.id} />
    </div>
  );
};

export default Sell;
