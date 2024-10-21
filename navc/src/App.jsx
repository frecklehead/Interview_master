import Header from "./components/header";
import { Route, Routes,Navigate } from "react-router-dom";
import Ambulance from "./pages/Ambulance";
import Home from "./pages/Home";
import Services from "./pages/Services";
import SignIn from "./pages/Signin";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
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
        <Route path="/" element={ user ?<Navigate to="/emergency" /> : <Home />}></Route>
        <Route path="/ambulance" element={<Ambulance/>}></Route>
        <Route path="/services" element={<Services />}></Route>

        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Routes>
    </>
  );
}

export default App;
