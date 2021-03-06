import React, { useEffect, useState } from 'react';
import DragPopular from '../../../components/backend/drag/DragPopular';
import Layout from '../../../components/backend/layout/Layout';
import ModalPackage from '../../../components/backend/popular/ModalPackage';
import api from '../../../utils/api-admin';

const Index = (props) => {
  const [show, setShow] = useState(false);
  const [packages, setPackage] = useState();
  const [popular, setPopular] = useState();
  const [loading, setLoading] = useState(false);

  


  const fecthPopular = (params={}) => {

    params.cate_key = "popular";
    params.full_detail = 0;
    setLoading(true);
    api.getPopularPackage(params)
    .then(res=>{
      const data = res.data;
      setPopular(data);
      setLoading(false);
    })
    .catch(err => {
      setLoading(false);
      console.log(err.response);
    })
  }

  const fecthPackage = (params={}) => {
    setLoading(true);
    api.getPackage({is_draft : 0}).then(res=>{
      const data = res.data;
      if(popular && popular.count > 0) {
        popular.rows.forEach((pops)=>{
          var index = data.rows.findIndex((val) => val.id == pops.product.id)
          if(index != -1)
          data.rows.splice(index,1)
        })
      }
      setPackage(data);
      setLoading(false);
    })
    .catch(err => {
      console.log(err.response);
      setLoading(false);
    })
  }
  

  useEffect(() => {
    fecthPopular();
  },[]);
  useEffect(() => {
    fecthPackage();
  },[popular]);


  const handleAdd = (id) => {
    var data = {product_id : id, cate_key : 'popular'}
    api.insertPopularPackage(data)
    .then(res=>{
      const data = res.data;
      fecthPopular();
      setShow(false);
    })
    .catch(err => {
      setShow(false);
      console.log(err.response);
    })
  }

  const handleChangeOrder = (values) =>{
    setPopular({...popular,rows :values});
    if(values.length != 0){
      var arr = [];
      values.forEach((val,index) => {
        arr.push({order : (index + 1), id: val.id});
      });

      api.updatePopularOrder({orders : arr}).then(res =>{
        // const data = res.data;
        // console.log(data);
      })
      .catch(err =>{
        console.log(err.response);
      })
    }
  }

  const delProduct = (product_id) => {
    api.delPopularPackage(product_id).then(res =>{
      const data = res.data;
      fecthPopular();
    })
    .catch(err =>{
      console.log(err.response);
    })
  }

  console.log('popular', popular);

  return (
    <>
      <Layout title="Package Popular"  page_name="Package">
        <div className="row justify-content-start">
          <div className="col-6">
            <h4>Package Popular</h4>
          </div>
          <div className="col-6">
            <div className="text-right">
              <a href="#" className="btn btn-primary" onClick={() => setShow(true)}>Add</a>
            </div>
          </div>
        </div>
        {/* <div className="divider"></div> */}
        <div className="mt-5">
          <DragPopular products={popular} handleChangeOrder={handleChangeOrder}  delProduct={delProduct} />
        </div>

        <ModalPackage show={show}
        size="lg" data={packages} handleAdd={handleAdd}
        onHide={() => setShow(false)} />
      </Layout>
    </>
  )
}


export default Index
