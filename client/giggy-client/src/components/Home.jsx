import React from 'react';
import Banner from './Banner';
import FeaturedTasks from './FeaturedTasks';
import Steps from './Steps';
import Wisdom from './Wisdom';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <FeaturedTasks />
            <Steps />
            <Wisdom />
        </div>
    );
};

export default Home;