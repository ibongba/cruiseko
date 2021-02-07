import React, { useState, useEffect } from 'react';
import Layout from '../components/frontend/layout/Layout';
import Banner from '../components/frontend/home/Banner'
import ProductCard from '../components/frontend/product/ProductCard'
import api from '../utils/api'
import BlogCard from '../components/frontend/blog/BlogCard'
import Link from 'next/link'
import Head from 'next/head'
import MainWidget from '../components/frontend/page/MainWidget'

const Home = (props) => {
  const {query,pages} = props;
  const [loading, setLodding] = useState(false);
  const [packages, setPackage] = useState();
  const [blogs, setBlog] = useState();

  const fecthPackage = () => {
    setLodding(true);
    api.getPopularPackage({cate_key : "popular",active : 1})
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

  const fecthBlog = () => {
    api.getBlog()
    .then(res=>{
      const data = res.data;
      setBlog(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  
  useEffect(() => {
    fecthPackage();
    fecthBlog();
  }, [])

  useEffect(() => {
    document.getElementsByClassName('main-container')[0].style.backgroundColor = "#FFFFFF";
  }, []);


  return (
    <Layout loading={loading} title={pages ? pages?.title : "Home" } page={'home'}>
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
				<main className="main-container">
					<div>
            <Banner data={pages ? pages : null} />
					</div>
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

          {
            pages && (pages.pages_widgets && pages.pages_widgets.length > 0) ? (
              <div className="container show-widget">
                <MainWidget data={pages.pages_widgets} />
              </div>
            ) :  null
          }
          

          {
            (blogs && blogs.count > 0) ? (
              <div className="bg_color_1">
                <div className="container margin_80_55">
                  <div className="main_title_2">
                    <span><em></em></span>
                    <h3>News and Events</h3>
                    <p>Cum doctus civibus efficiantur in imperdiet deterruisset.</p>
                  </div>
                  <div className="row">
                    {
                      (blogs && blogs.count > 0) ? blogs.rows.map((val, index) => (
                        <BlogCard col="col-lg-6" key={val.id} blogs={val} />
                      )) : null
                    }
                  </div>
                  <p className="btn_home_align"><Link href="/blog"><a className="btn_1 rounded">View all news</a></Link></p>
                </div>
              </div>      
            ) : null
          }
         


				</main>
			</aside>
      <div className="end-content"></div>
    </Layout>
  )
}
Home.getInitialProps = async ({query}) => {
  var pages ,error ;
  try{
    const [pages_res] = await Promise.all([
      api.getPageOne('home'),
    ])
    pages = pages_res.data
  }
  catch(err){
    error = err;
  }
  
  return {query,pages,error}
}
export default Home

