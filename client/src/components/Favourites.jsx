import React, { useEffect, useState } from 'react';
import Card from './Card';

const Favourites = ({ user, setUser }) => {
    const [allfav, setAllfav] = useState([]);

    const handlegetfavourites = async () => {
        try {
            const response = await fetch('http://localhost:1000/api/favourites', {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                console.log(response);
                return; // Exit if the response is not ok
            }
            const data = await response.json();
            
            setAllfav(data);
        } catch (error) {
            console.log('Error fetching favourites', error);
        }
    };

    useEffect(() => {
        handlegetfavourites();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen"> {/* Changed to a lighter background */}
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Favourites</h1>
            <div className="flex flex-wrap justify-center gap-6"> {/* Adjusted gap for better spacing */}
                {user && allfav.length > 0 ? (
                    allfav.map((item, i) => (
                        <div className="w-full sm:w-1/2 lg:w-1/3" key={i}> {/* Fit 2 cards on small screens and 3 on large */}
                            <Card 
                                dish={item} 
                                isfavourites={true} 
                                user={user} 
                                setUser={setUser} 
                                handlegetfavourites={handlegetfavourites} 
                            />
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center w-full">
                        <div className="text-center text-lg text-gray-600">
                            <p>No favourites added yet.</p>
                            <p className="text-sm text-gray-500">Start adding some dishes to your favourites!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favourites;
