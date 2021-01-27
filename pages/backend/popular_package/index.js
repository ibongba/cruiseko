import React from 'react';
import Layout from '../../../components/backend/layout/Layout';
import TablePopular from '../../../components/backend/table/TablePopular';

const Index = (props) => {

  return (
    <>
      <Layout title="Bookings" page_name="Bookings">
        <div className="row justify-content-start">
          <div className="col-6">
            <h4>Popular Package</h4>
          </div>
        </div>
        <div className="divider"></div>
        <div>
          <TablePopular />
        </div>
      </Layout>
    </>
  )
}


export default Index
