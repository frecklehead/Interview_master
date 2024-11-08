import Header from "./components/header";
import { Route, Routes,Navigate } from "react-router-dom";

import Home from "./pages/Home";

import SignIn from "./pages/Signin";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import AI_Sessions from "./pages/AI_Sessions";
import InterviewRoom from "./pages/InterviewRoom";
import InterviewBot from "./pages/InterviewBot";
function App() {
  const [user,setuser]=useState();
  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      setuser(user);
    })
  },[])
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home/>}></Route>
        {/* <Route path="/" element={ user ?<Navigate to="/profile" /> : <Home />}></Route> */}
        <Route path="/interview" element={<InterviewRoom/>}></Route>
        <Route path="/aisessions" element={<AI_Sessions/>}></Route>

        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/practice" element={<InterviewBot />}></Route>
      </Routes>
    </>
  );
}

export default App;
