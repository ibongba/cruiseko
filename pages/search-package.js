import React, { useEffect, useState } from 'react';
import Layout from '../components/frontend/layout/Layout';
import api from '../utils/api'
import Banner from '../components/frontend/product/Banner'
import ProductFilter from '../components/frontend/product/ProductFilter'
import ProductCard from '../components/frontend/product/ProductCard'
import ProductCardLandscape from '../components/frontend/product/ProductCardLandscape'
import SearchPackage from '../components/frontend/product/SearchPackage';
import { toDateISO } from '../utils/tools';
import Router, {useRouter } from 'next/router';

const SearchPackageIndex = ({query}) => {
  const [loading, setLodding] = useState(false);
  const [packages, setPackage] = useState();
  const [showGrid, setShowGrid] = useState(1);
  const [active, setActive] = useState(false);
  const [state, setState] = useState({
    start_date : toDateISO(new Date()),
    end_date : toDateISO(new Date()),
    adult : 1,
    children : 0
  })

  console.log(query);
  
  const fecthPackage = (params) => {
    setLodding(true);
    api.getPackage({...params, is_draft : 0 , publish_status : 1})
    .then(res=>{
      const data = res.data;
      setPackage(data);
      setLodding(false);
    })
    .catch(err => {
      setLodding(false);
      console.log(err.response);
    })
  }

  useEffect(() => {
    var params = {};
    if(query.activities) params.cate_id = query.activities;
    if(query.dates) {
      var date = query.dates.split('>');
      params.price_start_date = date[0];
      params.price_end_date = date[1];
    }
    fecthPackage(params);
  }, [query])
  
  // useEffect(() => {
  //   fecthPackage();
  // }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    var data = new FormData(event.target);
    var activities = data.get('activities');
    var dates = state.start_date+'>'+state.end_date;
    var adult = state.adult;
    var children = state.children;
    Router.push(`/search-package?activities=${activities}&dates=${dates}&adult=${adult}&children=${children}`);
  }

  // console.log(packages);

  return (
    <Layout loading={loading} title="Search Package" page={'search_package'}>
      <aside className="main-content">
				<main>
					<div>
            <Banner data={true} />
					</div>
          <div>
            <ProductFilter setShowGrid={setShowGrid} showGrid={showGrid} />
					</div>
          
					<div className="container">
            <div className="row mt-4">
              <div className="col-12">
                <SearchPackage handleSubmit={handleSubmit}
                  setActive={setActive} active={active}
                  setState={setState} state={state} />
              </div>
            </div>
            {
              showGrid == 1 ? (
                <div className="wrapper-grid p-0">
                  <div className="row">
                    {
                      (packages && packages.rows) ? packages.rows.map((val, index) => (
                        <ProductCard key={val.id} packages={val} />
                      )) : null
                    }
                  </div>
                </div>
              ) : (
                <div className="isotope-wrapper">
                  {
                    (packages && packages.rows) ? packages.rows.map((val, index) => (
                      <ProductCardLandscape key={val.id} packages={val} />
                    )) : null
                  }
                </div>
              )
            }
          </div>
				</main>
			</aside>
    </Layout>
  )
}

SearchPackageIndex.getInitialProps = ({query}) => {
  return {query}; //has to be like an object
}
export default SearchPackageIndex