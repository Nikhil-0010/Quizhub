"use client"
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { useSession, signOut } from 'next-auth/react'

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { status } = useSession();
    const [isLogin, setIsLogin] = useState(false);
    
    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 50);
    }, []);

    
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        if(status=='authenticated') setIsLogin(true);
        else setIsLogin(false);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll, status]);

    return (
        <>
            <div className={`text-white flex mx-auto dark:bg-neutral-900 backdrop-blur-md justify-center  gap-6 md:gap-12 items-center shadow-sm shadow-gray-500 dark:shadow-none  sticky top-0  px-6 sm:px-10 md:px-20 z-20 py-2 transition-all duration-300 ease-in-out  will-change-auto  ${
        scrolled 
        ? "bg-neutral-600 bg-opacity-25 dark:bg-opacity-40 top-[1%] sm:top-[2%] shadow-sm  w-full sm:w-[60%]  md:w-[67%] lg:w-[50%] rounded-full dark:border-b-2 dark:border-b-neutral-900" 
        : "bg-slate-600 bg-opacity-30 rounded-none dark:border-b dark:border-slate-600 w-full "
      }`}>
                <div className="logo text-2xl font-bold">
                    <Link href={"/"}><span className='text-3xl text-[#DD4c00] text-[#FF5F1F]'>Q</span><span className=''>uizhub</span></Link>
                </div>
                <div className='bg-slate-100 dark:bg-neutral-600 bg-opacity-60 w-[3px] h-7 rounded'></div>
                <div className='text-white flex items-center gap-2'>
                    {/* <button className='mode bg-[#e3e3e3] px-3 py-1 text-black dark:bg-neutral-800 dark:text-[#e3e3e3]  rounded-lg'>Change Mode</button> */}
                    {isLogin?<button onClick={signOut} className='text-[#FF5F1F] bg-white hover:bg-opacity-70 dark:hover:bg-opacity-70 dark:bg-neutral-950 dark:bg-opacity-90 dark:border dark:border-neutral-700 w-20 h-9 px-2 font-bold rounded-lg'>Logout</button>:
                    <Link href={"/login"}>
                        <button className='text-[#FF5F1F] bg-white hover:bg-opacity-70 dark:hover:bg-opacity-70 dark:bg-neutral-950 dark:bg-opacity-90 dark:border dark:border-neutral-700 w-20 h-9 px-4 font-bold rounded-lg'>Login</button>
                    </Link>}
                    <ThemeToggle />
                </div>
            </div>
        </>
    )
}

export default Navbar
