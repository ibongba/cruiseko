import React, { useState } from 'react';
import Layout from '../components/frontend/layout/Layout';

const RegisterSuccess = (props) => {
  const [loading, setLodding] = useState(false);

  return (
    <Layout loading={loading} title="Register Success" page={'register_success'} banner={false}>
      <div className="container start-content">
        <aside className="main-content border-r8px">
          <div className="row py-5">
            <div className="col-12">
              <div className="text-center">
                <img src="/icon/success.svg" style={{'width': '64px'}} />
              </div>
            </div>
            <div className="col-12 mt-3">
              <div className="text-center">
                <h4>Register Success</h4>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  )
}
export default RegisterSuccess

