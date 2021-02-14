
import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Router from 'next/router'
import ImageBoxBackend from '../../widget/ImageBoxBackend';
import api from '../../../utils/api'
import UserContext from '../../../contexts/UserContext';
import Datetime from 'react-datetime';

const Dialog = (props) => {
  const {show, size, onHide, total_price, booking} = props;

  const { user } = useContext(UserContext);
  const [startDate, setStartDate] = useState(null);

  const handleSubmit = (event)=>{
    event.preventDefault();

    var data = new FormData(event.target);
    data.append('booking_id', booking.id);
    data.append('user_id', user.id);
    api.insertBookingSlip(data)
    .then(res=>{
      const data = res.data;
      Router.push('/order-success')
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  const [chkImg, setChkimg]  = useState(false);
  const showstartDate = (e) => {
    var today = e._i;
    var data = e._d;
    // var da = setD(data);
    setStartDate(data);
  }
  
  
  return (
    <Modal className="modal-alert" id="sign-in-dialog" centered show={show} onHide={onHide} size={size}>
      <Modal.Body>
        <div className="row">
          <div className="col-12">
            <div className="small-dialog-header">
              <h3>Tranfer Slip</h3>
            </div>
            <form className="px-3" id="login-form-modal" onSubmit={handleSubmit}>
              <div>
                <div className="form-group mb-1">
                  <label>Tranfer Slip</label>
                  <ImageBoxBackend  _name="image" _id="image" chkImg={chkImg} required={true} classBox={'box-slip'} />
                </div>
                <div className="form-group">
                  <label>Tranfer Date</label>
                  <Datetime 
                    dateFormat="YYYY-MM-DD" 
                    timeFormat={'HH:mm'}
                    onChange={(e)=> {showstartDate(e)}}
                    value={startDate ? startDate : ''}
                    inputProps={{ name: 'tranfer_date', required : true, autoComplete : 'off', className : 'form-control padding-10' }} />
                </div>
                <div className="form-group mb-1">
                  <label>From Bank</label>
                  <select name="from_bank" className="form-control padding-10" required >
                    <option value="" className="selected">Select Bank</option>
                    <option value="ไทยพาณิชย์ (SCB)" data-index="0">ไทยพาณิชย์ (SCB)</option>
                    <option value="กสิกรไทย (Kbank)" data-index="1" className="selected">กสิกรไทย (Kbank)</option>
                    <option value="กรุงไทย (KTB)" data-index="2">กรุงไทย (KTB)</option>
                    <option value="กรุงเทพ (BBL)" data-index="3">กรุงเทพ (BBL)</option>
                    <option value="กรุงศรี (BAY)" data-index="4">กรุงศรี (BAY)</option>
                    <option value="ธนชาติ (Thanachart)" data-index="5">ธนชาติ (Thanachart)</option>
                    <option value="ทหารไทย (TMB)" data-index="6">ทหารไทย (TMB)</option>
                    <option value="ออมสิน (GSB)" data-index="7">ออมสิน (GSB)</option>
                    <option value="ธ.ก.ส. (BAAC)" data-index="8">ธ.ก.ส. (BAAC)</option>
                    <option value="เกียรตินาคิน (Kiatnakin)" data-index="9">เกียรตินาคิน (Kiatnakin)</option>
                    <option value="แสตนดาร์ดชาร์เตอร์ด (Standard Chartered)" data-index="10">แสตนดาร์ดชาร์เตอร์ด (Standard Chartered)</option>
                    <option value="ยูโอบี (UOB)" data-index="11">ยูโอบี (UOB)</option>
                    <option value="ทิสโก้ (TISCO)" data-index="12">ทิสโก้ (TISCO)</option>
                    <option value="ซีไอเอ็มบี (CIMB)" data-index="13">ซีไอเอ็มบี (CIMB)</option>
                    <option value="ไอซีบีซี (ICBC)" data-index="14">ไอซีบีซี (ICBC)</option>
                  </select>
                </div>
                <div className="form-group mb-1">
                  <label>To Bank</label>
                  <select name="to_bank" className="form-control padding-10" required >
                    <option value="" className="selected">Select Bank</option>
                    <option value="ไทยพาณิชย์ (SCB)" data-index="0">ไทยพาณิชย์ (SCB)</option>
                    <option value="กสิกรไทย (Kbank)" data-index="1" className="selected">กสิกรไทย (Kbank)</option>
                    <option value="กรุงไทย (KTB)" data-index="2">กรุงไทย (KTB)</option>
                    <option value="กรุงเทพ (BBL)" data-index="3">กรุงเทพ (BBL)</option>
                    <option value="กรุงศรี (BAY)" data-index="4">กรุงศรี (BAY)</option>
                    <option value="ธนชาติ (Thanachart)" data-index="5">ธนชาติ (Thanachart)</option>
                    <option value="ทหารไทย (TMB)" data-index="6">ทหารไทย (TMB)</option>
                    <option value="ออมสิน (GSB)" data-index="7">ออมสิน (GSB)</option>
                    <option value="ธ.ก.ส. (BAAC)" data-index="8">ธ.ก.ส. (BAAC)</option>
                    <option value="เกียรตินาคิน (Kiatnakin)" data-index="9">เกียรตินาคิน (Kiatnakin)</option>
                    <option value="แสตนดาร์ดชาร์เตอร์ด (Standard Chartered)" data-index="10">แสตนดาร์ดชาร์เตอร์ด (Standard Chartered)</option>
                    <option value="ยูโอบี (UOB)" data-index="11">ยูโอบี (UOB)</option>
                    <option value="ทิสโก้ (TISCO)" data-index="12">ทิสโก้ (TISCO)</option>
                    <option value="ซีไอเอ็มบี (CIMB)" data-index="13">ซีไอเอ็มบี (CIMB)</option>
                    <option value="ไอซีบีซี (ICBC)" data-index="14">ไอซีบีซี (ICBC)</option>
                  </select>
                </div>
                <div className="form-group mb-1">
                  <label>Price</label>
                  <input type="text" name="amount" className="form-control padding-10" required defaultValue={total_price} />
                </div>
                <div className="form-group mb-1">
                  <label>Pin</label>
                  <input type="text" name="pin" className="form-control padding-10" required minLength={4} maxLength={4} />
                </div>
              </div>
              <div className="mt-4">
                <button className="btn btn-primary w-100">Pay Now</button>
              </div>
            </form>
            <button title="Close (Esc)" type="button" className="mfp-close" onClick={onHide}></button>
          </div>
        </div>
      </Modal.Body>
    </Modal>  
  )
}

export default Dialog