"use client";

import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export default function App() {
  return (
    <>
      <Authenticated>
        <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800">

          <SignOutButton className="signoutbtn" />
        </header>
        <Content />
      </Authenticated>
      <Unauthenticated>
        <div className="w-full h-full flex flex-col items-center justify-center">
          <SignInForm />
        </div>
      </Unauthenticated>
    </>
  );
}

function SignOutButton({ className }: { className?: string }) {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  return (
    <>
      {isAuthenticated && (
        <button
          className={`bg-slate-200 dark:bg-slate-800 text-dark dark:text-light rounded-md px-2 py-1 ${className ?? ""
            }`}
          onClick={() => void signOut}
        >
          Sign out
        </button>
      )}
    </>
  );
}


function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);


  const handleSignIn = () => {
    signIn("google")
  }
  return (
      <div className="p-6 rounded-xl bg-black/20">
        <h1 className="font-bold text-2xl text-center mb-5">Log in to see</h1>

        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);2
            formData.set("flow", flow);
            void signIn("password", formData).catch((error) => {
              setError(error.message);
            });
          }}
        >
          <input
            className="w-full p-2 bg-black rounded-md" 
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            className="w-full p-2 bg-black rounded-md" 
            type="password"
            name="password"
            placeholder="Password"
          />
          <button
            className="w-full p-2 bg-black rounded-md" 
            type="submit"
          >
            {flow === "signIn" ? "Sign in" : "Sign up"}
          </button>
        </form>
        <div className="w-full flex gap-1 items-center"><span className="w-full h-px bg-gray-500/50" /> <p className="px-2">or</p><span className="w-full h-px bg-gray-500/50" /></div>
        <button onClick={handleSignIn} className="w-full p-2 bg-black rounded-md" >Sign in with Google</button>
        <div className="flex gap-2 mt-2 w-full justify-center">
          <div>
            {flow === "signIn"
              ? "Don't have an account?"
              : "Already have an account?"}
          </div>
          <div
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
            className="cursor-pointer"
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </div>
        </div>
        {error && (
          <div className="bg-red-500/20 border-2 border-red-500/50 rounded-md p-2">
            <p className="text-dark dark:text-light font-mono text-xs">
              Error signing in: {error}
            </p>
          </div>
        )}

      </div>
  );
}

function Content() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, {
      count: 10,
    }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (viewer === undefined || numbers === undefined) {
    return (
      <div className="mx-auto">
        <p>loading... (consider a loading skeleton)</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-lg mx-auto">
      <p className="whoissignedin">Welcome {viewer ?? "Anonymous"}!</p>
      <h1>Help</h1>
      <p>
        Typescript is hard
      </p>
      <p>
        <button
          className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2"
          onClick={() => {
            void addNumber({ value: Math.floor(Math.random() * 10) });
          }}
        >
          Add a random number
        </button>
      </p>
      <p>
        Numbers:{" "}
        {numbers?.length === 0
          ? "Click the button!"
          : (numbers?.join(", ") ?? "...")}
      </p>
    </div>
  );
}
