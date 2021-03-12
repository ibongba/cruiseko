import React, { useContext, useEffect, useState } from 'react';
import TableBooking from '../../../components/frontend/table/TableBooking';
import Layout from '../../../components/frontend/layout/Layout';
import UserContext from '../../../contexts/UserContext';
import api from '../../../utils/api';
import AuthService from '../../../utils/AuthService';

const Login = ({ t }) => {
  const [loading, setLodding] = useState(false);
  const [error,setError] = useState()
  const { fetchUser } = useContext(UserContext)

  useEffect(() => {
    
  },[]);

  const login = (e)=>{
    e.preventDefault()
    // var form = document.getElementById(e.target)
    var form_data = new FormData(e.target)
    api.login(form_data)
    .then(res => {
      console.log(res.data)
      AuthService.setToken(res.data.token)
      AuthService.setProfile({user_id : res.data.user_id})
      fetchUser()
      // Router.push('/')
      window.location = '/'

    })
    .catch(err => {
      if(!err.response) return;

      setError(err.response.data.error)
    })
  }
  
  return (
    <Layout loading={loading} title="My Boogking" page={'booking'} banner={false}>
      <div className="container start-content">
        <aside className="main-content border-r8px p-4">
          <div className="row justify-content-start">
            <div className="col-6">
              <h4>Bookings</h4>
            </div>
          </div>
          <div className="divider"></div>
          <div>
            <TableBooking />
          </div>
        </aside>
      </div>
    </Layout>
  )
}


export default Login
