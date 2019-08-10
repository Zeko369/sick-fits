import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };

    this.saveToState = this.saveToState.bind(this);
  }

  saveToState(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { email, name, password } = this.state;

    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        variables={this.state}
      >
        {(signin, { error, loading }) => (
          <Form
            method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              await signin();
              this.setState({ email: "", password: "" });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign in</h2>
              <Error error={error} />
              <label htmlFor="email">
                email
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="password">
                password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={this.saveToState}
                />
              </label>
              <button type="submit">Sign in</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default SignIn;
