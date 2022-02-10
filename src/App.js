import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import NavBar from '../src/components/NavBar'
import Explore from '../src/pages/Explore'
import Offers from '../src/pages/Offers'
import Profile from '../src/pages/Profile'
import SignIn from '../src/pages/SignIn'
import SignUp from '../src/pages/SignUp'
import ForgotPassword from '../src/pages/ForgotPassword'


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<Explore />}/>
          <Route path='/offers' element={<Offers />}/>
          <Route path='/profile' element={<Profile />}/>
          <Route path='/sign-in' element={<SignIn />}/>
          <Route path='/sign-up' element={<SignUp />}/>
          <Route path='/forgot-password' element={<ForgotPassword />}/>
        </Routes>
        <NavBar />
      </Router>
    </>
  );
}

export default App;
