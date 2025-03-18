import React from 'react'

const ComingSoon = ({button}) => {
  return (
    <div className=" h-svh w-full flex flex-col items-center justify-center gap-2 md:gap-4 px-2">
      <span className="text-xl md:text-2xl">This page will be available soon  😊 </span>
      {button && <button onClick={button.fn} className='bg-[#FF4c00] hover:bg-[#e64400] px-4 md:px-6 py-2 md:py-2 rounded-lg text-white' >{button.text}</button>}
    </div>
  )
}

export default ComingSoon
