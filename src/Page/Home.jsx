import React from "react";
import Meat from "../Components/Meat/Meat";
import Banner from "./HomePage/Banner";
import Category from "./HomePage/Category/Category";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <Category></Category>
      <Meat></Meat>
    </div>
  );
};

export default Home;
