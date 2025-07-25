import React from 'react';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import { Outlet } from 'react-router';
import Testimonial from './Testimonial';
import FeaturedServices from './FeaturedServices';
import TipsAndTricks from './TipsAndTricks';
import CareerGuidance from './CareerGuidance';
import Footer from './Footer';
import TopWorkers from './TopWorkers';


const Home = () => {
    return (
        <div>
            <div className='container mx-auto'>
            <HeroSection></HeroSection>
            
            <Outlet></Outlet>
            <TopWorkers></TopWorkers>
            <Testimonial></Testimonial>
            <FeaturedServices></FeaturedServices>
            <TipsAndTricks></TipsAndTricks>
            <CareerGuidance></CareerGuidance>
            
        </div>
       
        </div>
    );
};

export default Home;