import React, { Component } from "react";
import Downshift, { resetIdCounter } from "downshift";
import Router from "next/router";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";
import debounce from "lodash.debounce";

import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      title
      image
    }
  }
`;

const routeToItem = (item) => {
  Router.push({ pathname: "/item", query: { id: item.id } });
};

class AutoComplete extends Component {
  state = {
    items: [],
    loading: true
  };

  handleChange = debounce(async (event, client) => {
    this.setState({ loading: true });
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: event.target.value }
    });

    const items = res.data.items;
    this.setState({ loading: false, items });
  }, 350);

  render() {
    const { items, loading } = this.state;
    resetIdCounter()

    return (
      <SearchStyles>
        <Downshift
          onChange={routeToItem}
          itemToString={(item) => (item === null ? "" : item.title)}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex
          }) => (
            <div>
              <ApolloConsumer>
                {(client) => (
                  <input
                    type="search"
                    {...getInputProps({
                      type: "search",
                      placeholder: "Search for an item",
                      id: "search",
                      className: loading ? "loading" : "",
                      onChange: (e) => {
                        e.persist();
                        this.handleChange(e, client);
                      }
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {items.map((item, index) => (
                    <DropDownItem
                      {...getItemProps({ item })}
                      key={item.id}
                      highlighted={index === highlightedIndex}
                    >
                      <img width="50" src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {!items.length && !loading && (
                    <DropDownItem>Nothing found for {inputValue}</DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    );
  }
}

export default AutoComplete;
