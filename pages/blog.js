import React, { useEffect, useState } from 'react';
import Banner from '../components/frontend/blog/Banner';
import BlogLandscape from '../components/frontend/blog/BlogLandscape';
import BlogSearch from '../components/frontend/blog/BlogSearch';
import Layout from '../components/frontend/layout/Layout';
import api from '../utils/api';
import Router from 'next/router';
import Paginate from 'react-paginate';
import Link from 'next/link'
import Head from 'next/head'
import MainWidget from '../components/frontend/page/MainWidget'


const Blog = ({query, pages}) => {
  const [loading, setLodding] = useState(false);
  const [blogs, setBlog] = useState();
  const [news, setNews] = useState();

  const [pageCount,setPageCount] = useState(1)
  const [pageNumber, setPagenumber] = useState(0);
  const LIMIT = 10;

  const fecthBlog = (params) => {
    params.page = params.page || 1;
    params.limit = params.limit || LIMIT;
    api.getBlog(params)
    .then(res=>{
      const data = res.data;
      setBlog(data);
      setPageCount(Math.ceil(data.count / LIMIT));
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  const fecthNews = () => {
    api.getBlog({limit : 5})
    .then(res=>{
      const data = res.data;
      setNews(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  
  useEffect(() => {
    var params = {};
    if(query.search) {
      params.search = query.search;
    }
    if(query.page) {
      params.page = query.page;
    }
    fecthBlog(params);
    fecthNews();
  }, [query]);


  const handleSearch = (event) => {
    event.preventDefault();
    var data = new FormData(event.target);
    var search = data.get('search');
    Router.push('/blog?search='+search, '/blog?search='+search);
  }

  const handlePageClick = (data) =>{
    let selected = data.selected;
    Router.push({
      pathname: '/blog',
      query : {...query,page :selected+1  }
    })
  }


  return (
    <Layout loading={loading} title={pages ? pages?.title : "Blog" } page={'Blog'}>
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

         
          <div className="container margin_60_35">
            <div className="row">
              <div className="col-lg-9">

                {
                  (blogs && blogs.count > 0) ? blogs.rows.map((val, index) => (
                    <BlogLandscape key={val.id} blogs={val} />
                  )) : null
                }

                {(blogs && blogs.count > LIMIT) &&  (
                  <div className="d-flex w-100 justify-content-start mt-4">
                    <div className="float-left">
                      <Paginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={pageCount}
                        forcePage={pageNumber}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                      />
                    </div>
                  </div> 
                )}  
              </div>

              <BlogSearch news={news} handleSearch={handleSearch} query={query} btn_reset={true} />
              
            </div>
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


Blog.getInitialProps = async ({query}) => {
  var pages ,error ;
  try{
    const [pages_res] = await Promise.all([
      api.getPageOne('blog'),
    ])
    pages = pages_res.data
  }
  catch(err){
    error = err;
  }
  
  return {query,pages,error}
}
export default Blog
