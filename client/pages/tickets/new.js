import { useState } from 'react';

const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)){
      return;
    }
    setPrice(value.toFixed(2))
  }
  
return (
<div>
<h1 style={{ color: 'rebeccapurple' }}>Create a new ticket!</h1>
<form>
  <div className='form-group'>
    <label>Title</label>
    <input className='form-control' value={title} onChange={e => setTitle(e.target.value)} />
  </div>
  <div className='form-group'>
    <label>Price</label>
    <input onBlur={onBlur} className='form-control' value={price} onChange={e => setPrice(e.target.value)}/>
  </div>
  <button className='btn btn-info'>Submit</button>
</form>

</div>

) 
}

export default NewTicket;