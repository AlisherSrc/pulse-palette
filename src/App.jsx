import './App.css'

import Navbar from './components/navbar';

import {createBrowserRouter,createRoutesFromElements,Route,Outlet,RouterProvider } from 'react-router-dom'
import Home from './pages/home';
import Footer from './components/footer';
import PlaylistBuilder from './pages/playlistbuilder';
import Profile from './pages/profile';
import Playlist from './pages/playlist';
import Group from './pages/group'
import ErrorComponent from './components/error';
import Register from './pages/register';
import Login from './pages/login';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root />} errorElement={<ErrorComponent />}>
        <Route index element={<Home />} path='/'/>
        <Route element={<PlaylistBuilder />} path='/playlist-builder'/>
        <Route element={<Profile />} path='/profile'/>
        <Route element={<Playlist />} path='/playlist/:id'/>
        <Route element={<Group />} path='/group/:id'/>
        <Route element={<Register />} path='/signup' />
        <Route element={<Login />} path='/login' />
      </Route>
    ),
    
  )



  return (
    <main>
      <RouterProvider router={router}/>
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