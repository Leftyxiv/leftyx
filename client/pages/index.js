import React from "react";
import buildClient from '../api/buildClient';

const LandingPage = ({ currentUser }) => {
  return (
    <div>
     <h1 style={{ color: 'rebeccapurple' }}>
       { currentUser ? 'You are signed in' : 'You are not signed in'}
       </h1> 
    </div>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client =  buildClient(context)
 const { data } = await client.get('/api/users/currentuser')
 return data
};

export default LandingPage;
