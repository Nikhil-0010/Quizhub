"use client"
import { signOut, useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef, Suspense, lazy } from 'react'
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';
import Loading from '@/components/Loading';
import dynamic from "next/dynamic";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  ChartNoAxesCombined, LibraryBig, PenLine } from 'lucide-react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

const YourQuizes = dynamic(() => import("./YourQuizes"), {
  loading: () => <Loading />
});
const QuizAnalytics = dynamic(() => import("./QuizAnalytics"), {
  loading: () => <Loading />
})
const CreateQuiz = lazy(() => import('./create/CreateQuiz'));



const SideNavbar = ({ option, handleOption, menuItems }) => {
  const tabRefs = useRef({}); // Store tab refs
  const [sideHighlight, setSideHighlight] = useState({ top: 0, height: 0 });

  useEffect(() => {
    if (tabRefs.current[option]) {
      const { offsetTop, offsetHeight } = tabRefs.current[option];
      setSideHighlight({ top: offsetTop, height: offsetHeight });
    }
  }, [option]);


  return (
    <div className={`transition-all min-h-screen duration-300 w-20 2xl:w-52 hidden sm:flex flex-col gap-2 bg-white dark:bg-[var(--bg-dark)] h-full border-r border-slate-300 dark:border-slate-600`}>
      <div className='h-16 relative flex items-center justify-center px-2'>
        <Link href='/' className='w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600'>
          <span className='text-white font-bold text-2xl'>Q</span>
        </Link>
      </div>
      <ul className='flex flex-col  relative'>
        {/* Sliding vertical highlight */}
        <motion.div
          className="absolute w-full bg-slate-200 dark:bg-slate-800 z-0"
          animate={{
            top: sideHighlight.top,
            height: sideHighlight.height,
          }}
          transition={{ type: "spring", stiffness: 250, damping: 30 }}
        />
        {menuItems.map((item) => (
          <li key={item.key} className={`relative z-10 p-2 py-3 flex cursor-pointer items-center justify-center ${option === item.key ? 'text-gray-800 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
            onClick={() => handleOption(item.key)}
            ref={(el) => (tabRefs.current[item.key] = el)}>
            <button
              className={`text-center h-full transition-all duration-200 flex items-center gap-2`}
            >
              <div className={`flex flex-col items-center justify-center gap-1 overflow-hidden whitespace-nowrap`}>
                {item.icon && <item.icon className="w-5 h-5" />}
                <span className='text-xs 2xl:hidden '>
                  {item.short}
                </span>
                <span className='hidden 2xl:inline text-sm '>
                  {item.label}
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}



const IndiDashboard = ({ resetDash }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const menuItems = [
    { key: "CreateQuiz", label: "Create Quiz", short: "Create", icon: PenLine },
    { key: "YourQuizzes", label: "Your Quizzes", short: "Quizzes", icon: LibraryBig },
    { key: "Analytics", label: "Analytics", short: "Analytics", icon: ChartNoAxesCombined },
  ];

  const [option, setOption] = useState("CreateQuiz");
  const [prevIndex, setPrevIndex] = useState(0);
  const [tabPositions, setTabPositions] = useState({ left: 0, width: 0, height: 0 });

  const handleOption = (selectedOption) => {
    setPrevIndex(currentIndex);
    setOption(selectedOption);
  }

  // Get current tab index
  const currentIndex = menuItems.findIndex((item) => item.key === option);
  const direction = currentIndex > prevIndex ? 70 : -70; // Forward (-) or Backward (+)

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        draggablePercent={60}
        pauseOnHover
        theme="light"
        toastStyle={{ background: "#FF5F1F" }}
      />
      {/* <div className='h-[calc(100vh-53px)] min-h-[620px]  sm:max-h-[calc(100vh-36px)] w-full flex text-neutral-800 bg-white dark:bg-[var(--bg-dark)] dark:text-[#e3e3e3]'> */}
      <div className='h-screen min-h-80 w-full flex text-neutral-800 bg-inherit dark:bg-[var(--bg-dark)] dark:text-[#e3e3e3]'>

        <SideNavbar option={option} handleOption={handleOption} menuItems={menuItems} />

        <div className='h-full w-full flex flex-col'>
          <div className='flex bg-white justify-between items-center border-b border-slate-300 dark:border-slate-600 px-4 py-2 '>
            <div className="title">
              <h2 className='text-xl font-bold font-serif' >Welcome, <span className='text-[#FF4c00]'>{session?.user?.name}</span></h2>
            </div>
            <div className='flex items-center gap-4'>
              <ThemeToggle />
            {session?.user?.user_type?.length === 2 ? (
              <button onClick={() => resetDash()} className='bg-gradient-to-r from-orange-400 to-[#FF5F1F] hover:bg-gradient-to-l h-9 px-4 text-center rounded-md text-gray-50 '>Switch</button>
            ) : (
              <button onClick={() => signOut()} className='bg-[#FF5F1F] hover:bg-[#e64400] h-9 px-4 text-center rounded-md text-gray-50 '>Logout</button>
            )}
            </div>
          </div>
          <div className="menu-section will-change-auto p-6 py-8 dark:bg-[var(--bg-dark)] bg-inherit  overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={option}
                initial={{ opacity: 0, x: direction }}
                animate={{ opacity: 1, x: 0 }}
                // exit={{ opacity: 0}}
                transition={{ duration: 0.4 }}
                className="w-full h-inherit"
              >
                <Suspense fallback={<Loading />} >
                  {option === 'CreateQuiz' ?
                    <CreateQuiz /> : option == 'YourQuizzes' ? <YourQuizes /> : option == 'Analytics' ? <QuizAnalytics /> : "errorrr"
                  }
                </Suspense>
                {/* dark:bg-[#212121] */}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

export default IndiDashboard
