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
import Link from 'next/link'
import Head from 'next/head'
import MainWidget from '../components/frontend/page/MainWidget'


const SearchPackageIndex = ({query, pages}) => {
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

  // console.log(query);
  
  const fecthPackage = (params) => {
    setLodding(true);
    api.getPackage({...params, is_draft : 0 , publish_status : 1, is_boat : 0})
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

  const [date_show , setDateShow] = useState(null);
  useEffect(() => {
    var params = {};
    if(query.activities) params.cate_id = query.activities;
    if(query.dates) {
      console.log(query.dates);
      var date = query.dates.split('>');
      params.price_start_date = date[0];
      params.price_end_date = date[1];

      var start = date[0].split('-');
      var start_day = start[2];
      var start_month = start[1];
      var start_year = (new Date(date[0]).getFullYear().toString().substr(-2));
      var setdate = start_month+'-'+start_day+'-'+start_year;

      var end = date[1].split('-');
      var end_day = end[2];
      var end_month = end[1];
      var end_year = (new Date(date[1]).getFullYear().toString().substr(-2));
      var setend = end_month+'-'+end_day+'-'+end_year;
      setDateShow(setdate+'>'+setend)
    }
    if(query.adult && query.children) {
      setState({...query, adult : query.adult, children : query.children})
    }
    fecthPackage(params);
  }, [query])
  
  // useEffect(() => {
  //   fecthPackage();
  // }, [])
  const [type, setType] = useState('');

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
    <Layout loading={loading} title={pages ? pages?.title : "Search Package" } page={'search_package'}>
      {
        !!pages && (
          <Head>
            <meta name="description" content={pages.description || ''} />
            <meta name="keywords" content={pages.keyword || ''} />

            <meta property="og:type" content="website" /> 
            <meta property="og:title" content={pages.title || ''} /> 
            <meta property="og:description" content={pages.description || ''} /> 
            <meta property="og:image" content={pages.image} /> 
            <meta property="og:url" content={`https://www.cruiseko.com`} /> 
            <meta property="og:site_name" content="Cruiseko" /> 

            <meta name="twitter:image" content={pages.image} /> 
            <meta name="twitter:title" content={pages.title || ''} /> 
            <meta name="twitter:description" content={pages.description || ''} /> 
            <meta name="twitter:site" content="Cruiseko" /> 
            <meta name="twitter:creator" content="Cruiseko" /> 
          </Head>
        )
      }
      <aside className="main-content">
				<main>
					<div>
            <Banner data={pages ? pages : null} />
					</div>
          <div>
            <ProductFilter setShowGrid={setShowGrid} showGrid={showGrid} />
					</div>
          
					<div className="container">
            <div className="row mt-4">
              <div className="col-12">
                <SearchPackage handleSubmit={handleSubmit}
                  setActive={setActive} active={active}
                  setState={setState} state={state}
                  query={query}
                  setDateShow={setDateShow} date_show={date_show}
                  setType={setType}
                  boat_type={'tour'} />
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
          {
            pages && (pages.pages_widgets && pages.pages_widgets.length > 0) ? (
              <div className="container show-widget">
                <MainWidget data={pages.pages_widgets} />
              </div>
            ) :  null
          }
          
				</main>
			</aside>
    </Layout>
  )
}

SearchPackageIndex.getInitialProps = async ({query}) => {
  var pages ,error ;
  try{
    const [pages_res] = await Promise.all([
      api.getPageOne('package'),
    ])
    pages = pages_res.data
  }
  catch(err){
    error = err;
  }
  
  return {query,pages,error}
}
export default SearchPackageIndex