"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconBrandTabler,
  IconLogout,
  IconWorldWww
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Link from 'next/link';
import Dashboard from "@/app/pages/Dashboard";

export function SidebarDemo() {
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Website Scraper",
      href: "/",
      icon: (
        <IconWorldWww className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const bottomLinks = [
    {
      label: "Logout",
      href: "/logout",
      icon: (
        <IconLogout className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => {
        console.log('Logging out...');
      }
    }
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className={cn(
      "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 h-screen border border-neutral-200 dark:border-neutral-700 overflow-hidden"
    )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
            <div className="flex flex-col gap-2">
              {bottomLinks.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link}
                />
              ))}
            </div>

            {/* Profile Card */}
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-3 px-2">
                <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-medium">JD</span>
                </div>
                {open && (
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      John Doe
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      john@example.com
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

// Rest of the Logo components remain the same
export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Extract Details
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};