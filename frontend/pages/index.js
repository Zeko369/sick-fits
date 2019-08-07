import React from "react";
import Items from "../components/Items";

const Home = (props) => {
  const { page } = props.query;

  return (
    <div>
      <Items page={parseInt(page) || 1} />
    </div>
  );
};

export default Home;
