import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Welcome from './pages/Welcome';
import Main from './pages/Main';
import ExtendPlan from './pages/ExtendPlan';
import About from './pages/About';
import Plans from './pages/Plans';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';
import useToken from './useToken';
import jwt_decode from 'jwt-decode';

function App() {
  const { token, setToken } = useToken();

  useEffect(() => {
    let tokenExpiration;
    if (token) {
      const decodedToken = jwt_decode(token);
      const now = new Date().getTime();
      const expiresIn = decodedToken.exp * 1000 - now;
      const clearExpiredToken = () => {
        setToken(undefined);
        localStorage.removeItem('loginData');
      };
      console.log(expiresIn);
      tokenExpiration = setTimeout(clearExpiredToken, expiresIn);
    }
    return () => {
      if (tokenExpiration) {
        console.log('clear timeout');
        clearTimeout(tokenExpiration);
      }
    };
  }, [token, setToken]);

  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            token ? (
              <Main token={token} setLoginData={setToken} />
            ) : (
              <Welcome setLoginData={setToken} />
            )
          }
        />
        <Route path='/welcome' element={<Welcome setLoginData={setToken} />} />
        <Route
          path='/extend-plan'
          element={
            token ? (
              <ExtendPlan token={token} />
            ) : (
              <Welcome setLoginData={setToken} />
            )
          }
        />
        <Route path='/about' element={<About />} />
        <Route path='/plans' element={<Plans />} />
        <Route path='/legal' element={<Legal />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
