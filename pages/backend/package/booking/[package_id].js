import React, { useEffect, useState } from 'react';
import Layout from '../../../../components/backend/layout/Layout';
import { useRouter } from 'next/router';
import api from '../../../../utils/api-admin';
import Datetime from 'react-datetime';
import InputLabel from '../../../../components/widget/InputLabel';
import SelectTime from '../../../../components/widget/SelectTime'
import {toDateISO} from '../../../../utils/tools'
import BookingAddress from '../../../../components/backend/package/BookingAddress'
import Link from 'next/link'

const Index = (props) => {

  const [loading, setLodding] = useState(false);
  const [packages, setPackage] = useState(props.product);
  const [startDate, setStartDate] = useState(null);

  const [activeFrom, setActiveFrom] = useState(false);
  const [activeTo, setActiveTo] = useState(false);

  const [state,setState] = useState({
    date : toDateISO(new Date()),
    adult : 1,
    children : 0,
    start_time :'00:00',
    end_time : '02:00',
    canBook : true,
    available_boat : -1,
    addons:[]
  })

  const router = useRouter()
  const {package_id} = router.query;

  const fecthPackageOne = () => {
		setLodding(true);
		api.getPackageOne(package_id)
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
  }, [package_id])

  const is_boat = true;


  const showstartDate = (e) => {
    var today = e._i;
    var data = e._d;
    // var da = setD(data);
    setStartDate(data);
  }

  const handleBook = (event) => {

  }

  const onTimeChange = (key, val) =>{
    setState({...state,[key] : val })
  }

  return (
    <>
      <Layout title="Package" page_name="Package">
        <div className="row justify-content-start align-items-center">
          <div className="col-6">
            <h4>Admin Booking</h4>
          </div>
        </div>
        <div className="divider"></div>
        {
          packages ? (
            <>
              <div className="row">
                <div className="col-12">
                  <h5>Package Name : {packages.name}</h5>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-3">
                  <div className="form-group">
                    <label>Start Date</label>
                    <Datetime 
                    dateFormat="YYYY-MM-DD" 
                    timeFormat={false}
                    onChange={(e)=> {showstartDate(e)}}
                    value={startDate ? startDate : ''}
                    inputProps={{ name: 'start_date', required : true, autoComplete : 'off' }} />
                  </div>
                </div>
                {
                  is_boat ? (
                    <div className="col-6">
                      <label>Start Time - End Time</label>
                      <div className="box_detail booking">
                        <div className="d-flex">
                          <SelectTime active={activeFrom} setActive={setActiveFrom} onTimeChange={onTimeChange} value={state.start_time} name={'start_time'} />
                          <SelectTime active={activeTo} setActive={setActiveTo} onTimeChange={onTimeChange} value={state.end_time} name={'end_time'} />
                        </div>
                      </div>
                    </div>
                  ) : null
                }
              </div>
              <div className="row mt-3">
                <div className="col-3">
                  <InputLabel inputProps={{ 
                    className:'form-control', type : 'text',
                    name : 'adults', required : true
                  }} 
                  labelName="Adults  " iconProps={{className : 'fa icon icon-home'}} />
                </div>
                <div className="col-3">
                  <InputLabel inputProps={{ 
                    className:'form-control', type : 'text',
                    name : 'childrens', required : true
                  }} 
                  labelName="Childrens " iconProps={{className : 'fa icon icon-home'}} />
                </div>
              </div>
              <div>
                <BookingAddress />
              </div>
              <div className="row mt-4">
                <div className="col-12">
                  <Link href={`/backend/package/edit/[d]`} as={`/backend/package/edit/${package_id}`}>
                    <a><button type="button" className="btn btn-outline-primary">Cancel</button></a>
                  </Link>
                  <button type="button" className="btn btn-primary ml-3">Confirm</button>
                </div>
              </div>
            </>
          ) : null
        }
      </Layout>
    </>
  )
}


export default Index
