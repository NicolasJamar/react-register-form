import { useState, useEffect } from "react";
import axios from "../api/axios";

const USERS_URL = '/users';

const Users = () => {
  const [users, setUsers] = useState();


  useEffect( () => {
    let isMounted = true;
    const controller = new AbortController(); // To cancel a request

    const getUsers = async() => {
      try {
        const response = await axios.get(USERS_URL,
          {signal: controller.signal})
        console.log(response.data);
        // if isMounted is true then (&&) do something
        isMounted && setUsers(response.data)
      } catch(err) {
        console.error(err);
      }
    }

    getUsers();

    //clean up function of useEffect
    return () => {
      isMounted = false;
      controller.abort(); // cancel the request
    }
  }, [])

  return(
    <article>
      <h2>User list</h2>
      { users?.length 
        ? ( 
            <ul>
              {users.map( (user, i) => {
                <li key={i} >{user.name}</li>
              })}
            </ul> 
        ) : <p>No user to display</p>
      }
    </article>
  );
}

export default Users