import { memo } from 'react';
import Input from '../../widget/Input'
import Button from '../../widget/Button'
import Datetime from 'react-datetime';


const SubHeaderComponent = memo((props) => {
  const {filterText, setFilterText, resetPaginationToggle, setResetPaginationToggle, placeholder, 
    showstartDate, showendDate, validStartDate, valid, startDate, endDate, handleSearch} = props;
  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };
  return <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} placeholder={placeholder}
  showstartDate={showstartDate} showendDate={showendDate} validStartDate={validStartDate} valid={valid} handleSearch={handleSearch}
  startDate={startDate} endDate={endDate} />;
});

const FilterComponent = ({ filterText, onFilter, onClear, placeholder, 
  showstartDate, showendDate, validStartDate, valid, startDate, endDate, handleSearch }) => (
  <>
    <div className="row w-100 justify-content-between align-items-center">
      <div className="col-lg-3 col-md-6 col-12">
        <div className="form-group">
          <Datetime 
          dateFormat="YYYY-MM-DD" 
          timeFormat={false}
          onChange={(e)=> {showstartDate(e)}}
          value={startDate ? startDate : ''}
          isValidDate={validStartDate}
          inputProps={{ name: 'start_date', required : true, autoComplete : 'off', placeholder: 'Start Date' }} />
        </div>
      </div>
      <div className="col-lg-3 col-md-6 col-12">
        <div className="form-group">
          <Datetime 
          dateFormat="YYYY-MM-DD" 
          timeFormat={false}
          onChange={(e)=> {showendDate(e)}}
          value={endDate ? endDate : ''}
          inputProps={{ name: 'end_date', required : true, autoComplete : 'off', placeholder: 'End Date' }}
          isValidDate={ valid }  />
        </div>
      </div>
      <div className="col-lg-3 col-md-6 col-12">
        <div className="form-group">
          <button type="button" className="btn btn-primary" onClick={() => handleSearch()}>Search by Date</button>
        </div>
      </div>
      <div className="col-lg-3 col-md-6 col-12 px-0">
        <div className="d-flex">
          <Input inputProps={{id : 'search', className : "form-control",  type : "text", placeholder : (placeholder ? placeholder : "Filter By Name"), value : filterText, onChange : onFilter }} />
          <Button _type="button" _class="btn-reset"  _click={onClear} _name="X" />
        </div>
      </div>
    </div>
    
  </>
);

export default SubHeaderComponent