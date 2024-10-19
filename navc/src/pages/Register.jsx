import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

export default function Register() {
  const [fname,setfname]=useState("");
  const [lname,setlname]=useState("");
  const [email,setemail]=useState("");
  const [password,setpassword]=useState("");

const handleRegister = async (e)=>{
  e.preventDefault();
  try {
     await createUserWithEmailAndPassword(auth,email,password);
     const user =auth.currentUser;
     console.log(user);
     console.log("user registered ");


  } catch (error) {
    console.log(error.message)
  }

}


  return (



    // creating a register card
    <div className="flex justify-center">
      <div className=" bg-gray-100 p-6 max-w-xs md:max-w-md sm:max-w-sm lg:max-w-lg xl:max-w-xl w-full mt-[30px] rounded-lg ">
        <div className=" mb-3 font-serif text-xl">Register</div>

        <form>
          {/* firstname */}
          <div className="mb-3">
            <label className="text-xs text-gray-500"> First Name </label>
            <div>
            <input
              type="text"
              placeholder="Enter your First Name"
              className="mt-1 p-2 text-xs w-full rounded-lg focus:outline-none"
              onChange={(e)=> setfname(e.target.value)}
            />
            </div>
          </div>

{/* lastname */}
          <div className="mb-3">
            <label className="text-xs text-gray-500"> Last Name </label>
            <div>
            <input
              type="text"
              placeholder="Enter your Last Name"
              className="mt-1 p-2 text-xs w-full rounded-lg focus:outline-none"
              onChange={(e)=> setlname(e.target.value)}
            />
            </div>
          </div>


          <div className="mb-3">
            <label className="text-xs text-gray-500"> Email </label>
            <div>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 p-2 text-xs w-full rounded-lg focus:outline-none"
              onChange={(e)=> setemail(e.target.value)}
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
              onChange={(e)=> setpassword(e.target.value)}
            />
            </div>
          </div>


<button  onClick={handleRegister} className="mb-1 bg-blue-600 w-full text-white p-1 rounded-lg">
  Register
</button>
<p className="text-xs text-gray-600">Already have a account? <Link  className=" text-xs text-blue-700 hover:underline"to='/signin'>Login</Link></p>

        </form>
      </div>
    </div>
  );
}
