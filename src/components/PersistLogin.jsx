import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";


// Component to keep login after refresh
const PersistLogin = () => {
  const effectRan = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const refreshToken = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect( () => {
    const verifyRefreshToken = async () => {
      try {
        await refreshToken(); //sent a cookie to the /refresh endpoint 
        // which will send back a new accessToken. 
        // We will do that before we get the require auth component
      } catch(err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if(effectRan.current === true) {
      // we want to call the function only if we don't have an accessToken
      !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }

    return () => {
      effectRan.current = true
    }
  },[]) // the empty dependency array means that 
  // we want to run useEffect only when the component loads

  useEffect( () => {
    console.log('isLoading :', isLoading);
    console.log('accesToken from PersistLogin :', JSON.stringify(auth?.accessToken));
  }, [isLoading])

  return(
    <>
      {!persist 
        ? <Outlet />
        : isLoading 
          ? <p>Loading...</p>
          : <Outlet />
      }
    </>
  )
}

export default PersistLogin;