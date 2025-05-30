import React from 'react'
import logo from "../../assets/logo-transparent.png"
const Footer:React.FC = () => {
  return (
    <footer className='bg-sky-900 shadow-xl p-10 bottom-0 h-full w-full'>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
                <img src={logo.src} alt="Company Logo" className="h-20 w-auto" />
                <span className="text-3xl text-primary font-bold">Meloworld</span>
            </div>
            <div className="flex space-x-4">
                <a href="/" className="text-primary">Home</a>
                <a href="/about" className="text-primary">About</a>
                <a href="/services" className="text-primary">Services</a>
                <a href="/contact" className="text-primary">Contact</a>
            </div>
        </div>
    </footer>
  )
}

export default Footer