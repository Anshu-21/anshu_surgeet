import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaGithub,
  FaDiscord,
} from 'react-icons/fa';

function Footer() {
  return (
    <footer className="border-y bg-gray-950">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-500 uppercase">
                Resources
              </h2>
              <ul className="text-gray-700 font-medium">
                <li className="mb-4">
                  <Link to="/" className="hover:underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:underline">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-500 uppercase">
                Follow us
              </h2>
              <ul className="text-gray-700 font-medium">
                <li className="mb-4">
                  <a
                    href="https://github.com/Anshu-21"
                    className="hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Github
                  </a>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Discord
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-500 uppercase">
                Legal
              </h2>
              <ul className="text-gray-700 font-medium">
                <li className="mb-4">
                  <Link to="#" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:underline">
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 md:mt-0 md:ml-8 flex flex-col items-end">
            <div className="mb-4 text-gray-500 font-medium">
              <p>Address: 123 Main St, Katihar, Bihar</p>
              <p>Email: kumaranshu303393@gmail.com</p>
              <p>Phone: +91 9973222511</p>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">
            © 2025
            <a href="https://anshukumar.com/" className="hover:underline">
              anshukumar
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
            <a
              href="https://www.instagram.com/iamasilent2108/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900"
            >
              <FaInstagram className="w-6 h-6" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900"
            >
              <FaFacebookF className="w-6 h-6" />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900"
            >
              <FaTwitter className="w-6 h-6" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://github.com/Anshu-21"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900"
            >
              <FaGithub className="w-6 h-6" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900"
            >
              <FaDiscord className="w-6 h-6" />
              <span className="sr-only">Discord</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
