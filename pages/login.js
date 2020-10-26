import Router from 'next/router';
import React, { useEffect, useState ,useContext} from 'react';
import Layout from '../components/frontend/layout/Layout';
import api from '../utils/api'
import AuthService from '../utils/AuthService'
import UserContext from '../contexts/UserContext';
import InputLabel from '../components/widget/InputLabel'
import FormLogin from '../components/frontend/login/FormLogin'

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
      Router.push('/')
    })
    .catch(err => {
      if(!err.response) return;

      setError(err.response.data.error)
    })
  }
  
  return (
    <Layout loading={loading} title="Login">
      <div className="container" id="login">
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
