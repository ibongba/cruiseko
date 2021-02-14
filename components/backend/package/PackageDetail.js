import dynamic from 'next/dynamic';
import React, { memo, useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import api from '../../../utils/api-admin';
import DivLoad from '../../widget/DivLoad';
import InputLabel from '../../widget/InputLabel';
import Datetime from 'react-datetime';
import TextAreaLength from '../../widget/TextAreaLength'

const animatedComponents = makeAnimated();

const Loading = <div className="position-relative" style={{height : '200px'}}><DivLoad loading={true} /></div>;
const Editor = dynamic(() => import('../../widget/Editor'),{ ssr: false, loading: () => Loading })

const PackageDetail = memo((props) => {
  const {pkg, edit = false} = props;
  const [types, setType] = useState();
  const [boats, setBoat] = useState();
  const [locations, setLocation] = useState();
  const [selectData,setSelectData] = useState({cate : undefined ,boat_id : undefined, pickup_location_id : undefined })
  const [img, setImg] = useState("/template/img/tour_1.jpg");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fecthPackageCate = () => {
    api.getPackageCate()
    .then(res=>{
      const data = res.data;
      var temp = data.map(val => ({...val,value : val.cate_id,label : val.name})  )
      setType(temp);
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  const fechLocation = () => {
    api.getLocation()
    .then(res=>{
      const data = res.data;
      var temp = data.map(val => ({...val,value : val.id,label : val.name})  )
      setLocation(temp);
    })
    .catch(err => {
      console.log(err.response);
    })
  }
  const fecthBoat = () => {
    api.getBoat({no_limit : 1})
    .then(res=>{
      const data = res.data;
      // console.log('boat',data)
      var temp = data.rows.map(val => ({label : val.name,value : val.boat_id})  )
      
      setBoat(temp);
    })
    .catch(err => {
      
      console.log(err || err.response);
    })
  }

  const handleSelectChange = (key,item)=>{
    // console.log(item)
    setSelectData({...selectData,[key] : item})
  }


  
  useEffect(() => {
    fecthBoat();
    fecthPackageCate();
    fechLocation();
  },[]);

  useEffect(() => {
    if(!pkg || !boats || !types || !locations) return;

    const cate = types.find(val => val.value === pkg.cate_id )
    const boat_id = boats.find(val => val.value === pkg.products_boats[0]?.boat_id)
    const pickup_location_id = locations.find(val => val.value === pkg.pickup_location_id )

    // console.log('boat',boat)
    
    setSelectData({cate,boat_id,pickup_location_id})
  }, [pkg,types,boats,locations]);
  useEffect(() => {
    if(!pkg) return;
    setImg(pkg.picture ? pkg.picture : "/template/img/tour_1.jpg");
    setStartDate(pkg.start_time ? pkg.start_time : null);
    setEndDate(pkg.end_time ? pkg.end_time : null);
  },[pkg]);

  const handleChange = (event) => {
    if(!event.target.files[0]) {
      return;
    }
    setImg(URL.createObjectURL(event.target.files[0]));
  }

  const showstartDate = (e) => {
    var today = e._i;
    var data = e._d;
    // var da = setD(data);
    setStartDate(data);
  }

  const showendDate = (e) => {
    var today = e._i;
    var data = e._d;
    // var da = setD(data);
    setEndDate(data);
  }

  return (
    <>
      <div className="row" >
        <div className={`${(!edit || (pkg && !pkg.is_boat)) ? 'col-lg-8 ' : 'col-12'} col-12`}>
          <InputLabel inputProps={{ 
            className:'form-control', type : 'text',
            name : 'name', required : true,
            defaultValue : pkg ? pkg.name : undefined
          }} 
          labelName="Package Name" iconProps={{className : 'fa icon icon-email'}}  /> 
        </div>
        {
          (!edit || (pkg && !pkg.is_boat)) ? (
            <div className="col-lg-4 col-12">
              <div className="form-group select2">
                <label className="">Category</label>
                <Select
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti={false}
                  placeholder="-- Please Select Category --"
                  name="cate_id"
                  options={types}
                  value={selectData.cate }
                  onChange={ (e) => handleSelectChange('cate',e) }
                /> 
              </div>
            </div>
          ) : null
        }
      </div>

      <div className="row"> 
        <div className="col-12">
          <div className="form-group mb-4">
            <label>Short Description</label>
            <TextAreaLength className="form-control" name="short_description" required value={pkg ? pkg.short_description : ''} />
            {/* <textarea className="form-control" name="short_description" required defaultValue={pkg ? pkg.short_description : ''}></textarea> */}
          </div>
        </div>
      </div>

      <div className="row" >
        <div className="col-lg-6 col-12">
          <InputLabel inputProps={{ 
            className:'form-control', type : 'text',
            name : 'pickup_location', required : true,
            defaultValue : pkg ? pkg.pickup_location : undefined
          }} 
          labelName="Pickup Location" iconProps={{className : 'fa icon icon-email'}}  /> 
        </div>
        <div className="col-lg-6 col-12">
          <InputLabel inputProps={{ 
            className:'form-control', type : 'text',
            name : 'dropoff_location', required : true,
            defaultValue : pkg ? pkg.dropoff_location : undefined
          }} 
          labelName="Dropoff Location" iconProps={{className : 'fa icon icon-email'}}  /> 
        </div>
      </div>

      <div className="row" >
        <div className="col-lg-6 col-12">
          <div className="form-group select2 mb-4">
            <label className="">Location</label>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti={false}
              placeholder="-- Please Select Location --"
              name="pickup_location_id"
              options={locations}
              value={selectData.pickup_location_id }
              onChange={ (e) => handleSelectChange('pickup_location_id',e) }
            /> 
          </div>
        </div>
        {
          (!edit || (pkg && !pkg.is_boat)) ? (
            <>
              <div className="col-lg-3 col-12">
                <div className="form-group mb-4">
                  <label>Start Time</label>
                  <Datetime 
                  dateFormat={false} 
                  timeFormat={'HH:mm'}
                  onChange={(e)=> {showstartDate(e)}}
                  value={startDate ? startDate : ''}
                  inputProps={{ name: 'start_time', required : true, autoComplete : 'off' }} />
                </div>
              </div>
              <div className="col-lg-3 col-12">
                <div className="form-group mb-4">
                  <label>End Time</label>
                  <Datetime 
                  dateFormat={false} 
                  timeFormat={'HH:mm'}
                  onChange={(e)=> {showendDate(e)}}
                  value={endDate ? endDate : ''}
                  inputProps={{ name: 'end_time', required : true, autoComplete : 'off' }} />
                </div>
              </div>
            </>
          ) : null
        }
        


      </div>

      <div className="row">
        <div className="col-12">
          <div className="form-group mb-4">
            <label>Description</label>
            <Editor name="description" height="200px" required data={pkg ? pkg.description : ''} />
          </div>
        </div>
      </div>


      

      {/* <div className="row">
        <div className="col-12">
          <div className="form-group mb-4">
            <label>Highlight</label>
            <Editor name="highlight" height="200px" required data={pkg ? pkg.highlight : ''} />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="form-group mb-4">
            <label>Itinerary</label>
            <Editor name="itinerary" height="200px" required data={pkg ? pkg.itinerary : ''} />
          </div>
        </div>
      </div> */}

      <div className="row">
        <div className="col-lg-8 col-12">
          <InputLabel inputProps={{ 
            className:'form-control', type : 'text',
            name : 'remark', required : true,
            defaultValue : pkg ? pkg.remark : undefined
          }} 
          labelName="Remark" iconProps={{className : 'fa icon icon-email'}}  />
        </div>
        <div className="col-lg-4 col-12">
          <div className="form-group select2">
            <label className="">Boat</label>
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti={false}
              placeholder="-- Please Select Boat --"
              name="boat_id"
              options={boats}
              value={selectData.boat_id }
              onChange={ (e) => handleSelectChange('boat_id',e) }
            /> 
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4 col-12">
          <div className="form-group">
            <label>Thumbnail</label>
            <div className="default-picture">
              <div>
                <img src={img} className="mw-100" />
              </div>
              {/* <label className="mt-3">file</label> */}
              <input type="file" name="picture" id="picture" className="form-control"  onChange={handleChange} accept="image/png, image/jpeg, image/gif, image/jpg, image/svg"  />
            </div>
          </div>
        </div>
      </div>
    </>
  )
})
export default PackageDetail