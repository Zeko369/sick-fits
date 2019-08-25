import React from "react";
import Link from "next/link";
import { Mutation } from "react-apollo";

import { TOGGLE_CART_MUTATION } from "./Cart";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import SignOut from "./SignOut";
import CartCount from "./CartCount";

const Nav = () => {
  return (
    <User>
      {({ data: { me }, error }) => (
        <NavStyles>
          <Link href="items">
            <a>Shop</a>
          </Link>
          {me && (
            <>
              <Link href="sell">
                <a>Sell</a>
              </Link>
              <Link href="orders">
                <a>Orders</a>
              </Link>
              <Link href="me">
                <a>Account</a>
              </Link>
              <Mutation mutation={TOGGLE_CART_MUTATION}>
                {(toggleCart) => (
                  <button onClick={toggleCart}>
                    My Cart
                    <CartCount
                      count={me.cart.reduce(
                        (tally, cartItem) => tally + cartItem.quantity,
                        0
                      )}
                    />
                  </button>
                )}
              </Mutation>
            </>
          )}
          {me ? (
            <SignOut />
          ) : (
            <Link href="signup">
              <a>Sign in</a>
            </Link>
          )}
        </NavStyles>
      )}
    </User>
  );
};

export default Nav;
