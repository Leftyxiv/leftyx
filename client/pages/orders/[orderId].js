import React, { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/useRequest';
import { useRouter } from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: (payment) => router.push('/orders')
  })
  
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
    let seconds = parseInt(timeLeft - (minutes * 60));
    renderedContent = `You have ${minutes} minutes and ${seconds} seconds to comeplete the order.`
  } else if (timeLeft < 60 && timeLeft > 0) {
    renderedContent = `${ timeLeft } seconds until the order expires`
  } else {
    renderedContent = "Your order has exired!"
  }

  return (
    <div>
      <h1> While in test mode use card 4242 4242 4242 4242
    with any future date and cvv

      </h1>
      { renderedContent }
      <StripeCheckout 
      token={({ id }) => doRequest({ token: id })} 
      stripeKey="pk_test_51ICUbJCmKh2QkhLrblIXLN8WyXOMcG8snpqJGvKAJ6I23fpIOUeQNUMBTr0dCijksuQYKTEhssdRfoYDA4tIxain00UHDreOsZ" 
      amount={order.ticket.price * 100}
      email={currentUser.email}
      />
      { errors }
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data }
}

export default OrderShow;
