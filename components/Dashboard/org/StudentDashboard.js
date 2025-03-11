import React from 'react'
import ComingSoon from '@/components/ComingSoon';

const StudentDashboard = ({resetDash}) => {

  //coming soon
      return (
          <>
          <ComingSoon />
          <button onClick={resetDash} className='absolute top-[60%] left-[46%] bg-[#FF4c00] hover:bg-[#e64400] px-4 md:px-6 py-2 md:py-2 rounded text-white ' >Go back</button>
          </>
      )

  return (
    <div>Student Dashboard</div>
  )
}

export default StudentDashboard
