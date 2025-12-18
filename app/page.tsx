// Login page
"use client"
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const handleSubmit = (e : any) => {
    e.preventDefault(); 

    const formData = new FormData(e.target);
    const email = formData.get("username");
    const password = formData.get("password");

    router.push('/dashboard');
    console.log(email, password);
  };

  return (

    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-indigo-950">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black ">

        <h1 className="text-4xl font-bold">
          FNV Inventory
        </h1>
        <h2 className="text-2xl font-bold">
          Management System
        </h2>

        <form onSubmit={handleSubmit} className="mt-20">
          <h1 className="text-center mb-8 text-3xl font-medium text-zinc-900 dark:text-zinc-100">
            Login
          </h1>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-100" htmlFor="username">
              Username
            </label>
            <input
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
              type="text"
              id="username"
              name="username"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-100" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100"
              type="password"
              id="password"
              name="password"
              required
            />
          </div>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="submit"
          >
            Login
          </button>
        </form>

      </main>
    </div>
  );
}
