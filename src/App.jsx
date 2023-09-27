import './App.css'

import Navbar from './components/navbar';

import {createBrowserRouter,createRoutesFromElements,Route,Outlet,RouterProvider } from 'react-router-dom'
import Home from './pages/home';
import Footer from './components/footer';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Root />}>
        <Route index element={<Home />} path='/'/>
      </Route>
    )
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