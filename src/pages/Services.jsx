import React from 'react'
import time from "../assets/images/time.png"
import graph from "../assets/images/graph.png"
import search from "../assets/images/search.png"

const Services = () => {
  return (
    <section className='max-w-[1300px] mx-auto py-10'>

        <div className="pb-20 text-center "> 
            <h1>Why Choose Smart Tutor?</h1>
            <p className='font-semibold'>Experience the future of learning with our comprehensive platform designed to connect students and tutors seamlessly</p>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-3  bg-white gap-15">
            <div class="bg-blue-200/70 px-5 text-center flex flex-col justify-center rounded-4xl py-5 "><div class="flex  justify-center">
              
              <div className=' px-5 py-5 rounded-3xl bg-gradient-to-r from-[#6F9DFC] to-[#4C4EE7]'>
                
                <img src={time}></img></div></div>
            <h3 class="justify-center flex">Flexible Scheduing</h3>
            <p class="justify-center font-semibold text-[20px]">Schedule sessions that fit your lifestyle with 24/7 availability and easy rescheduling options</p>
            </div>

            <div class=" bg-pink-200/70  text-center flex flex-col justify-center py-5 rounded-4xl"><div class="flex *: justify-center"><div className='px-5 py-5 rounded-3xl bg-gradient-to-r from-[#AE50E8] to-[#D52C85]'>
              <img className='' src={search}></img></div></div>
            <h3 class="justify-center flex">Interactive Learning</h3>
            <p class="justify-center font-semibold text-[20px]">Track your progress,manage sessions and access learning resources through our intuitive dashboard</p>
            </div>


            <div class="bg-green-200/70  text-center flex flex-col justify-center py-5 rounded-4xl"><div class="flex justify-center"><div className='bg-gradient-to-r from-[#1FC15F] to-[#089A68] px-5 py-5 rounded-3xl'><img src={graph}></img></div></div>
                <h3 class="justify-center flex">Book Tutors Easily</h3>
                <p class="justify-center font-semibold text-[20px]">Find and book qualified tutors in seconds with our intelligent matching system and advanced filters</p>
            </div>

        </div>

    </section>
  )
}
export default Services