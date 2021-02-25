import React, { useEffect, useState,memo } from 'react';
import DataTable from 'react-data-table-component';
import api from '../../../utils/api-admin';
import ColumnTable from '../column/ColumnTableBooking';
import SubHeaderComponent from './BookingTableHeader';
import {toDateISO} from '../../../utils/tools'


const TableBooking = memo((props) => {
  const [bookings, setBooking] = useState();
  const [loading, setLoading] = useState(false);
  const [limit,setLimit] = useState(10);
  const [pageNumber,setPageNumber] = useState(1)
  const [sorting,setSorting] = useState({})

  const fecthBooking = (params={}) => {

    params.page = pageNumber;
    params.limit = limit;

    params.start_date = startDate ? toDateISO(startDate) : null;
    params.end_date = endDate ? toDateISO(endDate) : null;

    if(sorting.orderby) params.orderby = sorting.orderby
    if(sorting.op) params.op = sorting.op

    setLoading(true);
    api.getBooking(params)
    .then(res=>{
      const data = res.data;
      setBooking(data);
      setLoading(false);
    })
    .catch(err => {
      setLoading(false);
      console.log(err.response);
    })
  }

  const handlePageChange = page => {
    setPageNumber(page)
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLimit(newPerPage)
    // setPageNumber(1)
  };

  const handleSort = (column, sortDirection) => {
    setSorting({orderby : column.selector,op : sortDirection})
    // console.log(column,sortDirection)
  };
  
  useEffect(() => {
    // console.log(limit,pageNumber,sorting)
    // alert('ss')
    fecthBooking();
  },[limit,pageNumber,sorting]);
  

  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = bookings ? bookings.rows.filter(item => item.id && item.id.toString().toLowerCase().includes(filterText.toLowerCase())) : [];
  
  const columns = ColumnTable();

  console.log(bookings);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const showstartDate = (e) => {
    var today = e._i;
    var data = e._d;
    // var da = setD(data);
    setStartDate(data);
  }

  const showendDate = (e) => {
    var today = e._i;
    var data = e._d;
    // var da = setD(data);
    setEndDate(data);
  }

  const validStartDate = (current) => {
    //var getStart = startDate;
    let today = new Date();
    return current <= today;
  }

  const valid = (current) => {
    var getStart = startDate;
    let today = new Date();
    return current >= getStart && current <= today;
  }

  const handleSearch = () => {
    fecthBooking();
  }


  return (
    <>
      
      <DataTable
        columns={columns}
        data={filteredItems}
        pagination
        paginationResetDefaultPage={resetPaginationToggle}
        paginationServer
        paginationTotalRows={bookings?.count || 0}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onSort={handleSort}
        sortServer
        progressPending={loading}
        noHeader
        subHeader
        subHeaderComponent={
          <SubHeaderComponent 
            setResetPaginationToggle={setResetPaginationToggle} resetPaginationToggle={resetPaginationToggle} 
            setFilterText={setFilterText} filterText={filterText} placeholder={'Filter By Booking NO.'}
            showstartDate={showstartDate} showendDate={showendDate} validStartDate={validStartDate} valid={valid}
            startDate={startDate} endDate={endDate} handleSearch={handleSearch}
          />
        }
      />
    </>
  )
})
export default TableBooking