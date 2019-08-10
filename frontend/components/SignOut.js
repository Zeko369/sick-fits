import React from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

import { CURRENT_USER_QUERY } from "./User";

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      text
    }
  }
`;

const SignOut = (props) => (
  <Mutation
    mutation={SIGNOUT_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signout) => <button onClick={signout}>Sign out</button>}
  </Mutation>
);
export default SignOut;
