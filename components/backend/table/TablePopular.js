import React, { memo, useEffect, useState } from 'react';
import api from '../../../utils/api-admin';

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

  console.log(popular);

  return (
    <>
      
      
    </>
  )
})
export default TablePopular