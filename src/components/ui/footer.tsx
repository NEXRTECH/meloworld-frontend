import React from 'react'
import logo from "../../assets/nexr transparent background.png"
import Image from 'next/image';

const Footer:React.FC = () => {
  return (
    <footer className='bg-gray-200 shadow-xl p-10 bottom-0 h-full w-full'>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
                <Image src={logo} alt="Company Logo" width={150} />
            </div>
            <div className="flex space-x-4 text-gray-800">
                <a href="/" className="hover:text-gray-400">Home</a>
                <a href="/about" className="hover:text-gray-400">About</a>
                <a href="/services" className="hover:text-gray-400">Services</a>
                <a href="/contact" className="hover:text-gray-400">Contact</a>
            </div>
        </div>
    </footer>
  )
}

export default Footer