import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Card = ({ dish, isfavourites, iscart, user, setUser, handlegetfavourites }) => {
    const [selectedOption, setSelectedOption] = useState(
        dish.CategoryName === "Pizza" ? dish.options[0].regular : dish.options[0].half
    );
    const [finalPrice, setFinalPrice] = useState(Number(selectedOption));
    const [quantity, setQuantity] = useState(1); // Default quantity of 1
    const [loading, setLoading] = useState(false);
    const [isFavourite, setIsFavourite] = useState(isfavourites);

    // Update final price whenever the selected option changes
    useEffect(() => {
        const validPrice = selectedOption.replace(/[^0-9.]/g, '');
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
            const response = await fetch(`http://localhost:1000/api/cart/add/${dish._id}`, {
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

    // Remove from cart
    const handleRemoveFromCart = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:1000/api/cart/remove/${dish._id}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to remove from cart.'); // Alert on error
                return;
            }

            const data = await response.json();
            setUser(data.user); // Update the user state
            alert('Successfully removed from cart!'); // Alert on success
        } catch (error) {
            console.error('Error removing from cart', error);
            alert('Error removing from cart. Please try again.'); // Alert on catch
        } finally {
            setLoading(false);
        }
    };

    // Add to favourites
    const handleAddToFavourites = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:1000/api/favourites/add/${dish._id}`, {
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
            handlegetfavourites(); // Refresh the favourites list
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
            const response = await fetch(`http://localhost:1000/api/favourites/remove/${dish._id}`, {
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
            handlegetfavourites(); // Refresh the favourites list
            alert('Successfully removed from favourites!'); // Alert on success
        } catch (error) {
            console.error('Error removing from favourites', error);
            alert('Error removing from favourites. Please try again.'); // Alert on catch
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center">
            <div className="max-w-md rounded-lg overflow-hidden shadow-lg m-4 bg-gray-800 transition-transform duration-300 transform hover:scale-105">
                {/* Dish Image */}
                <NavLink key={dish._id} to={`/cardDetails/${dish._id}`} className="block">
                <img className="w-full h-40 object-cover" src={dish.img} alt={dish.name} />
                </NavLink>

                {/* Card Content */}
                <div className="p-4">
                    <h5 className="font-bold text-xl mb-1 text-white truncate">{dish.name}</h5>
                    <p className="text-gray-300 text-sm mb-3">{dish.description}</p>
                    <p className="text-xs text-gray-400 mb-2">Category: {dish.CategoryName}</p>

                    {/* Price Options and Quantity only show if user is logged in */}
                    {user && (
                        <>
                            {/* Price Options */}
                            <div className="text-white mb-4">
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

                            {/* Quantity Selector */}
                            <div className="text-white mb-4">
                                <h6 className="font-semibold mb-1">Quantity:</h6>
                                <input
                                    type="number"
                                    className="h-10 px-2 bg-gray-600 rounded-lg text-white"
                                    value={quantity}
                                    min="1"
                                    onChange={handleQuantityChange}
                                />
                            </div>

                            {/* Final Price */}
                            <div className="text-white mb-4">
                                <h6 className="font-semibold mb-1">Final Price:</h6>
                                <p className="text-lg font-bold">₹{finalPrice * quantity}</p>
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    {user && !iscart && (
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                            onClick={handleAddToCart}
                            disabled={loading}
                        >
                            {loading ? 'Adding to Cart...' : 'Add To Cart'}
                        </button>
                    )}

                    {iscart && (
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                            onClick={handleRemoveFromCart}
                            disabled={loading}
                        >
                            {loading ? 'Removing...' : 'Remove From Cart'}
                        </button>
                    )}

                    {/* Favourites Button */}
                    {user && (
                        <button
                            className={`${
                                isFavourite ? 'bg-red-500' : 'bg-yellow-500'
                            } text-white px-4 py-2 rounded-lg mt-2 hover:bg-opacity-80 transition duration-200`}
                            onClick={isFavourite ? handleRemoveFromFavourites : handleAddToFavourites}
                            disabled={loading}
                        >
                            {loading
                                ? isFavourite
                                    ? 'Removing from Favourites...'
                                    : 'Adding to Favourites...'
                                : isFavourite
                                ? 'Remove from Favourites'
                                : 'Add to Favourites'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Card