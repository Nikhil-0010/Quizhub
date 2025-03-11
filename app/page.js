"use client"
import React from "react";
import Link from "next/link";
import * as motion from "motion/react-client";

export default function Home() {
  return (
    <>
      <section id="home" className=" min-h-[calc(100vh-36px)] max-h-screen flex flex-col justify-center items-center text-center relative w-full  dark:bg-gray-800 dark:text-white  bg-slate-100 p-10 overflow-hidden" >
      <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col gap-4 sm:w-3/5"
        >
            <h1 className="font-bold text-5xl text-[#FF5F1F] sm:text-7xl">Quizhub</h1>
            <p className="text-lg dark:text-inherit text-stone-800 md:text-xl 2xl:text-2xl">Create, manage and analyse the quizzes.</p>
          <div className="flex gap-3 justify-center">
            <Link href={'/signup'}>
              <button className="text-white bg-[#FF4c00] hover:bg-[#e64400] slideFlSlow transition-all duration-300  h-10 px-4 md:h-11 md:px-6 xl:text-lg py-2 rounded-lg">Get Started</button>
            </Link>
            {/* <button className="bg-white w-20 h-10 px-4 py-2 rounded-lg">btn2</button> */}
          </div>
        </motion.div>
        <div className="min-h-52 w-52 clip-rightTriangle bg-slate-300 absolute bottom-0 right-0 slide-in-right-fast"></div>
        <div className="min-h-48 w-48 clip-rightTriangle bg-[#FF5F1F] absolute bottom-0 right-0 slide-in-right-slf"></div>
      </section>

{/* Γ£à FEATURES SECTION */}
<section className="bg-white flex justify-center items-center h-screen dark:bg-gray-900 text-gray-900 dark:text-white py-20 px-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl  font-bold text-[#FF5F1F]">Why Choose Quizhub?</h2>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            A powerful platform for educators, students, and individuals.
          </p>
          <div className="grid md:grid-cols-3 gap-10 mt-20">
            {[
              { title: "Easy Quiz Creation", desc: "Create quizzes in minutes with an intuitive interface." },
              { title: "Real-time Analytics", desc: "Track progress and gain insights instantly." },
              { title: "Gamification", desc: "Engage learners with badges, rewards, and leaderboards." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md"
              >
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="h-screen bg-stone-800 dark:border-y dark:border-slate-200 text-white overflow-hidden py-20 px-10 ">
        <div className="flex flex-row-reverse mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, transform: 'translateX(80px)' }}
            whileInView={{ opacity: 1, transform: 'translateX(0)' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }} 
            className="flex flex-col gap-6 lg:w-3/5 2xl:w-2/5 mt-10 sm:pl-10">
            <h1 className="font-bold text-4xl md:text-5xl border-b-4 border-[#fe6d2f] rounded-sm w-fit"><span className="text-[#fe6d2f]">F</span>or the institute</h1>
            <p className="md:text-lg">Manage quizzes for large teams or groups.
              <br />
              Generate aggregated analytics to understand group performance and identify areas for improvement.</p>
          </motion.div>
        </div>
      </section>

      <section className="h-screen text-[#FF5F1F] dark:bg-gray-800 bg-slate-100 bg-white overflow-hidden p-10">
        <div className="flex mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, transform: 'translateX(-80px)' }}
            whileInView={{ opacity: 1, transform: 'translateX(0)'}}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }} 
            className="flex flex-col gap-6 lg:w-3/5 2xl:w-2/5 mt-10 sm:pl-10">
            <h1 className="font-bold text-4xl md:text-5xl border-b-4 border-stone-800 dark:border-[#e3e3e3] rounded-sm w-fit">For the individual</h1>
            <p className="md:text-lg dark:text-[#e3e3e3]">Personalize quizzes for self-learning, practice, or small-scale projects.
              <br />
              Track individual performance through detailed analytics.
               </p>
          </motion.div>
        </div>
      </section>

      {/* ≡ƒÜÇ CTA SECTION */}
      <section className="h-2/5 bg-[#FF5F1F] text-white py-20 px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
          viewport={{ once: true }}
        >
        <h2 className="text-3xl md:text-4xl font-bold">Get Started with Quizhub Today</h2>
        <p className="mt-4 md:text-lg">Sign up now and create your first quiz in minutes.</p>
        <Link href="/signup">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 bg-white text-[#FF5F1F] px-6 py-3 rounded-lg font-bold text-lg hover:bg-gray-200 transition-all duration-75 ease-out"
          >
            Sign Up for Free
          </motion.button>
        </Link>
        </motion.div>
      </section>
    </>
  );
}
