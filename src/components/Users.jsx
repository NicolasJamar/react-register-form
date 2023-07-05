import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";

const USERS_URL = '/users';

const Users = () => {
  const effectRan = useRef(false);

  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect because we want to wait component is mounted before loading
  useEffect( () => {
    let isMounted = true;
    const controller = new AbortController(); // To cancel a request

    const getUsers = async() => {
      try {
        const response = await axiosPrivate.get(USERS_URL,
          {signal: controller.signal})
          console.log(response.data);
          // if isMounted is true then (&&) do something
          isMounted && setUsers(response.data)
        } catch(err) {
          console.error(err);
          // to redirect where the user come from
          navigate('/login', { state: { from: location }, replace: true });
        }
      }
    
    // to stop useEffect from running twice on mount or first render
    if(effectRan.current === true) {
      getUsers();
    }
      
    //clean up function of useEffect
    return () => {
      isMounted = false;
      controller.abort(); // cancel the request
      effectRan.current = true
    }
  }, [])

  return(
    <article>
      <h2>User list</h2>
      { users?.length 
        ? ( 
            <ul>
              {users.map( (user, i) => 
                <li key={i} >{user.username}</li>
              )}
            </ul> 
        ) : <p>No user to display</p>
      }
    </article>
  );
}

export default Users