"use client"
import { signOut, useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef, Suspense, lazy } from 'react'
// import CreateQuiz from './CreateQuiz';
// import YourQuizes from './YourQuizes';
// import QuizAnalytics from './QuizAnalytics';
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';
import Loading from '@/components/Loading';
import dynamic from "next/dynamic";
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const YourQuizes = dynamic(() => import("./YourQuizes"), {
  loading: () => <Loading />
});
const QuizAnalytics = dynamic(() => import("./QuizAnalytics"), {
  loading: () => <Loading />
})
const CreateQuiz = lazy(() => import('./CreateQuiz'));

const IndiDashboard = ({ resetDash }) => {
  const { data: session } = useSession();
  const router = useRouter();

  // const [isActive, setIsActive] = useState({
  //   any: true,
  //   menu_CreateQuiz:true,
  //   menu_YourQuizzes:false,
  //   menu_Analytics:false,
  // });

  const menuItems = [
    { key: "CreateQuiz", label: "Create Quiz" },
    { key: "YourQuizzes", label: "Your Quizzes" },
    { key: "Analytics", label: "Analytics" },
  ];

  const [option, setOption] = useState("CreateQuiz");
  const [prevIndex, setPrevIndex] = useState(0);
  const tabRefs = useRef({}); // Store tab refs
  const [tabPositions, setTabPositions] = useState({ left: 0, width: 0, height: 0 });

  useEffect(() => {
    if (tabRefs.current[option]) {
      const { offsetLeft, offsetWidth, offsetHeight } = tabRefs.current[option];
      setTabPositions({ left: offsetLeft, width: offsetWidth, height: offsetHeight });
    }
  }, [option]);

  // const handleIsActive = (target) =>{
  //   isActive.any = true;
  //   console.log(isActive.any)
  //   // if(isActive)
  //   // setIsActive({...isActive, [target]:true});
  // }

  // const handleOption = (target) =>{
  //   const[_,option] = target.split("_");
  //   // console.log(option);
  //   // set previously active option to false
  //   // Object.entries(isActive).forEach(([key, value])=>{
  //   //   if(key!='any' && key!=target  && value===true){
  //   //     isActive[key] = false;
  //   //   }
  //   // })
  //   // //set clicked option to true
  //   // setIsActive({...isActive, [target]:true});

  //   setOption(option);
  // }

  // Get current tab index
  const currentIndex = menuItems.findIndex((item) => item.key === option);
  const direction = currentIndex > prevIndex ? 70 : -70; // Forward (-) or Backward (+)

  const handleOption = (selectedOption) => {
    setPrevIndex(currentIndex);
    setOption(selectedOption);
  }

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
        pauseOnHover
        theme="light"
        toastStyle={{ background: "#FF5F1F" }}
      />
      <div className='h-[calc(100vh-53px)]  sm:max-h-[calc(100vh-36px)] w-full flex text-neutral-800 bg-white dark:bg-[var(--bg-dark)] dark:text-[#e3e3e3]'>
        {/* main container */}
        <div className='h-full w-full flex flex-col'>
          <div className='h-16 flex justify-between items-center border-b-2 border-zinc-300 dark:border-neutral-700 px-4 '>
            <div className="title">
              <h2 className='sm:text-3xl text-xl font-bold font-serif' >Welcome, <span className='text-[#FF4c00]'>{session?.user?.name}</span></h2>
            </div>
            
            {session?.user?.user_type?.length === 2? (
              <button onClick={()=>resetDash()} className='bg-[#FF5F1F] hover:bg-[#e64400] w-20 h-9 px-2 rounded-lg text-gray-50 '>Switch</button>
            ):(
              <button onClick={() => signOut()} className='bg-[#FF5F1F] hover:bg-[#e64400] w-20 h-9 px-2 rounded-lg text-gray-50 '>Logout</button>
            )}
          </div>
          <div className="main-section h-[calc(91.3vh-64px)] ">
            <div className={`menu relative h-12 flex bg-[#FF5F1F] text-white p-3 pb-0 border-b-2 border-zinc-50 dark:border-zinc-800 gap-2 sm:gap-4`}>
              <motion.div
                className="absolute bottom-0 left-0 bg-white  dark:bg-[var(--bg-dark)] rounded-t-lg shadow-md"
                animate={{
                  left: tabPositions.left,
                  width: tabPositions.width,
                  height: tabPositions.height,
                }}
                transition={{ type: "spring", stiffness: 250, damping: 30 }}
              />
              {menuItems.map((tab) => (
                <div key={tab.key} ref={(el) => (tabRefs.current[tab.key] = el)}><button onClick={() => handleOption(tab.key)} className={`menu_CreateQuiz relative z-10  transition-colors delay-75  ${option == tab.key ? "  text-[#ff5f1f]  " : "text-white"}   rounded-t-lg p-1 px-2 sm:px-3`}>{tab.label}</button></div>
              ))}
              {/* <div><button onClick={()=>handleOption("menu_YourQuizzes")} className={`menu_YourQuizzes  border-2  ${isActive.menu_YourQuizzes?"border-[#FF5F1F] bg-white dark:bg-[var(--bg-dark)] text-[#ff5f1f] border-b-[3.3px] border-b-white": "border-transparent"} dark:border-transparent  rounded-t-lg p-1 px-2 sm:px-3`}>Your Quizzes</button></div>
              <div><button onClick={()=>handleOption("menu_Analytics")} className={`menu_Analytics  border-2  ${isActive.menu_Analytics?"border-[#FF5F1F] bg-white dark:bg-[var(--bg-dark)] text-[#ff5f1f] border-b-[3.3px] border-b-white": "border-transparent"} dark:border-transparent  rounded-t-lg p-1 px-2 sm:px-3`}>Analytics</button></div> */}
            </div>
            <div className="menu-section will-change-auto py-6 dark:bg-[var(--bg-dark)] bg-white px-5 sm:px-8 md:px-10 h-[calc(calc(91.3vh-64px)-48px)] overflow-auto">
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
      </div>
    </>
  )
}

export default IndiDashboard
