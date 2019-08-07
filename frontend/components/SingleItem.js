import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Head from "next/head";

import Error from "./ErrorMessage";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
    }
  }
`;

const SingleItemStyled = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${(props) => props.theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;

  img {
    height: 100%;
    width: 100%;
    object-fit: contain; /* cover */
  }

  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`;

class SingleItem extends Component {
  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ error, loading, data }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No item :(</p>;

          const { largeImage, title, description } = data.item;

          return (
            <>
              <Head>
                <title>Sick Fits | {title}</title>
              </Head>
              <SingleItemStyled>
                <img src={largeImage} alt={title} />
                <div className="details">
                  <h2>Viewing {title}</h2>
                  <p>{description}</p>
                </div>
              </SingleItemStyled>
            </>
          );
        }}
      </Query>
    );
  }
}

export default SingleItem;
