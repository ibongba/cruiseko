import React, { memo, useEffect, useState } from 'react';
import api from '../../../utils/api-admin';
import DragPopular from './../drag/DragPopular'

const TablePopular = memo((props) => {
  const [popular, setPopular] = useState();
  const [loading, setLoading] = useState(false);

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
  },[]);

  const handleChangeOrder = (values) =>{
    // setBook(values);
    // if(values.length != 0){
    //   var arr = [];
    //   values.forEach((val,index) => {
    //     arr.push({order : (index + 1), id: val.id});
    //   });

    //   api.updatePopularOrder({orders : arr}).then(res =>{
    //     const data = res.data;
    //     // console.log(data);
    //   })
    //   .catch(err =>{
    //     console.log(err.response);
    //   })
    // }
  }

  const delProduct = (product_id) => {
    // api.delPopularPackage(product_id).then(res =>{
    //   const data = res.data;
    //   fecthPopular();
    // })
    // .catch(err =>{
    //   console.log(err.response);
    // })
  }

  console.log('popular', popular);

  return (
    <>
      
      <DragPopular products={popular} handleChangeOrder={handleChangeOrder}  delProduct={delProduct} />
    </>
  )
})
export default TablePopular