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
import Checkbox from '../../../../components/widget/Checkbox'
import SelectLabel from '../../../../components/widget/SelectLabel';

const Index = (props) => {

  const [loading, setLodding] = useState(false);
  const [packages, setPackage] = useState(props.product);
  const [startDate, setStartDate] = useState(null);

  const [activeFrom, setActiveFrom] = useState(false);
  const [activeTo, setActiveTo] = useState(false);
  
  const [companies, setCompany] = useState();

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


  const fechCompany = () => {
    api.getCompany()
    .then(res=>{
      const data = res.data;
      var temp = data.map(val => ({...val,val : val.id})  )
      setCompany(temp);
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  useEffect(() => {
    fechCompany();
  },[]);
 

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

  const onAddonChange = (e) => {
    var {name,checked} = e.target;
    var id = name.split('-')[1]
    if(!id) return;
    var data = addons.find(val => val.id == id)
    var tmp = [...state.addons]
    let index = state.addons.findIndex(val => val.id == id)
    if(checked){
      if(index === -1){
        tmp.push({...data,quantity : 1})
      }
    }
    else{
      if(index !== -1){
        tmp.splice(index,1)
      }
    }
    
    setState({...state,addons:tmp})
  }

  const onAmountAddonChange = (name,quantity) =>{
    var id = name.split('-')[1]
    if(!id) return;
    var tmp = [...state.addons]
    var data = addons.find(val => val.id == id)
    let index = state.addons.findIndex(val => val.id == id)
    if(index === -1){
      tmp.push({...data,quantity})
    }
    else{
      tmp[index] = {...tmp[index],quantity}
    }
    
    setState({...state,addons:tmp})
  }

  console.log(packages);

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
                  <SelectLabel 
                  inputProps={{ 
                    className:'form-control', 
                    name : 'company_type_id', required : true,
                  }} 
                  labelName="Company Type" icon={false} options={companies} />
                </div>
                <div className="col-3">
                  <InputLabel inputProps={{ 
                    className:'form-control', type : 'number',
                    name : 'adults', required : true, min : 0
                  }} 
                  labelName="Adults  " iconProps={{className : 'fa icon icon-home'}} />
                </div>
                <div className="col-3">
                  <InputLabel inputProps={{ 
                    className:'form-control', type : 'number',
                    name : 'childrens', required : true, min : 0
                  }} 
                  labelName="Childrens " iconProps={{className : 'fa icon icon-home'}} />
                </div>
              </div>
              {
                (packages.products_addons && packages.products_addons.length > 0) ? (
                  <div className="row mt-4">
                    <div className="col-4">
                      <span>Addons</span>
                      <div className="box-adddd mt-2">
                        {
                          packages.products_addons.map(val => 
                            <Checkbox key={val.name} 
                            name={`addon-${val.id}`} 
                            checked={!!state.addons.find(item => item.id == val.id)}
                            value1={val.name} 
                            value2={parseInt(val.price) } 
                            onChange={onAddonChange} 
                            quantity={state.addons.find(item => item.id == val.id)?.quantity || 1}
                            
                            onAmountAddonChange={onAmountAddonChange} />
                          )
                        }
                      </div>
                    </div>
                  </div>
                ) : null
              }
              
              <div>
                <BookingAddress />
              </div>
              <div className="row mt-4">
                <div className="col-12">
                  <div className="my-2">
                    {<span className="font-24px">Net Price  ฿ </span>}
                  </div>
                </div>
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
