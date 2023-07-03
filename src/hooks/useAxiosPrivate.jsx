import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

// we need to create an interceptor in case of the request (with an outdated token) fails
// with it we will provide a new accessToken

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  
  // this hook is just going to return axiosPrivate intance 
  // but we will attach the interceptors to the request and response
  useEffect( () => {
    // the request interceptor is the first attempt
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if(!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
        }
        return config
      }, (error) => Promise.reject(error)
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      // if accessToken has expired
      async(error) => {
        const prevRequest = error?.config; // get the previous req with axios config
        if(error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest)
        }
        return Promise.reject(error)
      }
    );


    return () => {
      // at the end we have to remove the interceptor
      axiosPrivate.interceptors.request.eject(requestIntercept)
      axiosPrivate.interceptors.response.eject(responseIntercept)
    }
    
  }, [auth, refresh])

  return axiosPrivate;

}

export default useAxiosPrivate;