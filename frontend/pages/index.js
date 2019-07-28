import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <div>
      <p>Hey</p>
      <Link href="/sell">
        <a>Foobar</a>
      </Link>
    </div>
  );
};

export default Home;
