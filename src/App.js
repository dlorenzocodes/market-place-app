import Contact from './pages/Contact'
import Listing from './pages/Listing'
import SignIn from '../src/pages/SignIn'
import SignUp from '../src/pages/SignUp'
import Offers from '../src/pages/Offers'
import Explore from '../src/pages/Explore'
import Profile from '../src/pages/Profile'
import Category from '../src/pages/Category'
import NavBar from '../src/components/NavBar'
import EditListing from './pages/EditListing'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import CreateListings from '../src/pages/CreateListing'
import ForgotPassword from '../src/pages/ForgotPassword'
import PrivateRoute from '../src/components/PrivateRoute'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<Explore />}/>
          <Route path='/offers' element={<Offers />}/>
          <Route path='/category/:categoryName' element={<Category />} />
          <Route path='/category/:categoryName/:id' element={<Listing />} />
          <Route path='/contact/:landlordId/' element={<Contact/>} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />}/>
          </Route>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/sign-up' element={<SignUp />}/>
          <Route path='/forgot-password' element={<ForgotPassword />}/>
          <Route path='/create-listing' element={<CreateListings />} />
          <Route path='/edit-listing/:listingId' element={<EditListing />} />
        </Routes>
        <NavBar />
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
