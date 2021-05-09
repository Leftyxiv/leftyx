import React, { useEffect, useState } from 'react'

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState('');

  
  useEffect(() => {
    const findTimeLeft = () => {
      const msleft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msleft/1000))
    }

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    }
  }, [])
  
  let renderedContent;

  if(timeLeft > 60){
    let minutes = parseInt(timeLeft / 60)
    let seconds = timeLeft - (minutes * 60);
    renderedContent = `You have ${minutes} minutes and ${parseInt(seconds)} seconds to comeplete the order.`
  } else {
    renderedContent = `${ timeLeft } seconds until order expires`
  }

  return (
    <div>
      { renderedContent }
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data }
}

export default OrderShow;
