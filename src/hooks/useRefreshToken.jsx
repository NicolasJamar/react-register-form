import axios from "../api/axios"
import useAuth from "./useAuth"

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  // Here we refresh the token if the first attempt failed with the previous token 
  const refresh = async() => {
    const response = await axios.get('/refresh', {
      withCredentials: true
    });
    setAuth(prev => {
      console.log(JSON.stringify(prev)); // to look the previous state
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken }
    })
    return response.data.accessToken;
  }
  return refresh;
}

export default useRefreshToken