import React from 'react';
import Layout from '../../../components/backend/layout/Layout';
import TablePage from '../../../components/backend/table/TablePage';

const Index = (props) => {

  return (
    <>
      <Layout title="Pages" page_name="Pages">
        <div className="row justify-content-start">
          <div className="col-6">
            <h4>Pages</h4>
          </div>
          {/* <div className="col-6">
            <div className="text-right">
              <Link href="/backend/pages/create">
                <a className="btn btn-primary">Create</a>
              </Link>
            </div>
          </div> */}
        </div>
        <div className="divider"></div>
        <div>
          <TablePage />
        </div>
      </Layout>
    </>
  )
}


export default Index
