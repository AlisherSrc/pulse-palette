import './App.css'

import { React, useState, createContext, useEffect } from 'react';
import Navbar from './components/navbar';
import { createBrowserRouter, createRoutesFromElements, Route, Outlet, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import Footer from './components/footer';
import PlaylistBuilder from './pages/playlistbuilder';
import Profile from './pages/profile';
import Playlist from './pages/playlist';
import Group from './pages/group'
import ErrorComponent from './components/error';
import Register from './pages/register';
import Login from './pages/login';
import PlaylistEditor from './pages/playlistEditor';
import Settings from './pages/settings';


export const Context = createContext();

// context provider

const ContextdbProvider = ({ children }) => {
  const [userCreatedPlaylists, setUserCreatedPlaylists] = useState([]);
  const [customUser, setCustomUser] = useState({});

  return (
    <Context.Provider value={{ userCreatedPlaylists, setUserCreatedPlaylists, customUser, setCustomUser }}>
      {children}
    </Context.Provider>
  )
}

function App() {

  useEffect(() => {
    const updateOnlineStatus = async () => {
      if (navigator.onLine) {
        console.log('You are now online.');
  
        // Unregister service workers
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          registration.unregister();
        }
  
        // Clear all caches
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
  
        // Reload the page to reflect updates
        window.location.reload();
      } else {
        console.log('You are still offline.');
      }
    };
  
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  
    // Clean up listeners when the component unmounts
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root />} errorElement={<ErrorComponent />}>
        <Route index element={<Home />} path='/' />
        <Route element={<PlaylistBuilder />} path='/playlist-builder' />
        <Route element={<Profile />} path='/profile' />
        <Route element={<Playlist />} path='/playlist/:id' />
        <Route element={<Group />} path='/group/:id' />
        <Route element={<Register />} path='/signup' />
        <Route element={<Login />} path='/login' />
        <Route element={<PlaylistEditor />} path='playlist/:id/edit' />
        <Route element={<Settings />} path='/settings' />
      </Route>
    ),

  )



  return (
    <main>
      <ContextdbProvider>
        <RouterProvider router={router} />
      </ContextdbProvider>

    </main>
  )
}

export default App


const Root = () => {
  return (
    <>
      <Navbar />

      <div>
        {/* page placeholder */}
        <Outlet />
      </div>

      <Footer />
    </>
  )
}