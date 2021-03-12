import Router from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/frontend/layout/Layout';
import FormLogin from '../components/frontend/login/FormLogin';
import UserContext from '../contexts/UserContext';
import api from '../utils/api';
import AuthService from '../utils/AuthService';

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
    <Layout loading={loading} title="Login" page={'login'} banner={false}>
      <div className="container start-content" id="login">
        <aside className="main-content">
          <form id="login-form" onSubmit={login}>
            <FormLogin error={error} />
          </form>
        </aside>
      </div>
    </Layout>
  )
}


export default Login
