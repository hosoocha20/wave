

import Authenticated from './components/Authenticated';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import './styles/App.scss';
import { useCookies } from 'react-cookie';

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userEmail = cookies.Email
  const authToken = cookies.AuthToken;
  //console.log(cookies);
  return (
    <div className="App">
      {!authToken && 
        <LoginPage />
      }
      {/* <LoginPage /> */}
      {/* <Navbar /> */}
      {authToken && 
        <Authenticated />
      }
      

    </div>
  );
}

export default App;
