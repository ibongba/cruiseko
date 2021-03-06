
import React from 'react';
import InputLabel from '../../widget/InputLabel';
  
const FormLogin = (props) => {
  const {error} = props;

 

  return (
    <>
      <InputLabel inputProps={{ 
        className:'form-control', type : 'text',name : 'username', id : "email",
        /* pattern : "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$", title :"Invalid email", */ required : true
      }} 
      labelName="Username" iconProps={{className : 'fa icon icon-email'}}  />
      <InputLabel inputProps={{ 
        className:'form-control', type : 'password',name : 'password', id : "password",
        pattern : ".{6,}", title :"six or more characters", required : true
      }} 
      labelName="Password" iconProps={{className : 'fa icon icon-lock-1'}}  />
      {
        error && ( 
          <div className="text-danger"> Email or password is incorrect </div>
        )
      }

      <div className="clearfix add_bottom_30">
        <div className="float-right mt-1"><a id="forgot">Forgot Password?</a></div>
      </div>

      <div>
        <button type="submit"  className="btn_1 rounded full-width">Login</button>
      </div>
    </>
  )
}
export default FormLogin