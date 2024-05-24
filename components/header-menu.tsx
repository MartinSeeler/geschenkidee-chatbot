"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Menu, MessageCircleHeart, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const HeaderMenu = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="bg-transparent">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">GeschenkIdee.io</span>
            <img className="h-8 w-auto" src="/img/logo.png" alt="" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Hauptmenü öffnen</span>
            <Menu size={32} aria-hidden="true" />
          </button>
        </div>
        {/* <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </a>
          ))}
        </div> */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button asChild>
            <Link
              href="/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex gap-2 items-center"
            >
              Neuen Chat starten
              <MessageCircleHeart size={24} className="text-mint-800" />
            </Link>
          </Button>
        </div>
      </nav>
      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-mint-10 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">GeschenkIdee.io</span>
              <img className="h-8 w-auto" src="/img/logo.png" alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X size={32} aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              {/* <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div> */}
              <div className="py-6">
                <Button asChild>
                  <Link
                    href="/new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex gap-2 items-center w-full"
                  >
                    Neuen Chat starten
                    <MessageCircleHeart size={24} className="text-mint-800" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};
export default HeaderMenu;
