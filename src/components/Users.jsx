import { useState, useEffect } from "react";
import axios from "../api/axios";

const USERS_URL = '/users';

const Users = () => {
  const [users, setUsers] = useState();

  useEffect( () => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async() => {
      const response = axios.get(USERS_URL, 
        )
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