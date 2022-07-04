import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Welcome from './pages/Welcome';
import Main from './pages/Main';
import ExtendPlan from './pages/ExtendPlan';
import About from './pages/About';
import Plans from './pages/Pricing';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';
import useToken from './hooks/useToken';
import jwt_decode from 'jwt-decode';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

const queryClient = new QueryClient();

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
        localStorage.removeItem('token');
      };
      console.log('token expires in', expiresIn);
      tokenExpiration = setTimeout(clearExpiredToken, expiresIn);
    }
    return () => {
      if (tokenExpiration) {
        console.log('clear timeout');
        clearTimeout(tokenExpiration);
      }
    };
  }, [token, setToken]);

  const isValid = (tkn) => {
    return tkn.licence_expiration !== null;
  };

  // api calls code to awake the microservices
  useEffect(() => {
    Promise.all([
      fetch(`https://saas-22-18-frontend-listener.herokuapp.com/`),
      fetch(`${process.env.REACT_APP_ATL}/`),
      fetch(`${process.env.REACT_APP_AGPT}/`),
      fetch(`${process.env.REACT_APP_PF}/`),
    ])
      .then(function (responses) {
        // Get a JSON object from each of the responses
        console.clear();
        console.log('Apis Awakened');
        console.log(responses);
      })
      .catch(function (error) {
        console.clear();
        console.log('No response. An error occured');
      });
  }, []);
  // end of api calls code to awake the microservices

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          path='/'
          element={
            token ? (
              isValid(jwt_decode(token)) ? (
                <Main token={token} setLoginData={setToken} />
              ) : (
                <ExtendPlan token={token} setLoginData={setToken} />
              )
            ) : (
              <Welcome setLoginData={setToken} />
            )
          }
        />
        <Route
          path='/extend-plan'
          element={
            token ? (
              <ExtendPlan token={token} setLoginData={setToken} />
            ) : (
              <Welcome setLoginData={setToken} />
            )
          }
        />
        <Route path='/about' element={<About />} />
        <Route path='/pricing' element={<Plans />} />
        <Route path='/legal' element={<Legal />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <ReactQueryDevtools initialIsOpem={false} position='bottom-right' />
    </QueryClientProvider>
  );
}

export default App;
