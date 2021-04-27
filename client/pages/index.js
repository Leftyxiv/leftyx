import React from "react";
import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return (
    <div>
      <h1>landing page</h1>
    </div>
  );
};

LandingPage.getInitialProps = async () => {
  if (typeof window === "undefined") {
    // code here executed server side
    const { data } = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: {
          Host: "leftyx.dev",
        },
      },
    );
    return data;
  } else {
    // code executed inside the browser
    const { data } = await axios.get("/api/users/currentuser");
    return data;
  }
  // return res.data;
  return {};
};

export default LandingPage;
