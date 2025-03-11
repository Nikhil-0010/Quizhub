"use client"
import React, { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { fetchUser, fetchOrg } from '@/actions/useractions.js';
import ComingSoon from '@/components/ComingSoon';

const AdminDashboard = ({ resetDash }) => {

    //coming soon
    return (
        <>
            <ComingSoon />
            <button onClick={resetDash} className='absolute top-[60%] left-[46%] bg-[#FF4c00] hover:bg-[#e64400] px-4 md:px-6 py-2 md:py-2 rounded text-white ' >Go back</button>
        </>
    )

    const { data: session } = useSession();
    const [user, setUser] = useState();
    const [org, setOrg] = useState();
    const [isOpen, setIsOpen] = useState(false);
    // console.log(resetDash)

    useEffect(() => {
        if (!session?.user?.email) return;
        const getUser = async () => {
            let user = await fetchUser(session.user.email);
            setUser(user);
            let { data: org } = await fetchOrg(user.organization);
            setOrg(org);
        }
        getUser();
    }, [session])

    // console.log(user, session, org);

    return (
        <>
            <div className='w-full relative min-h-[90.7vh] max-h-full flex overflow-hidden flex-shrink-0'>
                <div className={`menu h-[90.7vh] relative z-[5] bg-white dark:bg-neutral-900 border transition-all duration-500 overflow-hidden  p-3 ${isOpen ? "w-[20%]" : "w-[7%]"} `}>
                    <button onClick={() => setIsOpen(!isOpen)} className='absolute right-1'>{isOpen ? "ΓåÉ" : "ΓåÆ"}</button>
                    {isOpen && <>
                        Admin Dashboard
                        <br />{session?.user?.name}
                        <button onClick={resetDash} className='bg-[#FF4c00] hover:bg-[#e64400] px-2 py-1 rounded text-white ' >Go back</button></>}
                </div>
                <div className={`main relative min-h-inherit p-4 pb-0 w-full flex flex-col gap-4 transition-all duration-500 `}>
                    <div className='w-full rounded-lg p-2 px-6 bg-white'>
                        <h2 className='font-bold text-2xl text-[#FF4c00]'>{org?.name}</h2>
                        <h5 className='text-gray-500 mt-2'>{org?.description}</h5>
                        <p className='text-sm' >Admins: {org?.admins?.length}{"    "}|{"   "} Students:{org?.students?.length}  </p>
                    </div>
                    <div className="w-full h-full bg-white p-2 px-6 rounded-t-lg">aa</div>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard
