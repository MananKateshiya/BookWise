"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { cn } from "@/lib/utils";

const NavBar = () => {
  const navItems = [
    { label: "Library", href: "/" },
    { label: "Add New", href: "/book/new" },
  ];

  const pathname = usePathname();
  const { user } = useUser();

  return (
    <header className="w-full fixed z-90 bg-('--bg-primary')">
      <div className="wrapper navbar-height py-4 flex justify-between items-center">
        <Link href="/" className="flex gap-0.5 items-center">
          <Image
            className="w-auto h-auto"
            src={"/assets/logo.png"}
            alt="BookWise"
            width={42}
            height={26}
          />
          <span className="logo-text">BookWise</span>
        </Link>

        <nav className="w-fit flex gap-7.5 items-center">
          {navItems.map(({ label, href }) => {
            const isActive =
              pathname === href ||
              (href !== pathname && pathname.startsWith(href));

            return (
              <Link
                href={href}
                key={label}
                className={cn(
                  "nav-link-base",
                  isActive ? "nav-link-active" : "text-black hover:opacity-70",
                )}
              >
                {label}
              </Link>
            );
          })}

          <div className="flex gap-7.5 items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="nav-link-base text-black hover:opacity-70 cursor-pointer"
                >
                  Sign in
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="rounded-xl bg-(--accent-warm) px-4 py-2 text-sm font-semibold text-white shadow-(--shadow-soft) transition hover:bg-(--accent-warm-hover) cursor-pointer"
                >
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <div className="nav-user-link">
                <UserButton />
                {user?.firstName && (
                  <Link href={"/subscriptions"} className="nav-user-name">
                    {user?.firstName}
                  </Link>
                )}
              </div>
            </SignedIn>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
