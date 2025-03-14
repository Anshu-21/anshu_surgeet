import React from 'react';
import { assets } from '../assets/assets';

function About() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="flex-1 py-16 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
        <div className="container m-auto px-6 text-white md:px-12 xl:px-6">
          <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
            <div className="md:5/12 lg:w-5/12">
              <img
                src={assets.images.ap}
                alt="image"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>

            <div className="md:7/12 lg:w-6/12">
              <h1 className="text-2xl text-white font-bold md:text-4xl text-center">
                <u>About Us</u>
              </h1>
              <h1 className="text-white font-bold text-xl mt-6">
                Welcome to Surgeet!
              </h1>
              <p className="mt-6 text-white">
                At Surgeet, music isn’t just sound—it’s an experience, an
                emotion, and a connection that binds us all. Whether you’re
                looking for the latest hits, timeless classics, or underground
                indie tracks, we’ve got you covered.
              </p>
              <h1 className="text-white font-bold text-xl mt-6">Our Mission</h1>
              <p className="mt-6 text-white">
                To bring music lovers closer to the artists and sounds they
                cherish while making the discovery of new music exciting and
                effortless. We believe that music has the power to inspire,
                heal, and unite people from all walks of life.
              </p>
              <h1 className="text-white font-bold text-xl mt-6">
                Join the Rhythm
              </h1>
              <p className="mt-6 text-white">
                Start exploring, streaming, and connecting today. With Surgeet,
                the beat never stops! <br />
                Stay Tuned. Stay Inspired. Stay Musical.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
