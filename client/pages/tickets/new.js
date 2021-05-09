import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import { useRouter } from 'next/router'

const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price
    },
    onSuccess: () => router.push('/')
  })
  const router = useRouter()
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)){
      return;
    }
    setPrice(value.toFixed(2))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    doRequest();
  }


return (
<div>
<h1 style={{ color: 'rebeccapurple' }}>Create a new ticket!</h1>
<form  onSubmit={onSubmit}>
  <div className='form-group'>
    <label>Title</label>
    <input className='form-control' value={title} onChange={e => setTitle(e.target.value)} />
  </div>
  <div className='form-group'>
    <label>Price</label>
    <input onBlur={onBlur} className='form-control' value={price} onChange={e => setPrice(e.target.value)}/>
  </div>
  { errors }
  <button className='btn btn-info'>Submit</button>
</form>

</div>

) 
}

export default NewTicket;