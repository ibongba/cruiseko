import React, { useEffect, useState } from 'react';
import Layout from '../../components/frontend/layout/Layout';
import Banner from '../../components/frontend/product_detail/Banner';
import MainDetail from '../../components/frontend/product_detail/MainDetail';
// import Router, {useRouter } from 'next/router';
import api from '../../utils/api';
import Head from 'next/head'

const ProductDetail = (props) => {
  const [loading, setLodding] = useState(false);
  const [packages, setPackage] = useState(props.product);

	// const router = useRouter();
	const id = props.query.id;
	

	const fecthPackageOne = () => {
		setLodding(true);
		api.getPackageOne(id)
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
    fecthPackageOne();
  }, [props.query.id])
  
	
	// console.log('packages', packages,props.product);
  
  return (
    <Layout loading={loading} title={packages && packages.meta_title ? packages.meta_title : packages.name} page={'product_details'}>
      <Head>
        {
          !!packages && (
            <>
              <meta name="description" content={packages.meta_description ? packages.meta_description : packages.name} />
              <meta name="keywords" content={packages.meta_keyword ? packages.meta_keyword : packages.name} />
              <meta property="og:type" content="website" /> 
              <meta property="og:title" content={packages.meta_title ? packages.meta_title : packages.name} /> 
              <meta property="og:description" content={packages.meta_description ? packages.meta_description : packages.name} /> 
              <meta property="og:image" content={packages.meta_image ? `${process.env.URL}${packages.meta_image}` : ``} /> 
              <meta property="og:url" content={`${process.env.URL}/package-details/${packages.id}`} /> 
              <meta property="og:site_name" content="CRUISEKO" /> 

              <meta name="twitter:image" content={packages.meta_image ? `${process.env.URL}${packages.meta_image}` : ``} /> 
              <meta name="twitter:title" content={packages.meta_title ? packages.meta_title : packages.name} /> 
              <meta name="twitter:description" content={packages.meta_description? packages.meta_description : packages.name} /> 
              <meta name="twitter:site" content="CRUISEKO" /> 
              <meta name="twitter:creator" content="CRUISEKO" /> 

            </>
          )
        }
      </Head>
			<aside className="main-content">
				<main>
					<div>
						<Banner packages={packages} />
					</div>
					<div>
						<MainDetail packages={packages} />
					</div>
				</main>
			</aside>
      <div className="end-content"></div>
    </Layout>
  )
}

ProductDetail.getInitialProps = async ({query}) => {
  const BASE_LOCAL= 'http://localhost:3080'
  const url = query.id.split('-');
  const product_id = encodeURIComponent(url[0])
  query.id = product_id;
  var data = null;
  try {
    const response = await api.getPackageOne(product_id);
    data = response.data;
    
  }catch (e) {
    console.log(e);
  }

  return { product:data,query};
}

// export async function getServerSideProps({query}) {
//   const BASE_LOCAL= 'http://localhost:3080'
//   const BASE = process.env.api_url || BASE_LOCAL;
//   const url = query.id.split('-');
//   const product_id = encodeURIComponent(url[0])
//   query.id = product_id;
//   var data = null;
//   console.log('query',query)
//   try {
//     const response = await api.getPackageOne(product_id);
//     data = response.data;
    
//   }catch (e) {
//     throw e
//   }
//   return {
//     props: { product:data,query }, // will be passed to the page component as props
//   }
// }
export default ProductDetail
