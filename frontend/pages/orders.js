import React from "react";

import Orders from "../components/Orders";
import PleaseSignIn from "../components/PleaseSignIn";

const OrdersPage = (props) => (
  <PleaseSignIn>
    <Orders />
  </PleaseSignIn>
);

export default OrdersPage;
