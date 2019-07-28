import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import gql from "graphql-tag";

import Form from "./styles/Form";
import Error from "./ErrorMessage";

const UPDATE_ITEM_QUERY = gql`
  mutation UPDATE_ITEM_QUERY(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
    }
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  onChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseInt(value) : value;
    this.setState({ [name]: val });
  };

  onSubmit = async (e, updateItem) => {
    e.preventDefault();
    console.log(this.state);

    const res = await updateItem({
      variables: {
        id: this.props.id,
        ...this.state
      }
    });
  };

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No data :(</p>;

          const { title, description, price } = data.item;

          return (
            <Mutation mutation={UPDATE_ITEM_QUERY} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this.onSubmit(e, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        defaultValue={title}
                        onChange={this.onChange}
                        required
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        defaultValue={price}
                        onChange={this.onChange}
                        required
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        defaultValue={description}
                        onChange={this.onChange}
                        required
                      />
                    </label>
                    <button type="submit">
                      Sav{loading ? "ing" : "e"} changes
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_QUERY, SINGLE_ITEM_QUERY };
