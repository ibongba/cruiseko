import React, { useState, useEffect } from 'react';
import Layout from '../../../components/backend/layout/Layout';
import ModalPackage from '../../../components/backend/popular/ModalPackage';
import TablePopular from '../../../components/backend/table/TablePopular';
import api from '../../../utils/api-admin'
import DragPopular from '../../../components/backend/drag/DragPopular'

const Index = (props) => {
  const [show, setShow] = useState(false);
  const [packages, setPackage] = useState();
  const [popular, setPopular] = useState();
  const [loading, setLoading] = useState(false);

  const fecthPackage = (params={}) => {
    setLoading(true);
    api.getPackage()
    .then(res=>{
      const data = res.data;
      console.log('data',data)
      setPackage(data);
      setLoading(false);
    })
    .catch(err => {
      console.log(err.response);
      setLoading(false);
    })
  }


  const fecthPopular = (params={}) => {

    params.cate_key = "popular";

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
  

  useEffect(() => {
    fecthPopular();
    fecthPackage();
  },[]);


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
      <Layout title="Bookings" page_name="Bookings">
        <div className="row justify-content-start">
          <div className="col-6">
            <h4>Popular Package</h4>
          </div>
          <div className="col-6">
            <div className="text-right">
              <a href="#" className="btn btn-primary" onClick={() => setShow(true)}>Add</a>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div>
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
