
import React, { useEffect, useState } from 'react';
  
const SelectTime = (props) => {
  const {active, setActive, onTimeChange, value, name, isBackend = false} = props;
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');

  useEffect(()=>{
    if(value){
      var arr = value.split(':')
      setHour(arr[0])
      setMinute(arr[1])
    }
  },[value])

  const option_hours = []
  for(var i = 0;i<=23;i++) {
    option_hours.push(<option key={i}>{i.toString().padStart(2, '0')}</option>);
  }

  const handleChange = (e, type) => {
    if(type == 'hour') {
      setHour(e.target.value);
      onTimeChange && onTimeChange(name, `${e.target.value}:${minute}`)
    }
    else if(type == 'minute') {
      setMinute(e.target.value);
      onTimeChange && onTimeChange(name, `${hour}:${e.target.value}`)
    }
  }

  // useEffect(() => {
  //   onTimeChange && onTimeChange(name, `${hour}:${minute}`)
  // }, [hour, minute])

  
  return (
    <>
      <div className={`panel-dropdown w-50 ${active ? 'active' : ''}`}>
        <div className="d-flex justify-content-between" onClick={isBackend ? () => setActive(!active) : null}>
          <a onClick={() => setActive(!active)}><span className="select-time">{hour}:{minute}</span></a>
          {
            isBackend ? (
              <>
                {
                  active ? (<i className="fas fa-chevron-up mt-2" onClick={() => setActive(!active)}></i>)
                  : (<i className="fas fa-chevron-down mt-2" onClick={() => setActive(!active)}></i> )
                }
              </>
            ) : null
          }
         
        </div>
        <div className={`panel-dropdown-content time right ${isBackend ? (active ? '' : 'd-none') : ''}`}>
          <div className="select-option-time">
            <label>Hour</label>
            <select className="form-control" value={hour} onChange={(e) => handleChange(e, 'hour')}>
              {option_hours}
            </select>
          </div>
          <div className="select-option-time">
            <label>Minute</label>
            <select className="form-control" value={minute} onChange={(e) => handleChange(e, 'minute')}>
              <option>00</option>
              <option>30</option>
            </select>
          </div>
        </div>
      </div>
    </>
  )
}
export default SelectTime