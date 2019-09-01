import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Link from "next/link";
import styled from "styled-components";
import { formatDistance } from "date-fns";

import formatMoney from "../lib/formatMoney";
import Error from "./ErrorMessage";
import OrderItemStyles from "./styles/OrderItemStyles";

const ORDERS_QUERY = gql`
  query ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

const Orders = () => (
  <Query query={ORDERS_QUERY}>
    {({ data, loading, error }) => {
      if (error) return <Error error={error} />;
      if (loading) return <h1>Loading</h1>;

      const { orders } = data;

      console.log(orders);

      return (
        <div>
          <h2>
            You have {orders.length} order{orders.length !== 1 && "s"}
          </h2>
          <OrderUl>
            {orders.map((order) => (
              <OrderItemStyles key={order.id}>
                <Link href={{ pathname: "/order", query: { id: order.id } }}>
                  <a>
                    <div className="order-meta">
                      <p>
                        {order.items.reduce(
                          (all, item) => all + item.quantity,
                          0
                        )}
                      </p>
                      {/* <p>{formatDistance(order.createdAt, new Date())}</p> */}
                      <p>{order.createdAt.slice(0, 10)}</p>
                      <p>{formatMoney(order.total)}</p>
                    </div>
                    <div className="images">
                      {order.items.map((item) => (
                        <img key={item.id} src={item.image} alt={item.title} />
                      ))}
                    </div>
                  </a>
                </Link>
                <p>{order.createdAt}</p>
              </OrderItemStyles>
            ))}
          </OrderUl>
        </div>
      );
    }}
  </Query>
);

export default Orders;
