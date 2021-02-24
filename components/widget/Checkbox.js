import React, { useRef, useState } from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';

const Checkbox = (props) => {
  const {value1,value2,onChange,name='',onAmountAddonChange,quantity,checked, description} = props;
  const target = useRef(null);
  const [show, setShow] = useState(false);


  const onAmountChange = (type)=>{
    
    var number = quantity;
    if(type === 'plus'){
      number +=1 ;
    }
    else{
      if(number > 1){
        number -=1;
      }
    }
    onAmountAddonChange?.(name,number)
  }

  return (
    <>
      <div className="clearfix">
        <div className="checkboxes float-left w-100 d-flex justify-content-between">
          <label className="container_check">
            <input type="checkbox" onChange={onChange} name={name} checked={checked}/>
            <span className="checkmark"></span>
            <div className="">
              <label>{value1} <i className="fas fa-info-circle curser-pointer" ref={target} onClick={() => setShow(!show)}></i></label>
            </div>
            <Overlay target={target.current} show={show} placement="right">
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  {description ? description : 'No Description'}
                </Tooltip>
              )}
            </Overlay>
          </label>
          <div className="d-flex">
            <div className="box-addon">
              <span className={"minus" + (quantity <= 1 ? ' disabled' : '')} onClick={() => onAmountChange('minus')}><i className="fas fa-minus"></i></span>
              <span className="number">{quantity}</span>
              <span className="plus" onClick={() => onAmountChange('plus')}><i className="fas fa-plus"></i></span>
            </div>
            <label className="chk-price">{value2}</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default Checkbox