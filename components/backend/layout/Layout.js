import Head from 'next/head';
import React,{useContext} from 'react';
import Sidenav from './Sidenav';
import UserContext from '../../../contexts/UserContext';

// import Header from './Header';
// import Footer from '../layout/Footer'
// import Loading from '../Loading'

const Layout = (props) => {
  const {title, loading, children, page_name, sub_page, isLogin} = props;
  const { admin } = useContext(UserContext)

  console.log('admin',admin)
  return (
    <>
      <Head>
        <title>{title ? `Backend ${title}` : 'Backend'}</title>
        <meta charSet="utf-8"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="shortcut icon" type="image/x-icon" href="/icon/logo.svg" />
        <link rel="apple-touch-icon" type="image/x-icon" href="/icon/logo.svg" />
        <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800" rel="stylesheet" />

        <link href="/backend_css/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/backend_css/css/admin.css" rel="stylesheet" />
        <link href="/backend_css/vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
       
        <link href="/backend_css/vendor/datatables/dataTables.bootstrap4.css" rel="stylesheet" />
        <link href="/backend_css/vendor/dropzone.css" rel="stylesheet" />
        <link href="/backend_css/css/date_picker.css" rel="stylesheet" />
        <link rel="stylesheet" href="/backend_css/js/editor/summernote-bs4.css" />

        <link href="/backend_css/css/custom.css" rel="stylesheet" />

      
        <script src="/backend_css/vendor/jquery/jquery.min.js"></script>
        <script src="/backend_css/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
        <script src="/backend_css/vendor/jquery-easing/jquery.easing.min.js"></script>
        <script src="/backend_css/vendor/chart.js/Chart.min.js"></script>
        <script src="/backend_css/vendor/datatables/jquery.dataTables.js"></script>
        <script src="/backend_css/vendor/datatables/dataTables.bootstrap4.js"></script>
        <script src="/backend_css/vendor/jquery.selectbox-0.2.js"></script>
        <script src="/backend_css/vendor/retina-replace.min.js"></script>
        <script src="/backend_css/vendor/jquery.magnific-popup.min.js"></script>
        <script src="/backend_css/js/admin.js"></script>
        <script src="/backend_css/js/admin-datatables.js"></script>

        
      </Head>
      
      {
        admin.isLogin ? (
          <Sidenav loading={loading} children={children} page_name={page_name} sub_page={sub_page} />
        ) : (
          <div className='main-layout'>
            {children}
          </div>
        )
       
      }
      
    </>
  )
}

export default Layout