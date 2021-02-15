import {useState,useEffect} from 'react'

const TextAreaLength = ({className='',length=255,onChange,value,name,required=false})=>{

  const [text,setText] = useState('')
  useEffect(() => setText(value) ,[value])
  const onTextChange =(e) =>{
    const {value : v} = e.target;
    var tmp;
    if(v.length > length){
      tmp = v.slice(0,length)
    }
    else tmp = v;
    setText(tmp)
    onChange?.(tmp)
  }
  return (
    <div className="position-relative" >
      <textarea className={className}  name={name} required={required}  value={text} onChange={onTextChange} />
      <div className={"p-1"+(text.length === length ? ' text-danger' :'')}
      style={{fontSize : '12px'}}> 
      {text?.length || 0}/{length} 
      </div>
    </div>
  )
}
export default TextAreaLength