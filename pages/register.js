import React, { useEffect, useState } from 'react';
import Layout from '../components/frontend/layout/Layout';
import Company from '../components/frontend/register/Company';
import Success from '../components/frontend/register/Success';
import User from '../components/frontend/register/User';
import Step from '../components/widget/Step';
import api from '../utils/api';
import Router from 'next/router'

const Register = ({ t }) => {
  const [loading, setLodding] = useState(false);
  const [show, setShow] = useState(2);
  const [chkImg, setChkimg]  = useState(false);
  const [index, setIndex] = useState([]);
  const [inputData,setInputData] = useState({
    email : '',
    password : '',
    confirm_password : ''
  })

  const handleChange = (e) =>{
    var {name,value} = e.target
    setInputData({...inputData,[name] : value})
  }

  const onSubmit = (event) => {
    event.preventDefault();


    if(inputData.password !== inputData.confirm_password){
      return alert('Password not mactch')
    }

    // var form_company = new FormData(document.getElementById('form-company'))
    var form_user = new FormData(document.getElementById('form-user'))
    var form_success = new FormData(event.target)

    for (let [key, value] of form_user.entries()) {
      form_success.append(key,value)
    }


    api.register(form_success).then(res => {
      alert('Success')
      window.location = '/register-success'
      // Router.push('/register-success')
    })
    .catch(err => {
      console.log(err.response)
      alert('Error!')
    })


  }

  return (
    <Layout loading={loading} title="Register" page={'register'} banner={false}>
      <main>
        <div className="container start-content">
          <div className="row">
            <div className="col-12">
              <div className="bs-wizard step clearfix">
                <Step active={show == 2} name="User information" />
                <Step active={show == 3} name="Login information" />
              </div>
            </div>
          </div>
        </div>

        <div className="container" id="register">
          <aside className="main-content">
              <User setShow={setShow} show={show == 2} 
              setInputData={setInputData}
              inputData={inputData} 
              handleChange={handleChange}/>
              <Success setShow={setShow} show={show == 3} 
              handleChange={handleChange}
              onSubmit={onSubmit}  
              inputData={inputData} user_type="fit" />
          </aside>
        </div>
      </main>
    </Layout>
  )
}


export default Register
