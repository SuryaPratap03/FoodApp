import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';

const Home = ({ user, setUser }) => {
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dishes, setDishes] = useState([]);

    const fetchAllDishes = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:1000/api/dishes', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            console.log("Fetched data:", data);
            setDishes(data.data);
        } catch (error) {
            console.log("Error fetching dishes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllDishes();
    }, []);

    if (loading) {
        return <div className="text-center text-xl mt-10">Loading... Please Wait</div>;
    }

    const starters = dishes.filter(dish => dish.CategoryName === "Starter").slice(0, 6);
    const pizzas = dishes.filter(dish => dish.CategoryName === "Pizza").slice(0, 6);
    const biryaniRice = dishes.filter(dish => dish.CategoryName === "Biryani/Rice").slice(0, 6);

    const filteredDishes = dishes.filter(dish => 
        dish.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-center mb-10 text-green-800 shadow-md p-4 bg-green-100 rounded-lg">Our Delicious Dishes</h1>
            
            {/* Search Bar */}
            {user ? (
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search for dishes..."
                        className="border border-gray-300 rounded-lg w-full p-2"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            ) : (
                <div className="text-center mb-4">Please log in to search for dishes.</div>
            )}

            {/* Filtered Dishes Section */}
            {searchTerm && (
                <section className="mb-8">
                    <h2 className="text-3xl font-semibold mb-4 text-green-700 border-b-2 border-green-300 pb-1">Search Results</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredDishes.length > 0 ? (
                            filteredDishes.map((item) => (
                                <div key={item._id}>
                                    <Card dish={item} user={user} setUser={setUser} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center col-span-full text-lg text-gray-500">
                                No dishes found for "{searchTerm}".
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Starters Section */}
            <section className="mb-8">
                <h2 className="text-3xl font-semibold mb-4 text-green-700 border-b-2 border-green-300 pb-1">Starters</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {starters.length > 0 ? (
                        starters.map((item) => (
                            <div key={item._id}>
                                <Card dish={item} user={user} setUser={setUser} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center col-span-full text-lg text-gray-500">
                            No Starters available.
                        </div>
                    )}
                </div>
            </section>

            {/* Pizza Section */}
            <section className="mb-8">
                <h2 className="text-3xl font-semibold mb-4 text-green-700 border-b-2 border-green-300 pb-1">Pizza</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {pizzas.length > 0 ? (
                        pizzas.map((item) => (
                            <div key={item._id}>
                                <Card dish={item} user={user} setUser={setUser} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center col-span-full text-lg text-gray-500">
                            No Pizzas available.
                        </div>
                    )}
                </div>
            </section>

            {/* Biryani/Rice Section */}
            <section className="mb-8">
                <h2 className="text-3xl font-semibold mb-4 text-green-700 border-b-2 border-green-300 pb-1">Biryani/Rice</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {biryaniRice.length > 0 ? (
                        biryaniRice.map((item) => (
                            <div key={item._id}>
                                <Card dish={item} user={user} setUser={setUser} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center col-span-full text-lg text-gray-500">
                            No Biryani/Rice available.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
