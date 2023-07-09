import {useState, createContext} from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // children represents the components nested inside the AuthProvider
  const [auth, setAuth] = useState({});
  // a boolean for the trust device 
  const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false)

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;