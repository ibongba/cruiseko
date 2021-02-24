import React from 'react';
import Datetime from 'react-datetime';
import SelectTime from '../../widget/SelectTime'

const BookingDate = ({startDate, showstartDate, activeFrom, setActiveFrom, onTimeChange, activeTo, setActiveTo, state, is_boat}) => {
  
  return (
    <>
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
    </>  
  )
}

export default BookingDate