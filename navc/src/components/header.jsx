import React, { useState } from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import { MdOutlineClose } from "react-icons/md";
import {Link} from 'react-router-dom';
export default function Header() {
  const [toggle ,setoggle]=useState(true);
  

  return (
  
    <div className='bg-green-950 p-3'>
      <div className='flex justify-between items-center'>
        <div className='text-3xl text-white'>  
          Sitename
        </div>

{
  toggle ?
  <RxHamburgerMenu onClick={ ()=> setoggle(!toggle)}  className= 'md:hidden text-2xl text-white'/>
:<MdOutlineClose   onClick={ ()=> setoggle(!toggle)}className='md:hidden text-2xl text-white '/>

}

        <ul className=' hidden md:flex justify-center gap-12 text-xl text-white'>
          <Link to='/'> Home</Link>
         <Link to='/contact'> Contact</Link>
         <Link to='/services'> Services</Link>
         <Link to='/signin'> SignIn</Link>
         <Link to='/register'> Register</Link>
        </ul>


      {/* mobile display  */}
      <ul className={`left-0 w-full h-screen md:hidden fixed bg-black top-[59px]  text-xl text-white
      ${
        toggle ?
        'left-[-100%]':
       " left-[0]"

      }
      
      `}>
          <li className='p-6'> <Link to='/' >Home          </Link></li>
          <li className='p-6'> <Link to='/contact' >Contact         </Link></li>  <li className='p-6'> <Link to='/services' >Services        </Link></li>
          <li className='p-6'> <Link to='/signin' >SignIn      </Link></li>
          <li className='p-6'> <Link to='/register' >Register      </Link></li>
        </ul>

       

      </div>
      
    </div>
  )
}
