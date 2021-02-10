import Head from 'next/head';
import React from 'react';
import Header from './Header';
import usescript from '../../../utils/UseScript'
// import Footer from '../layout/Footer'

const Layout = (props) => {
  const {title, loading, children, banner} = props;

  usescript();

  return (
    <>
      <Head>
        <title>{title ? title : 'Home'}</title>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="shortcut icon" type="image/x-icon" href="/icon/logo.svg" />
        <link rel="apple-touch-icon" type="image/x-icon" href="/icon/logo.svg" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

        <link href="/template/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /> 
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
        
        <link href="/template/css/style.css" rel="stylesheet" />
        <link href="/template/css/vendors.css" rel="stylesheet" />
        <link href="/css/sidenav.css" rel="stylesheet" />
        <link href="/template/css/blog.css" rel="stylesheet" />
        <link href="/css/custom.css" rel="stylesheet" />
        <link href="/css/content-styles.css" rel="stylesheet" />

      
        <script src="/template/js/jquery-3.5.1.min.js"></script>
        <script src="/template/js/bootstrap.bundle.min.js"></script>
        <script src="/template/js/jquery.easing.js"></script>
        <script src="/template/js/common_scripts.js"></script>
        <script src="/template/js/main.js"></script>
        <script src="/template/assets/validate.js"></script>
        <script src="/template/js/isotope.min.js"></script>

        {/* <script src="http://maps.googleapis.com/maps/api/js"></script>
        <script src="/template/js/markerclusterer.js"></script>
        <script src="/template/js/map_tours_half_screen.js"></script>
        <script src="/template/js/infobox.js"></script> */}

      
      </Head>
      
      <Header loading={loading} banner={banner} />
      <div className='main-layout'>
        {/* {loading && <Loading />} */}
        {children}
      </div>
      {/* <Footer/> */}
    </>
  )
}

export default Layout