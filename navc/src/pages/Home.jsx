
import React from "react";
import {auth } from "../firebase";
import { useState,useEffect } from "react";
import Createsignin from "../components/createsignin";
export default function Home() {
  const [user,setuser]=useState();
  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      setuser(user);
    })
  },[]);
  const signinacc=()=>{
    window.location.href="/signin";
  }
  const createacc=()=>{
    window.location.href="/signin";
  }
  return (
    <div className="p-8"> 
      <div class="bg-white bg-opacity-100 p-8 rounded-lg shadow-lg max-w-lg mx-auto ">
        <h2 class="text-6xl font-bold text-blue-900 mb-2">
          Ace your <span class="text-pink-500">Interviews</span>
        </h2>
        <p class="text-gray-800 max-w-md mx-auto">
          With Prepify, an interactive interview preparation platform.
        </p>
      </div>
{user?<div class="mt-12 flex justify-center space-x-4"></div> :<Createsignin/>}
      
    </div>
  );
}
