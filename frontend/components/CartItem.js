import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import formatMoney from "../lib/formatMoney";
import RemoveFromCart from "./RemoveFromCart";

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${(props) => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`;

const CartItem = (props) => {
  if (!props.cartItem.item) {
    return (
      <CartItemStyles>
        <p>Not working :(</p>
        <RemoveFromCart id={id} />
      </CartItemStyles>
    );
  }

  const { id, quantity } = props.cartItem;
  const { title, price, image } = props.cartItem.item;

  return (
    <CartItemStyles>
      <img src={image} alt={title} width="100" />
      <div className="cart-item-details">
        <h3>{title}</h3>
        <p>
          {formatMoney(price * quantity)}
          {" - "}
          <em>
            {quantity} &times; {formatMoney(price)} each
          </em>
        </p>
        <RemoveFromCart id={id} />
      </div>
    </CartItemStyles>
  );
};

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired //todo
};

export default CartItem;
