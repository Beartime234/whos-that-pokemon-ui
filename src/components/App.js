import React from 'react';
import Header from './Header';
import Navigation from './Navigation';

const App = () => {
    return (
        <div>
            <Header title="Who's That Pokémon!" />
            <div className="mt-5"/>
            <div className="mt-5">
                <Navigation/>
            </div>
        </div>

    );
};

export default App;