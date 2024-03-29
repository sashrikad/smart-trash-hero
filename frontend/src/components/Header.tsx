import { WithAuthenticatorProps } from "@aws-amplify/ui-react";
import React from "react";
import { withAuthenticator } from "@aws-amplify/ui-react";

function Header({ signOut, user }: WithAuthenticatorProps) {
  return (
    <>
      <h1>Hello {user?.username}</h1>
      <button onClick={signOut}>Sign out</button>
    </>
  );
}

export default withAuthenticator(Header);
