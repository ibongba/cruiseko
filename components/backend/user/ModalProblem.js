import React from 'react';
import { Modal } from 'react-bootstrap';
import api from '../../../utils/api-admin'
import Link from 'next/link';

const Dialog = ({show, onHide, size, user_id}) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    var data = new FormData(event.target)
    data.append('approve_status', 2);
    api.updateUsers(user_id, data)
    .then(res=>{
      const data = res.data;
      onHide();
      Router.push('/backend/users');
    })
    .catch(err => {
      console.log(err);
      console.log(err.response);
    })
  }
  
  return (
    <Modal className="modal-alert" centered show={show} onHide={onHide} size={size}>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="row mt-4 justify-content-center">
            <div className="col-12">
              
            </div>
            <div className="col-12 mb-4">
              <div className="text-center">
                <button type="submit" className="btn btn-primary">ยืนยัน</button>
                <button type="button" className="btn btn-outline-primary ml-4" onClick={onHide}>ยกเลิก</button>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>  
  )
}

export default Dialog