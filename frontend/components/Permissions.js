import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

import Error from "./ErrorMessage";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      email
      name
      permissions
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission]
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      permissions
    }
  }
`;

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PREMISSIONUPDATE"
];

const Permissions = (props) => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <div>
        <Error error={error} />
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map((item) => (
                  <th key={item}>{item}</th>
                ))}
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <UserPermissions user={user} key={user.id} />
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
);

class UserPermissions extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array
    }).isRequired
  };

  state = {
    permissions: this.props.user.permissions
  };

  // onChange = (e, updatePermissions) => {
  onChange = (e) => {
    const { checked, value } = e.target;

    this.setState((state) => {
      const { permissions } = state;
      if (checked) {
        return { permissions: [...permissions, value] };
      }
      return { permissions: permissions.filter((item) => item !== value) };
    });

    // updatePermissions(); // from renderprop, state may not be updated (callback on setState)

    // let updatePermissions = [...this.state.permissions];
    // if (checked) {
    //   updatePermissions.push(value);
    // } else {
    //   updatePermissions = updatePermissions.filter((item) => item !== value);
    // }
    // this.setState({ permissions: updatePermissions });
  };

  render() {
    const { permissions } = this.state;
    const { user } = this.props;

    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{ permissions, userId: user.id }}
      >
        {(updatePermissions, { error, loading }) => (
          <>
            {error && <Error error={error} />}
            <tr>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {possiblePermissions.map((permission, index) => (
                <td key={`user-${user.id}-row-${index}`}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      id={`${user.id}-permission-${permission}`}
                      type="checkbox"
                      value={permission}
                      checked={permissions.includes(permission)}
                      // onChange={(e) => this.onChange(e, updatePermissions)} // pass function
                      onChange={this.onChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton
                  onClick={updatePermissions}
                  type="button"
                  disabled={loading}
                >
                  Updat{loading ? "ing" : "e"}
                </SickButton>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    );
  }
}

export default Permissions;
