"use client"
import { registerUser } from '@/actions/useractions.js';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Regindi = () => {
  const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm();
  const router = useRouter();
  // const searchParams = useSearchParams();

  // console.log(searchParams.get("regType"));

  const onSubmit = async (data) => {
    // data.regType= searchParams.get("regType");
    data.regType = "Individual";
    // console.log(data);
    let u = await registerUser(data);
    // console.log(u);
    if (u.status==true) {
      toast.success(u.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      })
      toast('Please Login.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setTimeout(() => {
        router.push("/login");
      }, 3500);
    }
    else {
      toast.error(u.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      })
    }
  }

  const password = watch('password');

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
      />
      {/* Same as */}
      {/* <ToastContainer /> */}

      <div className='bg-slate-100 dark:bg-[var(--bg-dark)] p-6 sm:p-10 w-full min-h-[100vh] max-h-[100vmax] text-neutral-800 dark:text-[#e3e3e3] flex flex-col'>
        <div className="title border-b-2 rounded border-zinc-300 dark:border-neutral-600 ">
          <div className='flex justify-between items-center'>
            <div>
              <h1 className="text-3xl font-bold"><span className='text-[#FF4c00]'>S</span>ign Up</h1>
              <p>as <span className='text-[#FF4c00] font-bold'>Individual</span></p>
            </div>
            <button onClick={() => router.back()} className='bg-[#FF4c00] hover:bg-[#e64400] text-white rounded-md w-25 h-9 px-2'>Go back</button>
          </div>
          <hr className='dark:border-neutral-600' />
        </div>
        <div className='w-full h-full flex gap-6 lg:gap-28 justify-start' >
          <form action={handleSubmit(onSubmit)} className='mt-5 md:w-1/2 w-full flex flex-col gap-4 items-center px-2 pl-0 sm:px-5'>
            <div className='w-full'>
              <label className='block mb-1' htmlFor="name">Full Name</label>
              <input className='rounded-lg dark:border-neutral-700 bg-transparent text-sm w-full border-[1.4px]  hover:border-orange-400 dark:hover:border-orange-500 outline-none border-gray-400 p-2' type="text" {...register("name", { required: { value: true, message: 'Field is required' } })} id='name' placeholder='Your full name' />
              {errors.name && <p className='text-red-500 ml-2'>{`${errors.name.message}`}</p>}
            </div>
            <div className='w-full'>
              <label className='block mb-1' htmlFor="email">Email address</label>
              <input className='rounded-lg dark:border-neutral-700 bg-transparent text-sm w-full border-[1.4px]  hover:border-orange-400 dark:hover:border-orange-500 outline-none border-gray-400 p-2' type="email" {...register("email", { required: { value: true, message: 'Field is required' } })} id='email' placeholder='Enter your email address' />
              {errors.email && <p className='text-red-500 ml-2'>{`${errors.email.message}`}</p>}
            </div>
            <div className='w-full'>
              <label className='block mb-1' htmlFor="phone">Phone</label>
              <input className='rounded-lg dark:border-neutral-700 bg-transparent text-sm w-full border-[1.4px]  hover:border-orange-400 dark:hover:border-orange-500 outline-none border-gray-400 p-2' type="number" {...register("phone", {
                validate: (value) =>
                  (value.length == 10 || value.length == 0) || "Invalid phone no",
              })} id='phone' placeholder='Enter your phone no' />
              {errors.phone && <p className='text-red-500 ml-2'>{`${errors.phone.message}`}</p>}
            </div>
            <div className='w-full flex sm:flex-row flex-col gap-4 justify-between'>
              <div className='w-full'>
                <label className='block mb-1' htmlFor="password">Password</label>
                <input className='rounded-lg dark:border-neutral-700 bg-transparent text-sm w-full border-[1.4px]  hover:border-orange-400 dark:hover:border-orange-500 outline-none border-gray-400 p-2' type="password" {...register("password", { required: { value: true, message: 'Field is required' }, minLength: { value: 8, message: "Password should contain at least 8 characters." }, maxLength: { value: 12, message: "Password should not contain more than 12 characters." } })} id='password' placeholder='Enter password' />
                {errors.password && <p className='text-red-500 ml-2'>{`${errors.password.message}`}</p>}
              </div>
              <div className='w-full'>
                <label className='block mb-1' htmlFor="confirmPassword">Confirm Password</label>
                <input className='rounded-lg dark:border-neutral-700 bg-transparent text-sm w-full border-[1.4px]  hover:border-orange-400 dark:hover:border-orange-500 outline-none border-gray-400 p-2' type="text" {...register("confirmPassword", {
                  required: { value: true, message: 'Field is required' }, validate: (value) =>
                    value === password || "The passwords do not match",
                })} id='confirmPassword' placeholder='Re enter password' />
                {errors.confirmPassword && <p className='text-red-500 ml-2'>{`${errors.confirmPassword.message}`}</p>}
              </div>
            </div>
            <div className='w-full'>
              <button disabled={isSubmitting} className='bg-[#FF4c00] text-lg w-full h-10 rounded-lg text-white font-bold border-[1.4px] border-[#FF5F1F]'>{isSubmitting ? "Submitting..." : "Submit"} </button>
            </div>
          </form>
          <div className='hidden md:w-1/2 md:flex items-start text-white justify-center pt-12  pr-5 lg:pr-16 
          '>
            <div className='bg-[#FF5F1F] w-full min-h-[40%] rounded-lg'>sdasad</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Regindi
