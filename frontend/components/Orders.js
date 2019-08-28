import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Link from "next/link";

import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";

const ORDERS_QUERY = gql`
  query ORDERS_QUERY {
    orders {
      id
      total
      createdAt
    }
  }
`;

const Orders = () => (
  <Query query={ORDERS_QUERY}>
    {({ data, loading, error }) => {
      if (error) return <Error error={error} />;
      if (loading) return <h1>Loading</h1>;

      const orders = data.orders;

      return (
        <div>
          <h3>
            You have {orders.length} order{orders.length !== 1 && "s"}
          </h3>
          {orders.map((order) => (
            <div key={order.id}>
              <hr></hr>
              <p>{formatMoney(order.total)}</p>
              <Link href={{ pathname: "/order", query: { id: order.id } }}>
                <a>Link</a>
              </Link>
              <p>{order.createdAt}</p>
            </div>
          ))}
        </div>
      );
    }}
  </Query>
);

export default Orders;
