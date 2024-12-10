import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import { useEffect, useState } from 'react';
import Profile from './components/Profile';
import CardDetails from './components/CardDetails';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for user fetching
  const [error, setError] = useState(null); // Error state for user fetching

  const [dishes, setDishes] = useState([]);
  const fetchAllDishes = async () => {
      setLoading(true);
      try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dishes`, {
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

  
  
  const fetchUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        method: 'GET',
        credentials: 'include',
      });
      
      const data = await response.json();
      if(response.ok){
        setUser(data);
      }else{
        setUser(null)
      }
    } catch (error) {
      setError(error.message); // Set error message
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or error
    }
  };
  
  useEffect(() => {
    fetchAllDishes();
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      
      <main className="flex-grow bg-gray-100 p-4">
        {loading ? ( // Show loading spinner while fetching user
          <div className="flex justify-center items-center h-screen">
            <div className="loader">Loading...</div> {/* Replace with your loader */}
          </div>
        ) : error ? ( // Show error message if there's an error
          <div className="flex justify-center items-center h-screen">
            <p className="text-red-500">{error}</p>
            <button onClick={fetchUser} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded">
              Retry
            </button>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home user={user} setUser={setUser}/>} />
            <Route path="/cardDetails/:id" element={<CardDetails user={user} allDishes={dishes} setUser={setUser} fetchAllDishes={fetchAllDishes}/>} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} fetchUser={fetchUser}/>} />
            <Route path="/profile" element={user ? <Profile setUser={setUser} user={user} fetchUser={fetchUser}/> : <Navigate to="/login" />} />
          </Routes>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
