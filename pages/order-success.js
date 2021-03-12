import React, { useState } from 'react';
import Layout from '../components/frontend/layout/Layout';

const OrderSuccess = (props) => {
  const [loading, setLodding] = useState(false);

  return (
    <Layout loading={loading} title="Order Success" page={'order_success'} banner={false}>
      <div className="container start-content">
        <div className="row">
          <div className="col-12">
            <div className="text-center">
              <h4>Order Success</h4>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
export default OrderSuccess

