import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";

const AUTH_URL = "/auth";

const Login = () => {
  const { setAuth } = useContext(AuthContext)
  const userRef = useRef(); //to set the focus on when the component load
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

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
      const accessToken = response?.data?.accessTokken;
      const roles = response?.data?.roles;
      setAuth({user, pwd, roles, accessToken})
      setSuccess(true); 
      // clear input fields
      setUser('');
      setPwd('');
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

  return (
    <>
    {success ? (
      <section>
        <h1>Success, you're log in!</h1>
        <br />
        <p>
            <a href="#">Go to Home</a>
        </p>
      </section>
      ) : (
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
            onChange={(e) => setUser(e.target.value)}
            value={user} //to clear the input after submission
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

          <button>
            Sign In
          </button>
          <p>
            Need an Account?<br />
            <span className="line">
                {/*put router link here*/}
                <a href="#">Sign Up</a>
            </span>
          </p>
        </form>

      </section>
      )}
    </>
  )
}

export default Login;