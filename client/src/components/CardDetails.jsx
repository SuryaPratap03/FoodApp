import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from './Card';

const CardDetails = ({ allDishes, user, setUser }) => {
    const { id } = useParams();
    const [dish, setDish] = useState(null);
    const [relatedDishes, setRelatedDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState('');
    const [finalPrice, setFinalPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isFavourite, setIsFavourite] = useState(false);

    // Fetch dish details
    const fetchDishDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dishes/${id}`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            setDish(data.data);
            setSelectedOption(data.data.CategoryName === "Pizza" ? data.data.options[0].regular : data.data.options[0].half);
            setIsFavourite(data.data.isFavourite); // Assuming API provides this
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDishDetails();
    }, [id]);

    // Filter related dishes based on similar name or category
    useEffect(() => {
        if (dish) {
            const similarDishes = allDishes?.filter(item =>
                (item.name === dish.name || item.CategoryName === dish.CategoryName) &&
                item._id !== dish._id // Exclude the current dish
            );
            setRelatedDishes(similarDishes.slice(0, 6)); // Show a maximum of 6 related dishes
        }
    }, [dish, allDishes]);

    // Update final price whenever the selected option changes
    useEffect(() => {
        const validPrice = selectedOption?.replace(/[^0-9.]/g, '');
        setFinalPrice(Number(validPrice));
    }, [selectedOption]);

    // Handle option change
    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    // Handle quantity change
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        setQuantity(isNaN(value) ? 1 : value); // Ensure quantity is a valid number
    };

    // Add to cart
    const handleAddToCart = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/add/${dish._id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'final-price': finalPrice * quantity, // Send the final price as a header
                    'quantity': quantity // Send the quantity as a header
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to add to cart.'); // Alert on error
                return;
            }

            const data = await response.json();
            setUser(data.user); // Update the user state
            alert('Successfully added to cart!'); // Alert on success
        } catch (error) {
            console.error('Error adding to cart', error);
            alert('Error adding to cart. Please try again.'); // Alert on catch
        } finally {
            setLoading(false);
        }
    };

    // Add to favourites
    const handleAddToFavourites = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favourites/add/${dish._id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to add to favourites.'); // Alert on error
                return;
            }

            const data = await response.json();
            setIsFavourite(true);
            setUser(data.user); // Update the user state
            alert('Successfully added to favourites!'); // Alert on success
        } catch (error) {
            console.error('Error adding to favourites', error);
            alert('Error adding to favourites. Please try again.'); // Alert on catch
        } finally {
            setLoading(false);
        }
    };

    // Remove from favourites
    const handleRemoveFromFavourites = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/favourites/remove/${dish._id}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to remove from favourites.'); // Alert on error
                return;
            }

            const data = await response.json();
            setIsFavourite(false);
            setUser(data.user); // Update the user state
            alert('Successfully removed from favourites!'); // Alert on success
        } catch (error) {
            console.error('Error removing from favourites', error);
            alert('Error removing from favourites. Please try again.'); // Alert on catch
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return <div className="text-center text-xl mt-10">Loading... Please Wait</div>;
    }

    // Dish not found
    if (!dish) {
        return <div className="text-center text-xl mt-10">Dish not found.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row mb-8">
                {/* Dish Image */}
                <div className="md:w-1/2 mb-4 md:mb-0">
                    <img className="rounded-lg shadow-lg" src={dish.img} alt={dish.name} />
                </div>
                <div className="md:w-1/2 md:pl-4">
                    <h1 className="text-4xl font-bold mb-4 text-green-800">{dish.name}</h1>
                    <p className="text-lg text-gray-700 mb-4">{dish.description}</p>
                    <h2 className="text-2xl text-green-600 mb-4">Category: {dish.CategoryName}</h2>

                    {/* Price Options */}
                    {user ? (
                        <div className="text-black mb-4">
                            <h6 className="font-semibold mb-1">Price Options:</h6>
                            <select
                                className="h-10 px-2 bg-green-600 rounded-lg text-white"
                                value={selectedOption}
                                onChange={handleOptionChange}
                            >
                                {dish.CategoryName === "Pizza" ? (
                                    <>
                                        <option value={dish.options[0].regular}>Regular: ₹{dish.options[0].regular}</option>
                                        <option value={dish.options[0].medium}>Medium: ₹{dish.options[0].medium}</option>
                                        <option value={dish.options[0].large}>Large: ₹{dish.options[0].large}</option>
                                    </>
                                ) : (
                                    <>
                                        <option value={dish.options[0].half}>Half: ₹{dish.options[0].half}</option>
                                        <option value={dish.options[0].full}>Full: ₹{dish.options[0].full}</option>
                                    </>
                                )}
                            </select>
                        </div>
                    ) : (
                        <div className="text-black mb-4">
                            <p className="text-red-500 mb-2">Please log in to see price options.</p>
                        </div>
                    )}

                    {/* Quantity Selector */}
                    {user ? (
                        <div className="text-black mb-4">
                            <h6 className="font-semibold mb-1">Quantity:</h6>
                            <input
                                type="number"
                                className="h-10 px-2 bg-gray-600 rounded-lg text-white"
                                value={quantity}
                                min="1"
                                onChange={handleQuantityChange}
                            />
                        </div>
                    ) : null}

                    {/* Final Price */}
                    {user && (
                        <div className="text-black mb-4">
                            <h6 className="font-semibold mb-1">Final Price:</h6>
                            <p className="text-lg font-bold">₹{finalPrice * quantity}</p>
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    {user ? (
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                            onClick={handleAddToCart}
                            disabled={loading}
                        >
                            {loading ? 'Adding to Cart...' : 'Add To Cart'}
                        </button>
                    ) : null}

                    {/* Favourites Button */}
                    {user ? (
                        <button
                            className={`${
                                isFavourite ? 'bg-red-500' : 'bg-blue-500'
                            } text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition duration-200`}
                            onClick={isFavourite ? handleRemoveFromFavourites : handleAddToFavourites}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
                        </button>
                    ) : null}

                    {/* Login and Signup Links */}
                    {!user && (
                        <div className="mt-4">
                            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 mr-2">
                                Login
                            </Link>
                            <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200">
                                Signup
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Dishes */}
            {relatedDishes.length > 0 && (
                <div>
                    <h2 className="text-3xl font-semibold mb-4">Related Dishes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {relatedDishes.map((relatedDish) => (
                            <Card key={relatedDish._id} dish={relatedDish} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardDetails;
