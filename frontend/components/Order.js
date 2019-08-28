import React, { Component } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import { format } from "date-fns";
import gql from "graphql-tag";
import Head from "next/head";

import formatMoney from "../lib/formatMoney";
import OrderStyles from "./styles/OrderStyles";
import Error from "./ErrorMessage";

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        image
        price
        quantity
      }
    }
  }
`;

class Order extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };

  render() {
    const { id } = this.props;

    return (
      <Query query={SINGLE_ORDER_QUERY} variables={{ id }}>
        {({ data, error, loading }) => {
          if (error) return <Error error={error} />;
          if (loading) return <h1>Loading</h1>;

          const order = data.order;

          console.log(order);

          return (
            <OrderStyles>
              <Head>
                <title>{order.title}</title>
              </Head>
              <p>
                <span>Order ID:</span>
                <span>{order.id}</span>
              </p>
              <p>
                <span>Charge</span>
                <span>{order.charge}</span>
              </p>
              <p>
                <span>Date</span>
                <span>{order.createdAt}</span>
                {/* For some reason format isn't working :( */}
              </p>
              <p>
                <span>Order total</span>
                <span>{formatMoney(order.total)}</span>
              </p>
              <p>
                <span>Item count</span>
                <span>{order.items.length}</span>
              </p>
              <div className="items">
                {order.items.map((item) => (
                  <div className="order-item" key={item.id}>
                    <img src={item.image} alt={item.title} />
                    <div className="item-details">
                      <h2>{item.title}</h2>
                      <p>Qty: {item.quantity}</p>
                      <p>Each: {formatMoney(item.price)}</p>
                      <p>SubTotal: {formatMoney(item.price * item.quantity)}</p>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OrderStyles>
          );
        }}
      </Query>
    );
  }
}

export default Order;
