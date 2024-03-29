import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import "@aws-amplify/ui-react/styles.css";
import type { WithAuthenticatorProps } from "@aws-amplify/ui-react";
import { withAuthenticator } from "@aws-amplify/ui-react";
import DeviceMap from "./components/DeviceMap";
import AppSidebar from "./scenes/global/AppSidebar";
import Topbar from "./scenes/global/Topbar";

function App({ signOut, user }: WithAuthenticatorProps) {
  const [isSidebar, setIsSidebar] = useState(true);
  return (
    <div className="app">
      {/* <AppSidebar /> */}
      {/* <Header></Header> */}
      <Topbar></Topbar>
      <DeviceMap></DeviceMap>
    </div>
  );
}

export default withAuthenticator(App);
