import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../../../../components/backend/layout/Layout';
import Button from '../../../../components/widget/Button';
import InputLabel from '../../../../components/widget/InputLabel';
import SuccessDialog from '../../../../components/widget/ModalSuccessDialog';
import SelectLabel from '../../../../components/widget/SelectLabel';
import api from '../../../../utils/api-admin';

const EditAdmin = ({query}) => {
  const [modalSuccess, setModalSuccess] = useState(false);
  const [users, setUsers] = useState();
  const [roles, setRole] = useState();

  const router = useRouter();
  const user_id = router.query.id;

  const fechRole = () => {
    api.getRole()
    .then(res=>{
      const data = res.data;
      var temp = data.map(val => ({...val,val : val.id})  )
      setRole(temp);
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  const fechUsers = () => {
    api.getAdminUsersOne(user_id)
    .then(res=>{
      const data = res.data;
      setUsers(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  }


  useEffect(() => {
    if(!user_id) return;
    fechRole();
    fechUsers();
  },[user_id]);


  const handleSave = (event) => {
    event.preventDefault()
    const data = new FormData(event.target)
    api.updateAdminUsers(user_id, data)
    .then(res=>{
      const data = res.data;
      setModalSuccess(true);
    })
    .catch(err => {
      console.log(err);
      console.log(err.response);
    })
  }

  return (
    <>
      <Layout title="Editing admin" page_name="Admin" sub_page="Edit" main_link="admin">
        <div className="row justify-content-start">
          <div className="col-12">
            <h4>Edit admin</h4>
          </div>
        </div>
        <div className="divider"></div>

        { 
        !!users ? (
          <form onSubmit={handleSave}>
          <div className="row justify-content-center">
            <div className="col-lg-6 col-12">
              <InputLabel inputProps={{ 
                className:'form-control', type : 'text',
                name : 'name', required : true,
                defaultValue : users.name
              }} 
              labelName="Name " iconProps={{className : 'fa icon icon-email'}}  />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-6 col-12">
              <InputLabel inputProps={{ 
                className:'form-control', type : 'email',
                name : 'email', required : true,
                defaultValue : users.email
              }} 
              labelName="Email " iconProps={{className : 'fa icon icon-email'}}  />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-6 col-12">
              <InputLabel inputProps={{ 
                className:'form-control', type : 'text',
                name : 'username', required : true,
                defaultValue : users.username
              }} 
              labelName="Username " iconProps={{className : 'fa icon icon-user'}}  />
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-6 col-12">
              <InputLabel inputProps={{ 
                className:'form-control', type : 'password',name : 'password', 
                pattern : ".{6,}"
              }} 
              labelName="Password " iconProps={{className : 'fa icon icon-key-1'}}  />
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-6 col-12">
              <SelectLabel 
              inputProps={{ 
                className:'form-control select', 
                name : 'role_id', required : true, defaultValue : users.role_id
              }} 
              labelName="Admin roles" iconProps={{className : 'fa icon icon-home'}} options={roles} />
            </div>
          </div>
          
          
          <div className="row justify-content-center mt-4">
            <div className="col-6">
              <div className="text-center">
                <Button _type="submit" _name="Submit" _class="btn-primary" />
                <Link href="/backend/admin">
                  <a>
                    <Button _type="button" _name="Cancel" _class="btn-outline-primary ml-4" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </form>
        ) : null
      }
        
        <SuccessDialog show={modalSuccess}
          text="Successfully saved data !!!"
          size="md" onHide={() => setModalSuccess(false)}
          route={"/backend/admin"} />
      </Layout>
    </>
  )
}

EditAdmin.getInitialProps = ({query}) => {
  return {query}; //has to be like an object
}
export default EditAdmin
