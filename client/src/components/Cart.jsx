import React, { useEffect, useState } from 'react';

const Cart = ({ user }) => {
    const [allCart, setAllCart] = useState([]);

    const handleGetCart = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
                method: 'GET',
                credentials: 'include'
            });
            if (!response.ok) {
                console.log(response);
                return; // Exit if the response is not ok
            }
            const data = await response.json();
            setAllCart(data);
        } catch (error) {
            console.log('Error fetching cart items', error);
        }
    };

    const handleRemoveFromCart = async (dishId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/remove/${dishId}`, {
                method: 'POST',
                credentials: 'include'
            });
            if (response.ok) {
                alert('Item removed from cart successfully!'); // Alert on success
                handleGetCart(); // Fetch the cart again after removing an item
            } else {
                alert('Error removing item from cart.'); // Alert on error
                console.log('Error removing item from cart');
            }
        } catch (error) {
            alert('Error removing item from cart. Please try again.'); // Alert on catch
            console.log('Error removing item from cart', error);
        }
    };

    const handleCheckout = () => {
        // Implement checkout functionality here
        alert("Proceeding to checkout..."); // Alert on checkout
        console.log("Proceeding to checkout...");
    };

    const calculateTotal = () => {
        return allCart.reduce((total, item) => total + (item.finalPrice * item.quantity), 0);
    };

    useEffect(() => {
        handleGetCart();
    }, []);

    const total = calculateTotal();

    return (
        <div className="p-4">
            {user && allCart && allCart.length > 0 ? (
                <div>
                    {allCart.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border rounded p-4 mb-4 bg-gray-800">
                            <div className="flex items-center">
                                <img 
                                    src={item.dish.img} 
                                    alt={item.dish.name} 
                                    className="w-16 h-16 object-cover rounded mr-4" 
                                />
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{item.dish.name}</h3>
                                    <p className="text-gray-300">{item.dish.description}</p>
                                    <p className="text-gray-400">Category: {item.dish.category}</p>
                                    <p className="text-gray-300">Price: ₹{item.finalPrice}</p>
                                    <p className="text-gray-300">Quantity: {item.quantity}</p>
                                    <p className="text-lg font-bold text-white">Total: ₹{item.finalPrice * item.quantity}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleRemoveFromCart(item.dish.id)} 
                                className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-200"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <div className="flex justify-between items-center mt-4">
                        <button 
                            className="w-full py-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-500 cursor-default"
                        >
                            Total: ₹{total}
                        </button>
                        <button 
                            onClick={handleCheckout} 
                            className="ml-4 px-6 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition duration-200"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center text-lg text-gray-500">
                    No items in the cart.
                </div>
            )}
        </div>
    );
};

export default Cart;
