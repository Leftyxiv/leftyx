import React from "react";
import buildClient from '../api/buildClient';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return (
    <div>
      <h1>landing page</h1>
    </div>
  );
};

LandingPage.getInitialProps = async (context) => {
 const { data } = await buildClient(context).get('/api/users/currentuser')
 return data
};

export default LandingPage;
