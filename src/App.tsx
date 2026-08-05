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
import { useEffect, useState } from "react";

export default function App() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800">
        
        <TaskBar />
        <SignOutButton className="signoutbtn"/>
      </header>
      <main className="p-8 flex flex-col gap-16">
        <h1 className="text-4xl font-bold text-center">
          Help
        </h1>
        <Authenticated>
          <Content />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
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
          className={`bg-slate-200 dark:bg-slate-800 text-dark dark:text-light rounded-md px-2 py-1 ${
            className ?? ""
          }`}
          onClick={() => void signOut()}
        >
          Sign out
        </button>
      )}
    </>
  );
}

function TaskBar() {
  const { isAuthenticated } = useConvexAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    const myTaskbar = new Taskbar('taskbar-container');
    myTaskbar.addTask('app-1', 'Notepad');
    myTaskbar.addTask('app-2', 'Browser');
    myTaskbar.addTask('app-3', 'Terminal');
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return <div id="taskbar-container" className="taskbar" />;
}

interface TaskItem {
  id: string;
  title: string;
  active: boolean;
}

class Taskbar {
  private tasks: TaskItem[] = [];
  private container: HTMLElement;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error('Container not found');
    this.container = el;
    this.render();
  }

  public addTask(id: string, title: string): void {
    this.tasks.push({ id, title, active: false });
    this.render();
  }

  public removeTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.render();
  }

  public activateTask(id: string): void {
    this.tasks.forEach(task => {
      task.active = task.id === id;
    });
    this.render();
  }

  private render(): void {
    this.container.innerHTML = '';

    for (const task of this.tasks) {
      const btn = document.createElement('button');
      btn.innerText = task.title;
      btn.className = task.active ? 'task-btn active' : 'task-btn';
      btn.onclick = () => this.activateTask(task.id);
      this.container.appendChild(btn);
    }
  }
}


function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <div className="flex flex-col gap-8 w-96 mx-auto">
      <p>Log in to see</p>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            setError(error.message);
          });
        }}
      >
        <input
          className="email"
          type="email"
          name="email"
          placeholder="Email"
        />
        <input
          className="password"
          type="password"
          name="password"
          placeholder="Password"
        />
        <button
          className="signinbtn"
          type="submit"
        >
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        <div className="flex flex-row gap-2">
          <span>
            {flow === "signIn"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <span
            className="text-dark dark:text-light underline hover:no-underline cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </span>
          <button onClick={() => void signIn("google")}className="signinwithgooglebtn">Sign in with Google</button>
        </div>
        {error && (
          <div className="bg-red-500/20 border-2 border-red-500/50 rounded-md p-2">
            <p className="text-dark dark:text-light font-mono text-xs">
              Error signing in: {error}
            </p>
          </div>
        )}
      </form>
      </div>
    </>
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
      <p>
        Click the button below and open this page in another window - this data
        is persisted in the Convex cloud database!
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
      <p>
        Edit{" "}
        <code className="text-sm font-bold font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded-md">
          convex/myFunctions.ts
        </code>{" "}
        to change your backend
      </p>
      <p>
        Edit{" "}
        <code className="text-sm font-bold font-mono bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded-md">
          src/App.tsx
        </code>{" "}
        to change your frontend
      </p>
    </div>
  );
}
