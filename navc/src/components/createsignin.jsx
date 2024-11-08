import React from 'react'

export default function Createsignin() {
  const signinacc=()=>{
    window.location.href="/signin";
  }
  const createacc=()=>{
    window.location.href="/register";
  }
  return (
    <div>
      <div class="mt-12 flex justify-center space-x-4">
        <button onClick={createacc}
          
          class="bg-white text-pink-700 font-semibold py-2 px-4 border border-pink-700 rounded hover:bg-pink-700 hover:text-white"
        >
          Create an Account
        </button>
        <button
          onClick={signinacc}
          class="bg-white text-pink-700 font-semibold py-2 px-4 border border-pink-700 rounded hover:bg-pink-700 hover:text-white"
        >
          Already have an account?
        </button>

      </div>
    </div>
  )
}
