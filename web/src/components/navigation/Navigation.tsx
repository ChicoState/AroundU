import Link from 'next/link';
import React from 'react';

export default function Navigation() {
  return (
    <div className="fixed left-0 right-0 top-0 flex flex-row justify-center bg-white p-4 shadow-md">
      <div className="flex w-full max-w-6xl items-center">
        <div>
          <Link href="/" className="text-black-500 font-bold">
            AroundU
          </Link>
        </div>
        <div className="ml-auto flex flex-row">
          <Link href="/login" className="rounded bg-blue-500 px-4 text-white">
            Login
          </Link>
          <Link href="/register" className="px-4">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
