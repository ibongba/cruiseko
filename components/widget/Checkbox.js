import React from 'react';
  
const Checkbox = (props) => {
  const {value1,value2,onChange,name=''} = props;

  return (
    <>
      <div class="clearfix">
        <div class="checkboxes float-left w-100 d-flex justify-content-between">
          <label class="container_check">
            <input type="checkbox" onChange={onChange} name={name} />
            <span class="checkmark"></span>
            <div className="">
              <label>{value1}</label>
            </div>
          </label>
          <div className="d-flex">
            <div className="box-addon">
              <span className="minus disabled"><i className="fas fa-minus"></i></span>
              <span className="number">1</span>
              <span className="plus"><i className="fas fa-plus"></i></span>
            </div>
            <label className="chk-price">{value2}</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkbox