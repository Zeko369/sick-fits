import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgress from "nprogress";
import PropTypes from "prop-types";
import gql from "graphql-tag";

import calcTotalPrice from "../lib/calcTotalPrice";
import Error from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

const totalItems = (cart) =>
  cart.reduce((all, cartItem) => all + cartItem.quantity, 0);

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`;

class TakeMyMoney extends Component {
  onToken = (res, createOrder) => {
    NProgress.start();
    createOrder({ variables: { token: res.id } })
      .then((order) => {
        Router.push({
          pathname: "/order",
          query: {
            id: order.data.createOrder.id
          }
        });
      })
      .catch((error) => alert(error.message));
  };

  render() {
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {(createOrder) => (
              <StripeCheckout
                stripeKey={"pk_test_roOmRmr8yHAeyJGjEcFgn9IW001JBlM8Cx"}
                amount={calcTotalPrice(me.cart)}
                name="Sick fits"
                description={`Order of ${totalItems(me.cart)} items`}
                image={
                  me.cart.length && me.cart[0].item && me.cart[0].item.image
                }
                currency="USD"
                email={me.email}
                token={(res) => this.onToken(res, createOrder)}
              >
                {this.props.children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    );
  }
}

export default TakeMyMoney;
