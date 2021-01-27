import React from 'react';
import { Modal } from 'react-bootstrap';
import Link from 'next/link'

const Dialog = ({show, onHide, size, data, handleAdd}) => {

  return (
    <Modal className="modal-alert" centered show={show} onHide={onHide} size={size}>
      <Modal.Body>
          <div className="row mt-3 justify-content-center">
            <div className="col-12">
              <h4>Package</h4>
            </div>
          </div>

          <div className="mt-4 border-bottom">
            <table className="d-table table table-responsive">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {
                  data && data.rows.map((val,index) => (
                    <tr key="index">
                      <td>{index + 1}</td>
                      <td>{val.name}</td>
                      <td className="text-right">
                        <button className="a-manage info w-100px" onClick={() => handleAdd(val.id)}><i className="fa fa-fw fa-plus"></i> <span>Add</span></button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="row mt-2 justify-content-center">
          <div className="col-12 mb-2">
            <div className="text-right">
              <button type="button" className="btn btn-outline-primary mr-4" onClick={onHide}>Cancel</button>
            </div>
          </div>
        </div>
      </Modal.Footer>
    </Modal>  
  )
}

export default Dialog