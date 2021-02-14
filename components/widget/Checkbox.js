import React from 'react';
  
const Checkbox = (props) => {
  const {value1,value2,onChange,name='',onAmountAddonChange,quantity,checked} = props;


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
      <div class="clearfix">
        <div class="checkboxes float-left w-100 d-flex justify-content-between">
          <label class="container_check">
            <input type="checkbox" onChange={onChange} name={name} checked={checked}/>
            <span class="checkmark"></span>
            <div className="">
              <label>{value1}</label>
            </div>
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