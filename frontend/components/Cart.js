import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { adopt } from "react-adopt";

import calcTotalPrice from "../lib/calcTotalPrice";
import formatMoney from "../lib/formatMoney";
import User from "./User";
import CartStyles from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import SickButton from "./styles/SickButton";
import CartItem from "./CartItem";
import TakeMyMoney from "./TakeMyMoney";

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Compose = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const Cart = () => {
  return (
    <Compose>
      {({ user, toggleCart, localState }) => {
        const me = user.data.me;
        if (!me) return null;
        console.log(me);

        const data = localState.data;

        return (
          <CartStyles open={data.cartOpen}>
            <header>
              <CloseButton title="close" onClick={toggleCart}>
                &times;
              </CloseButton>
              <Supreme>{me.name}'s Cart</Supreme>
              <p>
                You have {me.cart.length} Item
                {me.cart.length === 1 ? "" : "s"} in your cart
              </p>
            </header>

            <ul>
              {me.cart.map((cartItem, index) => (
                <CartItem key={index} cartItem={cartItem} />
              ))}
            </ul>

            <footer>
              <p>{formatMoney(calcTotalPrice(me.cart))}</p>
              {me.cart.length > 0 && (
                <TakeMyMoney>
                  <SickButton>Checkout</SickButton>
                </TakeMyMoney>
              )}
            </footer>
          </CartStyles>
        );
      }}
    </Compose>
  );
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
