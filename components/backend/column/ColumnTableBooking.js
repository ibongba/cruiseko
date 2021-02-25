
import Link from 'next/link';
import React from 'react';
import {isCancel} from '../../../utils/packageHelper'

const ColumsBody = (props) => {

  const columns = [
    {
      name: 'Booking NO.',
      selector: 'id',
      sortable: true,
    },
    {
      name: 'Booking By',
      selector: 'user_firstname',
      sortable: true,
      cell : row => (
        <span>{row.user_firstname} {row.user_lastname}</span>
      )
    },
    {
      name: 'Price',
      selector: 'net_price',
      sortable: true,
    },
    {
      name: 'Payment Status',
      selector: 'payment_status',
      sortable: true,
      cell : row => (
        
        row.payment_status == 2 ? 
        <span className="text-success">Success</span> : 
        isCancel(row) ? 
        <span className="text-danger">Cancel</span> : 
        <span className="text-warning">Pending</span> 
        
        
      )
    },
    {
      name: 'Created date',
      selector: 'createdAt',
      sortable: true,
    },
    {
      name: '',
      sortable: true,
      width : '200px',
      right : true,
      cell : row => (
        <span>
          <ul className="buttons manage">
            <li>
              <Link href="/backend/booking/detail/[id]" as={`/backend/booking/detail/${row.id}`}>
                <button className="a-manage warning"><i className="fa fa-fw fa-pencil"></i> <span>Detail</span></button>
              </Link>
            </li>
          </ul>
        </span>
      )
    },
  ];

  return columns;

}



export default ColumsBody