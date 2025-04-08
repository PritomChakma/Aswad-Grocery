import React from 'react';
import Banner from './HomePage/Banner';
import Category from './HomePage/Category/Category';
import Meat from '../Components/Meat/Meat';

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