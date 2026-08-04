import { Authenticated, Unauthenticated } from "convex/react";
import { SignOutButton } from "./SignOutButton";

export function App() {
  return (
    <>
      <Authenticated>
        <SignOutButton />
      </Authenticated>
      <Unauthenticated>
        <p>Please log in.</p>
      </Unauthenticated>
    </>
  );
}
