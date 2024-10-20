import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import {toast} from "react-toastify";

export default function SignIn() {
  const[email,setemail]=useState("");
  const[password,setpassword]=useState("");
  const handlesignin= async(e)=>{
    e.preventDefault();
    try {
     await signInWithEmailAndPassword(auth,email,password);
     console.log("signined");
   
    } catch (error) {
      console.log(error.message);
    }

  }

  return (
    <div>
      <div className="flex justify-center">
        <div className=" bg-gray-100 p-6 max-w-xs md:max-w-md sm:max-w-sm lg:max-w-lg xl:max-w-xl w-full mt-[30px] rounded-lg ">
          <div className=" mb-3 font-serif text-xl">SignIn</div>

          <form onSubmit={handlesignin}>
            <div className="mb-3">
              <label className="text-xs text-gray-500"> Email </label>
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="mt-1 p-2 text-xs w-full rounded-lg focus:outline-none"
                  value={email}
                  onChange={(e)=>setemail(e.target.value)}
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
                  value={password}
                  onChange={(e)=>setpassword(e.target.value)}
                />
              </div>
            </div>

            <button className="mb-1 bg-blue-600 w-full text-white p-1 rounded-lg" type="submit">
              SignIn
            </button>
            <p className="text-xs text-gray-600">
              Not Registered Yet?
              <Link
                className=" text-xs text-blue-700 hover:underline"
                to="/register"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
