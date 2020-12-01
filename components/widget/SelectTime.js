
import React, { useEffect, useState } from 'react';
  
const SelectTime = (props) => {
  const {active, setActive, onTimeChange, state, name} = props;
  const [hour, setHour] = useState('00');
  const [minute, setMinute] = useState('00');

  const option_hours = []
  for(var i = 0;i<=23;i++) {
    option_hours.push(<option key={i}>{i.toString().padStart(2, '0')}</option>);
  }

  const handleChange = (e, type) => {
    if(type == 'hour') {
      setHour(e.target.value);
    }
    if(type == 'minute') {
      setMinute(e.target.value);
    }
  }

  useEffect(() => {
    onTimeChange && onTimeChange(name, `${hour}:${minute}`)
  }, [hour, minute])

  
  return (
    <>
      <div className={`panel-dropdown w-50 ${active ? 'active' : ''}`}>
        <a onClick={() => setActive(!active)}><span className="select-time">{hour}:{minute}</span></a>
        <div className="panel-dropdown-content time right">
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