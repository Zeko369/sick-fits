import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import Error from "./ErrorMessage";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      text
    }
  }
`;

class RequestReset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ""
    };

    this.saveToState = this.saveToState.bind(this);
  }

  saveToState(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { email } = this.state;

    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(requestPasswordReset, { error, loading, called }) => (
          <Form
            method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              await requestPasswordReset();
              this.setState({ email: "" });
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset password</h2>
              <Error error={error} />
              {!error && !loading && called && <p>Success, check email</p>}
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
              <button type="submit">Reset</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default RequestReset;
