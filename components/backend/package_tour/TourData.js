import React,{memo} from 'react';
import InputLabel from '../../widget/InputLabel';

const TourData = memo((props) => {
  const {name,handlePriceChange,type,index} = props;

  const onChange =(e,key) =>{
    var {value} = e.target;
    handlePriceChange(type,index,key,value)
  }
  return (
    <>
      <div className="row justify-content-center align-items-center">
        <div className="col-lg-2 col-12">
          <div className="text-center">
            <p className="p-medium">{name}</p>
          </div>
       </div>
        <div className="col-lg-2 col-12">
          <InputLabel inputProps={{ 
            className:'form-control', type : 'text',
            name : 'name', required : true,
            value : props.price,
            onChange : (e) => onChange(e,'price')
          }} 
          labelName="Price" iconProps={{className : 'fa icon icon-email'}}  />
        </div>
        <div className="col-lg-2 col-12">
          <InputLabel inputProps={{ 
            className:'form-control', type : 'text',
            name : 'name', required : true,
            value : props.deposit_rate, readOnly:name === 'FIT',
            onChange : (e) => onChange(e,'deposit_rate')
          }} 
          labelName="% Deposit" iconProps={{className : 'fa icon icon-email'}}  />
        </div>
        <div className="col-lg-2 col-12">
          <InputLabel inputProps={{ 
            className:'form-control', type : 'text',
            name : 'name', required : true,
            value : props.deposit, readOnly:name === 'FIT',
            onChange : (e) => onChange(e,'deposit')
          }} 
          labelName="Deposit" iconProps={{className : 'fa icon icon-email'}}  />
        </div>
        <div className="col-lg-2 col-12">
          <InputLabel inputProps={{ 
            className:'form-control', type : 'text',
            name : 'name', required : true,
            value : props.commission_rate , readOnly : true
          }} 
          labelName="% Commission" iconProps={{className : 'fa icon icon-email'}}  />
        </div>
        <div className="col-lg-2 col-12">
          <div className="d-flex align-items-center justify-content-between">
          <InputLabel inputProps={{ 
              className:'form-control', type : 'text',
              name : 'name', required : true,
              value : props.commission, readOnly:name === 'FIT',
              onChange : (e) => onChange(e,'commission')
            }} 
            labelName="Commission" iconProps={{className : 'fa icon icon-email'}}  />
            <div>
              <button className="btn-add-tier">+</button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
})
export default TourData