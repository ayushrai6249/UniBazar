import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./pages/Home";
import Items from "./pages/Items";
import Footer from './components/Footer';
import Item from "./pages/Item";
import About from "./pages/About";
import ContactUs from "./pages/contactPage";
import Register from "./pages/Register";
import AddListing from "./pages/addlisting";
import Login from "./pages/Login";
import MyItems from "./pages/MyItems";
import AdminUsersPage from "./pages/admin/user";
import PrivateRoute from "./routes/PrivateRoute";
import AdminPage from "./pages/admin/home";
import AllItemsPage from "./pages/admin/items";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import OtherProfile from "./pages/OtherProfile";
import ManagerHome from "./pages/admin/managerHome";

function App() {
  const location = useLocation();

  return (
    <div className={'mx-4 sm:mx-[6%]'}>
      <ToastContainer />
      {<Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/:category" element={<Items />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/item/:itemId" element={<Item />} />
        <Route path="/add-listing" element={<AddListing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:profileId" element={<OtherProfile />} />
        <Route path="/admin" element={<PrivateRoute allowedRoles={["admin"]}><AdminPage /></PrivateRoute>} >
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="items" element={<AllItemsPage />} />
        </Route>
        <Route path="/manager" element={<PrivateRoute allowedRoles={["manager"]}><ManagerHome /></PrivateRoute>} >
          <Route index element={<AllItemsPage />} />
          <Route path="items" element={<AllItemsPage />} />
        </Route>
        <Route path="/my-listings" element={<MyItems />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
      {<Footer />}
    </div>
  );
}

export default App;
