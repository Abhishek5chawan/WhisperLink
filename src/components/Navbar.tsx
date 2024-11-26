"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from './ui/button';

const Navbar = () => {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (
        <nav className="container mx-auto flex justify-between items-center p-4 bg-gradient-to-br from-purple-400 to-indigo-600 text-white shadow-md">
            <div className="flex items-center">
                <a className="text-xl font-bold hover:text-blue-200 transition-all" href="https://mystery-fw0usqmqg-abhishek-cs-projects.vercel.app/">
                    Mystery Message
                </a>
            </div>
            <div className="flex items-center">
                {session ? (
                    <>
                        <span className="mr-4 text-sm md:text-base">Welcome, {user?.username || user?.email}</span>
                        <Button
                            className="w-auto hover:bg-red-600 transition-all transform hover:scale-105"
                            onClick={() => signOut()}>
                            Logout
                        </Button>
                    </>
                ) : (
                    <Link href="/sign-in">
                        <Button className="w-auto hover:bg-blue-500 transition-all transform hover:scale-105">
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
