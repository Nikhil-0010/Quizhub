"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { addOrgUser, isValidOrg, registerOrg } from '@/actions/useractions.js';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Regorg = () => {

    const router = useRouter();

    const [orgtype, setOrgtype] = useState("");
    const [orgChoice, setOrgChoice] = useState("");
    const [orgName, setOrgName] = useState("");
    const [userType, setUserType] = useState("");
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({});
    const [isReg, setIsReg] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!userType) newErrors.userType = "Please select a user type.";
        if (!form.desc?.trim()) newErrors.desc = "Description is required.";
        if (!form.email?.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Please enter a valid email.";
        if (!isReg) {
            if (!form.name?.trim()) newErrors.name = "Name is required.";
            if (!form.phone?.trim().length == 0 && form.phone?.length < 10) newErrors.phone = "Please enter a valid phone number.";
            if (!form.password?.trim() || form.password?.length < 8) newErrors.password = "Minimum 8 characters required.";
            if (!form.confirmPassword || form.password?.trim() !== form.confirmPassword?.trim()) newErrors.confirmPassword = "Passwords do not match.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleOrgRadio = (e) => {
        setOrgChoice(e.target.value);
    }
    const handleUserInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setIsReg(checked);
            //clear all form except desc
            setForm((prev) => ({ desc: prev.desc }));
            setErrors({});
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
        // Dynamic validation for the specific field
        switch (name) {
            case "desc":
                if (!value.trim()) {
                    setErrors((prev) => ({ ...prev, desc: "Description is required." }));
                } else if (value.length === 300) {
                    setErrors((prev) => ({ ...prev, desc: "Description cannot be more than 300 letters. " }));
                }
                else {
                    setErrors((prev) => ({ ...prev, desc: "" }));
                }
            case "name":
                if (!value.trim()) {
                    setErrors((prev) => ({ ...prev, name: "Name is required." }));
                } else {
                    setErrors((prev) => ({ ...prev, name: "" }));
                }
                break;

            case "email":
                if (!value.trim() || !/\S+@\S+\.\S+/.test(value)) {
                    setErrors((prev) => ({ ...prev, email: "Please enter a valid email." }));
                } else {
                    setErrors((prev) => ({ ...prev, email: "" }));
                }
                break;

            case "phone":
                if (!value.trim().length == 0 && value.length < 10) {
                    setErrors((prev) => ({ ...prev, phone: "Please enter a valid phone number." }));
                } else {
                    setErrors((prev) => ({ ...prev, phone: "" }));
                }
                break;

            case "password":
                if (!value.trim() || value.length < 8) {
                    setErrors((prev) => ({ ...prev, password: "Password must be at least 8 characters." }));
                } else {
                    setErrors((prev) => ({ ...prev, password: "" }));
                }
                break;

            case "confirmPassword":
                if (!value.trim() || value !== form.password) {
                    setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
                } else {
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }
                break;

            default:
                break;
        }
    }

    const handleUserType = (e) => {
        setUserType(e.target.value);
    }

    const handleOrgNameInput = (e) => {
        setOrgName(e.target.value);
        if (e.target.value.trim().length == 0) {
            setErrors((prev) => ({ ...prev, orgName: "Please provide an organization name." }));
        }
        else if (e.target.value.trim().length > 0) {
            setErrors((prev) => ({ ...prev, orgName: "" }));
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // console.log(form, orgName, orgChoice, userType);
        if (validateForm()) {

            //prepare data for submission
            if (orgtype === 'New') {
                const orgData = {
                    name: orgName,
                    description: form.desc,
                }
                const userData = {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    password: form.password,
                    userType: userType,
                    isReg: isReg,
                    regType: "Organization"
                }
                console.log(orgData, userData);

                // register organisation
                let res = await registerOrg(orgData, userData);
                console.log(res);
                if (res.status == false) {
                    toast.error(res.message || res.error, {
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
                else if(res.status == true){
                    toast.success(res.message, {
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
            else if (orgtype === 'Existing') {
                const userData = {
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    password: form.password,
                    userType: userType,
                    isReg: isReg,
                    regType: "Organization"
                }
                console.log(userData);
                // register user
                let res = await addOrgUser(orgName, userData);
                console.log(res);
                if (res.status == false) {
                    toast.error(res.message || res.error, {
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
                else if(res.status == true){
                    toast.success(res.message, {
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
        }

    }

    const handleOrgSubmit = async (e) => {
        e.preventDefault();
        // Inline validation for orgName
        if (orgName.trim().length === 0) {
            setErrors((prev) => ({ ...prev, orgName: "Please provide an organization name." }));
            return;
        }
        // Clear any lingering errors if validation passes
        setErrors((prev) => ({ ...prev, orgName: "" }));
        let res = await isValidOrg(orgName, orgChoice);
        console.log(orgChoice, res);
        if (res.status == true) {
            setOrgtype(orgChoice);
        }
        else if (res.status == false) {
            setErrors((prev) => ({ ...prev, orgName: res.message }));
        }
        else {
            setErrors((prev) => ({ ...prev, orgName: res.error }));
        }
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
              />
            <div className='bg-slate-100 dark:bg-[var(--bg-dark)] p-6 sm:p-10 w-full min-h-[100vh] max-h-[100%] flex flex-col text-neutral-800 dark:text-[#e3e3e3]'>
                <div className="title border-b-2 rounded border-zinc-300 dark:border-neutral-600">
                    <div className='flex justify-between items-center'>
                        <div>
                            <h1 className="text-3xl font-bold"><span className='text-[#FF4c00]'>S</span>ign Up</h1>
                            <p>in / as <span className='text-[#FF4c00] font-bold'>Organization</span></p>
                        </div>
                        <button onClick={() => { setOrgtype(""); setErrors(""); setIsReg(false); }} className='bg-[#FF4c00] hover:bg-[#e64400] text-white rounded-md w-25 h-9 px-2 hover:bg-opacity-90'>Go back</button>
                    </div>
                    <hr className='dark:border-neutral-600' />
                </div>

                {orgtype.length == 0 &&
                    <div className='flex mt-16 justify-center  items-center h-full'>
                        <div className="bg-white dark:border dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-neutral-900 shadow-lg rounded-xl p-8 w-full max-w-md">
                            <h3 className="text-2xl font-bold text-center text-[#FF5F1F] mb-4">Choose Organization</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                                Select one of the option.
                            </p>
                            <form className="flex flex-col gap-4" onSubmit={handleOrgSubmit}>
                                <div className='flex justify-around items-center'>
                                    <div className='flex gap-2 items-center'>
                                        <input onChange={handleOrgRadio} type="radio" name="orgChoice" value='New' id="newOrg" />
                                        <label htmlFor="newOrg" className='cursor-pointer'>Create new</label>
                                    </div>
                                    <div className='flex gap-2 items-center'>
                                        <input onChange={handleOrgRadio} type="radio" name="orgChoice" value='Existing' id="existingOrg" />
                                        <label htmlFor="existingOrg" className='cursor-pointer'>Existing</label>
                                    </div>
                                </div>
                                {orgChoice &&
                                    <div className='flex flex-col gap-4 w-[80%] mx-auto'>
                                        <input
                                            type="text"
                                            onChange={handleOrgNameInput}
                                            placeholder={orgChoice === 'New' ? "New organization name" : "Existing organization name"}
                                            className="border-b-[1.4px] border-gray-300 dark:border-neutral-700 bg-transparent text-sm rounded-t-lg px-2 py-1  dark:focus:border-[#fd8454] focus:border-[#ff956b] outline-none"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-[#FF5F1F] bg-opacity-90 text-white py-2 rounded-lg hover:bg-opacity-100 transition shadow-md disabled:opacity-70"
                                            disabled={orgName.trim().length === 0}
                                        >
                                            Submit
                                        </button>
                                        {errors.orgName && <p className="text-red-500 text-sm mt-2">{errors.orgName}</p>}
                                    </div>
                                }
                            </form>
                        </div>
                    </div>}

                {orgtype.length > 0 &&
                    <div className='w-full md:w-[70%] 2xl:max-w-[50%] md:mx-auto'>
                        <form onSubmit={handleFormSubmit} className='mt-5 shadow-md bg-gray-100 dark:bg-neutral-800  dark:shadow-zinc-900 border border-gray-300 dark:border-neutral-700 rounded px-4 py-6 md:px-8 flex flex-col gap-6'>
                            {/* Organization details */}
                            <div id='org' className='org'>
                                <label htmlFor="org" className='block mb-1 font-semibold'>Organization details</label>
                                <div className='flex flex-col gap-3 text-sm opacity-65 ml-4 '>
                                    {orgChoice === 'New' ? <>
                                        <div className='flex gap-6 items-center'>
                                            <div className='flex gap-2 items-center'>
                                                <input type="radio" name="orgChoice" defaultChecked={orgChoice === 'New'} readOnly value='New' id="newOrg" className='cursor-not-allowed' />
                                                <label htmlFor="newOrg" className='cursor-not-allowed'>Create new</label>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <label htmlFor="orgname">Name: </label>
                                                <input type="text" name='orgname' value={orgName} readOnly className='border-b-[1.4px] border-gray-400 dark:border-neutral-700 bg-transparent text-sm opacity-65 w-full px-2 cursor-not-allowed outline-none' />
                                            </div>
                                        </div>
                                        <div className=''>
                                            <label htmlFor="desc" className='block mb-1' >Description</label>
                                            <textarea onChange={handleUserInputChange} name='desc' rows={4} maxLength={300} className='rounded dark:border-neutral-700 bg-transparent text-sm w-full border-[1.4px] hover:border-orange-400 dark:hover:border-orange-500 outline-none border-gray-400 py-1 px-2' placeholder='Tell about organization...' value={form.desc ? form.desc : ""} />
                                            {errors.desc && <p className="text-red-500 text-sm mt-2">{errors.desc}</p>}
                                        </div>
                                    </>
                                        : orgChoice === 'Existing' &&
                                        <div className='flex gap-6 items-center'>
                                            <div className='flex gap-2 items-center'>
                                                <input type="radio" name="orgChoice" defaultChecked={orgChoice === 'Existing'} readOnly value='Existing' id="existingOrg" />
                                                <label htmlFor="existingOrg" className='cursor-pointer'>Existing</label>
                                            </div>
                                            <div className='flex gap-2 items-center'>
                                                <label htmlFor="orgname">Name: </label>
                                                <input type="text" name='orgname' value={orgName} readOnly className='border-b-[1.4px] border-gray-400 dark:border-neutral-700 bg-transparent text-sm opacity-65 px-2 w-full cursor-not-allowed outline-none' />
                                            </div>
                                        </div>
                                    }

                                </div>
                            </div>
                            {/* User details */}
                            <div className='flex flex-col gap-1' id='user'>
                                <label htmlFor="user" className='font-semibold'>User details</label>
                                <div className='user-input flex flex-col gap-3 text-sm ml-4'>
                                    {/* User type */}
                                    <fieldset className='flex flex-col gap-2 border border-gray-400 p-4 rounded mt-4 dark:border-neutral-600'>
                                        <legend className="">User Type</legend>
                                        <div className='userType flex items-center gap-6'>
                                            <div className='flex gap-2 items-center'>
                                                <input type="radio" onChange={handleUserType} name="userType" value='admin' className='cursor-pointer' id="admin" />
                                                <label htmlFor="admin" className='cursor-pointer'>Admin</label>
                                            </div>
                                            {orgtype !== 'New' &&
                                                <div className='flex gap-2 items-center'>
                                                    <input type="radio" onChange={handleUserType} name="userType" value='student' className='cursor-pointer' id="student" />
                                                    <label htmlFor="student" className='cursor-pointer'>Student</label>
                                                </div>
                                            }

                                        </div>
                                        {userType === 'Admin' ?
                                            <div className='text-gray-500  dark:text-gray-400 ml-4'>
                                                <ul>
                                                    <li>Admin can collaborately create, manage quizzes.</li>
                                                    <li>Admin has  </li>
                                                </ul>
                                            </div> : userType === 'Student' ?
                                                <div className='text-gray-500 dark:text-gray-400 ml-4'>
                                                    <ul>
                                                        <li>Student can attempt quizzes from various subjects.</li>
                                                        <li>And view their performance.</li>
                                                    </ul>
                                                </div> : null}
                                        {errors.userType && <p className="text-red-500 text-sm mt-2">{errors.userType}</p>}
                                    </fieldset>
                                    <div className='flex items-center gap-3 mb-1'>
                                        <label htmlFor="" className='' >Are you registered as Individual ?</label>
                                        <input onChange={handleUserInputChange} type="checkbox" name='isReg' />
                                    </div>
                                    {isReg === true ?
                                        <div className=''>
                                            <label htmlFor="email" className='block mb-1' >Email</label>
                                            <input onChange={handleUserInputChange} type="email" name='email' className='rounded dark:border-neutral-700 bg-transparent text-sm w-full border-[1.4px] hover:border-orange-400 dark:hover:border-orange-500   outline-none border-gray-400 py-1 px-2' placeholder='user@gmail.com' value={form.email ? form.email : ""} />
                                            {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                                        </div>
                                        :
                                        <>
                                            <div className=''>
                                                <label htmlFor="name" className='block mb-1' >Name</label>
                                                <input onChange={handleUserInputChange} type="text" name='name' className='rounded dark:border-neutral-700 bg-transparent text-sm w-full border-[1.4px] hover:border-orange-400 dark:hover:border-orange-500 outline-none border-gray-400 py-1 px-2' placeholder='Name' value={form.name ? form.name : ""} />
                                                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                                            </div>
                                            <div className=''>
                                                <label htmlFor="email" className='block mb-1' >Email</label>
                                                <input onChange={handleUserInputChange} type="email" name='email' className='rounded dark:border-neutral-700 bg-transparent text-sm w-full border-[1.4px] hover:border-orange-400 dark:hover:border-orange-500   outline-none border-gray-400 py-1 px-2' placeholder='user@gmail.com' value={form.email ? form.email : ""} />
                                                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                                            </div>
                                            <div className=''>
                                                <label htmlFor="phone" className='block mb-1'>Phone No</label>
                                                <input onChange={handleUserInputChange} type="number" name='phone' className='rounded dark:border-neutral-700 bg-transparent text-sm w-full border-[1.4px] hover:border-orange-400 dark:hover:border-orange-500  outline-none border-gray-400 py-1 px-2' placeholder='Phone No' value={form.phone ? form.phone : ""} />
                                                {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
                                            </div>
                                            <div className=''>
                                                <label htmlFor="password" className='block mb-1'>Password</label>
                                                <input onChange={handleUserInputChange} type="password" name='password' className='rounded dark:border-neutral-700 bg-transparent text-sm w-full border-[1.4px] hover:border-orange-400 dark:hover:border-orange-500  outline-none border-gray-400 py-1 px-2' placeholder='Password' value={form.password ? form.password : ""} />
                                                {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
                                            </div>
                                            <div className=''>
                                                <label htmlFor="confirmPassword" className='block mb-1'>Confirm Password</label>
                                                <input onChange={handleUserInputChange} type="text" name='confirmPassword' className='rounded dark:border-neutral-700 bg-transparent text-sm w-full border-[1.4px] hover:border-orange-400 dark:hover:border-orange-500  outline-none border-gray-400 py-1 px-2' placeholder='Confirm Password' value={form.confirmPassword ? form.confirmPassword : ""} />
                                                {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>}
                                            </div>
                                        </>}
                                </div>
                            </div>
                            <div className='flex justify-center'>
                                <button className='w-full bg-[#FF5F1F] text-white py-2 px-4 rounded-lg hover:bg-[#FF4c00] transition'>Submit</button>
                            </div>
                        </form>
                    </div>
                }

            </div>
        </>
    )
}

export default Regorg
