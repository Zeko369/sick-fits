import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";

import Form from "./styles/Form";
import Error from "./ErrorMessage";

const CREATE_ITEM_QUERY = gql`
  mutation CREATE_ITEM_QUERY(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: "Foobar",
    description: "This is a foo bar",
    price: 123,
    image: "dog.jpg",
    largeImage: "large-dog.jpg",
    uploadingImage: false
  };

  // constructor(props) {
  //   this.onChange = this.onChange.bind(this);
  // } // arrow functions or this

  onChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseInt(value) : value;
    this.setState({ [name]: val });
  };

  uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sickfits");

    this.setState({ uploadingImage: true });

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dnwsfi7de/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const file = await res.json();

    this.setState({
      uploadingImage: false,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    });
  };

  render() {
    const { title, description, price, image, uploadingImage } = this.state;

    return (
      <Mutation mutation={CREATE_ITEM_QUERY} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const res = await createItem();
              Router.push({
                pathname: "/item",
                query: { id: res.data.createItem.id }
              });
            }}
          >
            <Error error={error} />
            <fieldset disabled={loading || uploadingImage} aria-busy={loading}>
              <label htmlFor="file">
                image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="file"
                  onChange={this.uploadFile}
                  required
                />
                {image && <img src={image} alt={image} width="200" />}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={title}
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
                  value={price}
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
                  value={description}
                  onChange={this.onChange}
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_QUERY };
