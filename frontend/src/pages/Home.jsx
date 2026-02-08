import React from 'react'
import Hero from '../components/Hero'
import Category from '../components/Category'
import ShowItems from '../components/ShowItems'
import { useContext } from 'react'
import { AppContext } from "../context/AppContext";


const Home = () => {
    const { token, userData } = useContext(AppContext);
    console.log("User Data:", userData);
    return (
        <div>
            <Hero />
            <Category />
            <ShowItems />
        </div>
    )
}

export default Home
