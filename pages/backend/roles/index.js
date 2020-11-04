import Link from 'next/link';
import React from 'react';
import Layout from '../../../components/backend/layout/Layout';
import TableRole from '../../../components/backend/table/TableRole';

const Index = (props) => {
  const page_key = "roles";

  return (
    <>
      <Layout title="Admin role" page_name="Admin role">
      <div className="row justify-content-start">
          <div className="col-6">
            <h4>Admin role</h4>
          </div>
          <div className="col-6">
            <div className="text-right">
              <Link href="/backend/roles/create">
                <a className="btn btn-primary">Create</a>
              </Link>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div>
          <TableRole />
        </div>
      </Layout>
    </>
  )
}


export default Index
