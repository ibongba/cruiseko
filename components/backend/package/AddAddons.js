import React,{memo,useState} from 'react';
import InputLabel from '../../widget/InputLabel';
import Button from '../../widget/Button';

const init_state = {
  name : '',
  price : '',
  description : ''
}

const AddAddons = memo((props) => {
  const {handleAddonSave, handleClose,editData} = props;
  const {addAddon,editAddon} = props
  const [state,setState] = useState(editData || init_state)
  const onChange =(e) =>{
    const {name,value} = e.target;
    const key = name.split(':')[1]
    if(!key) return;
    setState({...state,[key] : value  })
  }

  const onClickAdd = () =>{
    addAddon(state);
    handleClose && handleClose();
  }
  const onClickEdit = ()=>{
    editAddon(state);
    handleClose && handleClose();
  }

  const onClickClose =()=>{
    setState(init_state);
    handleClose && handleClose();
  }
  return (
    <>
      <div className="row justify-content-center align-items-center">
        
        <div className="col-lg-2 col-12">
          <InputLabel inputProps={{ 
            className:'form-control', type : 'text',
            name : 'addon:name', required : true,
            value : state.name,
            onChange : onChange
          }} 
          labelName="Name" iconProps={{className : 'fa icon icon-email'}}  />
        </div>
        <div className="col-lg-2 col-12">
          <InputLabel inputProps={{ 
            className:'form-control', type : 'text',
            name : 'addon:price', required : true,
            value : state.price,
            onChange : onChange
          }} 
          labelName="Price" iconProps={{className : 'fa icon icon-email'}}  />
        </div>
        
      </div>
      <div className="row justify-content-center align-items-center mb-5">
        <div className="col-lg-4 col-12">
          
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" name='addon:description' value={state.description} onChange={onChange} />
          </div>
          
        </div>
      </div>
      <div className="text-center">
        <Button _type="button" _name={"Save"} _class="btn-primary" _click={editData? onClickEdit : onClickAdd} />
        <Button _type="button" _name="Cancel" _class="btn-outline-primary ml-4" _click={onClickClose} />
      </div>
    </>
  )
})
export default AddAddons