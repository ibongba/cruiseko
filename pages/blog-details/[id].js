import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/frontend/layout/Layout';
import Banner from '../../components/frontend/blog_detail/Banner';
import Maindetail from '../../components/frontend/blog_detail/Maindetail'
import api from '../../utils/api'

const BlogDetail = (props) => {
  const [loading, setLodding] = useState(false);
  const [blogs, setBlog] = useState(props.blogs);
  const [news, setNews] = useState();

	const router = useRouter();
	const id = router.query.id;
	

	const fecthBlogOne = () => {
		setLodding(true);
		api.getBlogOne(id)
    .then(res=>{
      const data = res.data;
      setBlog(data);
      setLodding(false);
    })
    .catch(err => {
      setLodding(false);
      console.log(err.response);
    })
  }
  
  const fecthNews = () => {
    api.getBlog()
    .then(res=>{
      const data = res.data;
      setNews(data);
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  

	
  useEffect(() => {
    fecthBlogOne();
    fecthNews();
  }, [props.query.id])

  

  
  return (
    <Layout loading={loading} title={'Blog Details'} page={'blog_details'}>
			<aside className="main-content">
				<main>
					<div>
						<Banner data={blogs} />
					</div>
					<div>
            <Maindetail blogs={blogs} news={news} />
          </div>
				</main>
			</aside>
    </Layout>
  )
}

BlogDetail.getInitialProps = async ({query, asPath}) => {
  const BASE_LOCAL= 'http://localhost:3080'
  const BASE = process.env.api_url || BASE_LOCAL;
  const url = query.id.split('-');
  const blog_id = encodeURIComponent(url[0])
  query.id = blog_id;
  var data = null;
  try {
    const response = await api.getBlogOne(blog_id);
    data = response.data;
  }catch (e) {
    console.log(e);
  }

  return { blogs:data,query,path : asPath };
}
export default BlogDetail
