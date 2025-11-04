'use client';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetch('/api/todos')
      .then((res) => console.log(res.json()))
      .then(console.log);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black"></div>
  );
}
