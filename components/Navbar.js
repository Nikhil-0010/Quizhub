"use client"
import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { useSession, signOut } from 'next-auth/react'

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { status } = useSession();
    const [isLogin, setIsLogin] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };
    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 50);
    }, []);

    
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        if(status=='authenticated') setIsLogin(true);
        else setIsLogin(false);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll, status]);

    useEffect(() => {
        if (!dropdownOpen) return;
        const handleClickOutside = (e) => {
            if (
                !e.target.closest('.account-dropdown-btn') &&
                !e.target.closest('.account-dropdown-menu')
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <>
            <div className={`text-white flex mx-auto dark:bg-neutral-700 backdrop-blur-md justify-center  gap-6 md:gap-12 items-center shadow-sm shadow-gray-500 dark:shadow-none  sticky top-0  px-6 sm:px-10 md:px-20 z-20 py-2 transition-all duration-300 ease-in-out  will-change-auto  ${
                scrolled 
                ? "bg-neutral-600 bg-opacity-25 dark:bg-opacity-40 top-[1%] sm:top-[2%] shadow-sm  w-full sm:w-[60%]  md:w-[67%] lg:w-[50%] rounded-full dark:border-b-2 dark:border-b-neutral-600" 
                : "bg-slate-600 bg-opacity-30 dark:bg-opacity-60 rounded-none dark:border-b dark:border-neutral-600 w-full "
            }`}>
                <div className="logo text-2xl font-bold">
                    <Link href={"/"}><span className='text-3xl text-[#DD4c00] text-[#FF5F1F]'>Q</span><span className=''>uizhub</span></Link>
                </div>
                <div className='bg-slate-100 dark:bg-neutral-500 bg-opacity-60 w-[3px] h-7 rounded'></div>
                <div className='text-white flex items-center gap-2'>
                    {isLogin ? (
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className='account-dropdown-btn text-[#FF5F1F] bg-gray-200 bg-opacity-60 border border-gray-100 hover:bg-opacity-40 dark:hover:bg-opacity-70 dark:bg-neutral-900 dark:bg-opacity-90 dark:border dark:border-neutral-600 w-fit h-9 px-2 font-bold rounded-md flex gap-2 items-center justify-between'
                            >
                                Account
                                <span className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}>
                                    <div className="w-2 h-2 border-t-2 border-r-2 rounded-tr-sm border-white dark:border-neutral-500 transform rotate-[135deg]"></div>
                                </span>
                            </button>
                            <div className={`account-dropdown-menu absolute mt-2 w-fit md:w-48 transition-all duration-300 overflow-hidden ${dropdownOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} bg-white dark:bg-neutral-900 rounded-md shadow-lg z-20`}>
                                <Link href="/dashboard">
                                    <div className="block px-4 py-2 rounded-t-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</div>
                                </Link>
                                <button onClick={signOut} className="block w-full text-left px-4 py-2 rounded-b-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link href={"/login"}>
                            <button className='text-[#FF5F1F] bg-white hover:bg-opacity-70 dark:hover:bg-opacity-70 dark:bg-neutral-900 dark:bg-opacity-90 dark:border dark:border-neutral-600 w-20 h-9 px-4 font-bold rounded-md'>Login</button>
                        </Link>
                    )}
                    <ThemeToggle />
                </div>
            </div>
        </>
    )
}

export default Navbar
