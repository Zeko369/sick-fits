import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import Error from "./ErrorMessage";
import { CURRENT_USER_QUERY } from "./User";

// maybe make like him to check on backend
const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION($resetToken: String!, $password: String!) {
    resetPassword(resetToken: $resetToken, password: $password) {
      id
      email
      name
    }
  }
`;

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      confirmPassword: ""
    };

    this.saveToState = this.saveToState.bind(this);
  }

  saveToState(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { password, confirmPassword } = this.state;
    const passwordMatch = password === confirmPassword && password !== "";

    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
        variables={{ ...this.state, resetToken: this.props.token }}
      >
        {(requestPasswordReset, { error, loading }) => (
          <Form
            method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              if (passwordMatch) {
                await requestPasswordReset();
                this.setState({ confirmPassword: "", password: "" });
              }
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset password</h2>
              <Error error={error} />
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
              <label htmlFor="confirmPassword">
                confirm password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="confirmPassword"
                  value={confirmPassword}
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

export default ResetPassword;
