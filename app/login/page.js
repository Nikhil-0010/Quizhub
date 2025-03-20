"use client"
import React, { use, useState } from 'react'
import Link from 'next/link';
import { authenticateUser, fetchUser } from '@/actions/useractions.js';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signIn } from 'next-auth/react';


const Login = () => {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await signIn("credentials", {
            email: form.email, password: form.password, redirect: false,
        });
        // console.log(res);

        if (!res.error) {
            router.replace("/dashboard");
        }
        else {
            toast.error(res.error, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
        setLoading(false);
    }

    const handleGuest = async (e) =>{
        e.preventDefault();
        setLoading(true);
        const res = await signIn("credentials", {
            email: "guest@gmail.com",
            password: "guestpassword123",
            redirect: false,
        });
        if (!res.error) {
            router.replace("/dashboard");
        }
        else {
            toast.error("Error logging as Guest", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
        }
        setLoading(false);
    }

    // console.log(e);
    // let u = await fetchUser(form.email);
    // console.log(u);
    // if(u){
    //     let res = await authenticateUser(u, form);
    //     console.log(res);
    //     if(!res.error) router.push("/dashboard");
    //     else{
    //         toast.error(res.error, {
    //             position: "top-right",
    //             autoClose: 3000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "light",
    //             transition: Bounce,
    //           });
    //     }
    // }
    // else{
    //     toast.error(u.error, {
    //         position: "top-right",
    //         autoClose: 3000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "light",
    //         transition: Bounce,
    //       });
    // console.log(form);
    // setForm({});
// }


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
            // toastStyle={{background:"white", color: "#FF5F1F"}}
            // progressStyle={{background: "#FF5F1F"}}
            
        />
        <div className='flex justify-center items-center h-full min-h-screen bg-slate-100 dark:bg-[var(--bg-dark)] text-neutral-800 dark:text-[#e3e3e3]'>
            <div className='lg:w-2/3 2xl:max-w-[60%] min-w-[50%] flex my-[4%] flex-col-reverse lg:flex-row bg-[#FF5F1F] shadow-lg dark:shadow-neutral-900 shadow-slate-400  rounded '>
                <div className="lg:w-1/2 border border-neutral-300 dark:border-neutral-600 w-full bg-slate-100 dark:bg-neutral-900 rounded flex flex-col items-center rounded-tl-3xl lg:rounded-tl rounded-tr-3xl lg:rounded-br-3xl gap-4 p-8 lg:p-10 md:px-12">
                    <h2 className='text-3xl font-bold'><span className='text-[#FF4c00]'>L</span>ogin</h2>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
                        <div>
                            <label htmlFor="email" className='block mb-1' >Email</label>
                            <input onChange={handleChange} id='email' type="email" name='email' value={form.email ? form.email : ""} className='rounded-md w-full bg-transparent text-sm border-[1.4px]  focus:border-orange-400 outline-none border-gray-400 p-2' placeholder='Enter email' />
                        </div>
                        <div>
                            <label htmlFor="password" className='block mb-1' >Password</label>
                            <input onChange={handleChange} id='password' type="password" name="password" value={form.password ? form.password : ""} className='rounded-md w-full bg-transparent text-sm border-[1.4px]  focus:border-orange-400 outline-none border-gray-400 p-2' placeholder='Enter password' />
                        </div>
                        <div className='self-center w-1/2 flex flex-col gap-[2px] items-center'>
                            <button className='bg-[#FF4c00] hover:bg-[#e64400] w-full h-10 rounded-md text-white font-bold border-[1.4px] border-[#FF5F1F] disabled:bg-opacity-70  disabled:cursor-not-allowed' disabled={loading || !form.email || !form.password }>{loading ? "Loading..." : "Login"}</button>or
                            <div className=''>
                            <button onClick={(e)=>{handleGuest(e)}} className='bg-[#FF4c00] hover:bg-[#e64400] w-fit h-9 px-4 rounded-md text-white font-bold border-[1.4px] border-[#FF5F1F] disabled:bg-opacity-80 disabled:cursor-not-allowed' >Guest</button>
                            <span className='text-xs  block text-center '>(preview)</span>
                            </div>
                        </div>
                        <div className='text-center'>New user? <Link href={"/signup"}><span className='underline text-blue-700 dark:text-blue-500'>Create new account</span></Link></div>
                    </form>
                </div>
                <div className="lg:w-1/2 bg-[#FF5F1F] rounded text-white flex flex-col gap-6 items-center p-10 px-16">
                    <h1 className='text-2xl font-bold bg-slate-100 dark:bg-neutral-900 text-neutral-800 dark:text-inherit w-full rounded-lg text-center border border-neutral-300 dark:border-neutral-600 py-2'><span className='text-[#FF4c00] text-3xl'>L</span>ogin to <br /><span className='text-[#FF4c00] text-3xl'>Q</span>uizhub</h1>
                    <p className='text-lg'>Login to get started</p>
                </div>
            </div>
        </div>
    </>
)
}

export default Login
