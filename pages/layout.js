'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { IoMdPersonAdd } from "react-icons/io";
import { FaAddressCard } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
const navigation = [
  { name: 'add new regestration', href: '/' ,icon:<IoMdPersonAdd />},
  { name: 'regestration', href: 'listPage' ,icon:<FaAddressCard />},
  { name: 'report', href: 'reportPage',icon:<MdFindInPage /> },
  // { name: 'Company', href: '#' },
]

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('')

  useEffect(() => {
    const storedActiveNav = localStorage.getItem('activeNav') || "add new regestration"
    if (storedActiveNav) {
      setActiveNav(storedActiveNav)
    }
  }, [])

  const handleNavClick = (name) => {
    setActiveNav(name)
    localStorage.setItem('activeNav', name)
  }

  return (
    <>
      {/* <header className="bg-[#0C5EF5]">
        <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img alt="" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" className="h-8 w-auto" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}
              onClick={() => handleNavClick(item.name)}
              className={`text-sm font-semibold flex  items-center gap-2   leading-6 text-white  px-3 py-2 rounded ${
                activeNav === item.name ? 'bg-gray-200 text-gray-800' : ''
              }`}
              >
                {item.icon}
                 {item.name}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-10" />
          <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img alt="" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" className="h-8 w-auto" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}
                    onClick={() => {
                      handleNavClick(item.name)
                      setMobileMenuOpen(false)
                    }}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-50 ${
                      activeNav === item.name ? 'bg-gray-200 text-black' : ''
                    }`}
                    >
                     {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
               
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header> */}
      <main>{children}</main>
    </>
  )
}
