import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import useInput from "../hooks/useInput";

import axios from "../api/axios";
const AUTH_URL = "/auth";

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const userRef = useRef(); //to set the focus on when the component load
  const errRef = useRef();

  const [user, resetUser, userAttribs] = useInput('user', '');
  const [pwd, setPwd] = useState('');

  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd])

  const handleSubmit = async(e) => {
    e.preventDefault(); // the default behavior of the form reload the page

    try {
      const response = await axios.post(AUTH_URL, 
        JSON.stringify({user, pwd}),
        {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({user, pwd, roles, accessToken})
      // clear input fields
      resetUser();
      setPwd('');
      // after log in we want to navigate where the user wanted to go 
      navigate(from, { replace: true });
    } catch(err) {
      if(!err?.response) {
        setErrMsg('No server response');
      } else if(err.response?.status === 400) {
        setErrMsg('Missing username or password')
      } else if(err.response?.status === 401) {
        setErrMsg('Not authorized')
      } else {
        setErrMsg('Login Failed')
      }
      errRef.current.focus(); //set the focus on the error for accessibility
    }
  }

  const togglePersist = () => {
    // take the previous state and change with the opposit
    setPersist(prev => !prev) 
  }

  // we need a useEffect if the persist state changes
  useEffect(() => {
    localStorage.setItem("persist", persist)
  }, [persist])

  return (
    <section>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <h1>Sign In</h1>

      <form onSubmit={handleSubmit}>
        {/*USERNAME*/}
        <label htmlFor="username">Username:</label>
        <input 
          type="text" 
          id="username" 
          ref={userRef}
          autoComplete="off"
          {...userAttribs}
          //onChange={(e) => resetUser(e.target.value)}
          //value={user} //to clear the input after submission
          required
        />

        {/*PASSWORD*/}
        <label htmlFor="password">Password:</label>
        <input 
          type="password" 
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />

        <button>Sign In</button>
        <div className="persistCheck">
          <input 
            type="checkbox"
            id="persist" 
            onChange={togglePersist}
            checked={persist}
          />
          <label htmlFor="persist">Trust This Device</label>
        </div>
        <br />
        <p>
          Need an Account?<br />
          <span className="line">
            <a href="/register">Sign Up</a>
          </span>
        </p>
      </form>
    </section>
  )
}

export default Login;