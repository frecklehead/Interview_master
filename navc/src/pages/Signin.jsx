import React from 'react'

export default function SignIn() {
  return (
  <div>
    
    <div className="flex justify-center">
      <div className=" bg-gray-100 p-6 max-w-xs md:max-w-md sm:max-w-sm lg:max-w-lg xl:max-w-xl w-full mt-[30px] rounded-lg ">
        <div className=" mb-3 font-serif text-xl">SignIn</div>

        <form>
          


          <div className="mb-3">
            <label className="text-xs text-gray-500"> Email </label>
            <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 p-2 text-xs w-full rounded-lg focus:outline-none"
            />
            </div>
          </div>


          <div className="mb-3">
            <label className="text-xs text-gray-500">Password</label>
            <div>
            <input
              type="password"
              placeholder="Enter your Password"
              className="mt-1 p-2 text-xs w-full rounded-lg focus:outline-none"
            />
            </div>
          </div>


          <button className="mb-1 bg-blue-600 w-full text-white p-1 rounded-lg">
 SignIn
</button>

        </form>
      </div>
    </div>
  </div>
  )
}
