import React, { useState, useEffect } from 'react';
import Layout from '../components/frontend/layout/Layout';
import ProductCard from '../components/frontend/product/ProductCard'
import api from '../utils/api'

const Popular = ({ t }) => {
  const [loading, setLodding] = useState(false);
  const [packages, setPackage] = useState();  

  const fecthPackage = () => {
    setLodding(true);
    api.getPopularPackage({cate_key : "popular", active : 1})
    .then(res=>{
      const data = res.data;
      setPackage(data);
      console.log(data);
      setLodding(false);
    })
    .catch(err => {
      setLodding(false);
      console.log(err.response);
    })
  }

  useEffect(() => {
    fecthPackage();
  }, [])

  return (
    <Layout loading={loading} title="Popular" page={'popular'} banner={false}>
      <aside className="main-content">
        <main className="main-container mt-5">
          <div className="container margin_80_55">
            <div className="main_title_2">
              <span><em></em></span>
              <h3>Our Popular Tours</h3>
              <p>Cum doctus civibus efficiantur in imperdiet deterruisset.</p>
            </div>
            <div className="wrapper-grid">
              <div className="row">
                {
                  (packages && packages.rows) ? packages.rows.map((val, index) => (
                    <ProductCard key={val.id} packages={val.product} />
                  )) : null
                }
              </div>
            </div>
          </div>
        </main>
      </aside>
      <div className="end-content"></div>
    </Layout>
  )
}


export default Popular
