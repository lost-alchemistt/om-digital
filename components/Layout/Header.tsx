"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UserCircle2,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  User,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import gsap from "gsap";

interface Service {
  id: number;
  name: string;
  slug: string;
}

interface NavItem {
  label: string;
  href: string;
  dropdownItems?: { label: string; href: string }[];
}

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const [isDesktopServiceOpen, setIsDesktopServiceOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>(
    [
      { label: "HOME", href: "/" },
      { label: "SERVICES", href: "/services", dropdownItems: [] },
      { label: "BLOG", href: "/blog" },
      { label: "CONTACT", href: "/contact" },
    ]
  );

  const headerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);
  const socialLinksRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLLIElement>(null);

  // Fetch services from database
  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("id, name, slug")
          .eq("active", true)
          .order("id", { ascending: true });

        if (error) {
          console.error("Error fetching services:", error);
          return;
        }

        if (data) {
          // Update navItems with dynamic services + "All Services" option
          setNavItems([
            { label: "HOME", href: "/" },
            {
              label: "SERVICES",
              href: "/services",
              dropdownItems: [
                { label: "All Services", href: "/services" },
                ...data.map((service) => ({
                  label: service.name,
                  href: `/services/${service.slug}`,
                })),
              ],
            },
            { label: "BLOG", href: "/blog" },
            { label: "CONTACT", href: "/contact" },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    }

    fetchServices();
  }, []);

  useEffect(() => {
    // Force dark mode by default
    document.documentElement.classList.add("dark");
    setTheme("dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    if (!mobileMenuRef.current) return;

    const menuItems = menuItemsRef.current
      ? Array.from(menuItemsRef.current.children)
      : [];
    const socialLinks = socialLinksRef.current;

    // Set initial states
    gsap.set(mobileMenuRef.current, {
      display: isMenuOpen ? "block" : "none",
      opacity: 0,
      clipPath: "circle(0% at 100% 0)",
    });

    if (menuItems.length > 0) {
      gsap.set(menuItems, {
        opacity: 0,
        x: 50,
        filter: "blur(10px)",
      });
    }

    if (socialLinks) {
      gsap.set(socialLinks, {
        opacity: 0,
        y: 30,
      });
    }

    // Animation timeline
    if (isMenuOpen) {
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
      });

      tl.to(mobileMenuRef.current, {
        display: "block",
        opacity: 1,
        clipPath: "circle(150% at 100% 0)",
        duration: 0.6,
      })
        .to(
          menuItems,
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .to(
          socialLinks,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.2"
        );
    } else {
      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
      });

      tl.to(socialLinks, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
      })
        .to(
          menuItems,
          {
            opacity: 0,
            x: -30,
            filter: "blur(5px)",
            duration: 0.3,
            stagger: 0.03,
            ease: "power2.in",
          },
          "-=0.2"
        )
        .to(
          mobileMenuRef.current,
          {
            clipPath: "circle(0% at 100% 0)",
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              gsap.set(mobileMenuRef.current, { display: "none" });
            },
          },
          "-=0.3"
        );
    }
  }, [isMenuOpen]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDesktopServiceOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const DesktopProfile = () => (
    <div className="flex items-center space-x-8">
      <NavigationMenu>
        <NavigationMenuList className="flex gap-8">
          {navItems.map((item) => (
            <NavigationMenuItem
              key={item.label}
              className="relative"
              ref={item.label === "SERVICES" ? serviceDropdownRef : undefined}
            >
              <div
                onClick={() => {
                  if (item.label === "SERVICES") {
                    setIsDesktopServiceOpen(!isDesktopServiceOpen);
                  } else {
                    router.push(item.href);
                  }
                }}
              >
                <NavigationMenuLink
                  className={`font-montserrat text-base tracking-[0.2em] font-medium transition-all duration-300 hover:no-underline relative 
                  text-white dark:text-white cursor-pointer
                  before:content-[''] before:absolute before:block before:w-full before:h-[1px] 
                  before:bottom-0 before:left-0 before:bg-white dark:before:bg-white before:scale-x-0 
                  hover:before:scale-x-100 before:transition-transform before:duration-500 
                  before:origin-left before:transform-gpu`}
                >
                  {item.label}
                  {item.label === "SERVICES" && (
                    <svg
                      className={`inline-block ml-2 w-4 h-4 transform transition-transform ${
                        isDesktopServiceOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </NavigationMenuLink>
              </div>
              {item.label === "SERVICES" && item.dropdownItems && isDesktopServiceOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-black dark:bg-black border border-white/10 rounded-md shadow-lg z-50">
                  {item.dropdownItems.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.label}
                      href={dropdownItem.href}
                      onClick={() => setIsDesktopServiceOpen(false)}
                      className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors duration-200"
                    >
                      {dropdownItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );

  const AuthSection = () => (
    <div className="flex items-center gap-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer w-8 h-8 rounded-full overflow-hidden border-2 border-white hover:opacity-80 transition-opacity">
            <div className="w-full h-full bg-black dark:bg-white flex items-center justify-center">
              <UserCircle2
                className="w-5 h-5 text-white dark:text-black"
                strokeWidth={1.5}
              />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 h-4 w-4" strokeWidth={1.5} />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="mr-2 h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Sun className="mr-2 h-4 w-4" strokeWidth={1.5} />
            )}
            Theme
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/auth/login")}>
            <LogOut className="mr-2 h-4 w-4" strokeWidth={1.5} />
            Sign in
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 w-full z-50 bg-black dark:bg-black "
    >
      <div className="container mx-auto px-4 ">
        <div className="flex items-center justify-between h-14 md:h-20 ">
          {/* Mobile Layout */}
          <div className="flex items-center justify-between w-full md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col justify-center items-center w-8 h-8 z-50"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute left-0 w-6 h-0.5 bg-white transition-all duration-300 ${
                    isMenuOpen
                      ? "top-1/2 -translate-y-1/2 rotate-45"
                      : "top-1/4 rotate-0"
                  }`}
                />
                <span
                  className={`absolute top-1/2 -translate-y-1/2 left-0 w-6 h-0.5 bg-white transition-opacity duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 w-6 h-0.5 bg-white transition-all duration-300 ${
                    isMenuOpen
                      ? "bottom-1/2 translate-y-1/2 -rotate-45"
                      : "bottom-1/4 rotate-0"
                  }`}
                />
              </div>
            </button>

            <Link
              href="/"
              className="absolute left-1/2 transform -translate-x-1/2"
            >
              <div className="transition-transform duration-300 hover:scale-110">
                <Image
                  src="/images/logo2.png"
                  alt="HB Logo"
                  width={80}
                  height={50}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            <AuthSection />
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between w-full ">
            <Link href="/" className="relative">
              <div className="transition-transform duration-300 hover:scale-110">
                <Image
                  src="/images/logo2.png"
                  alt="HB Logo"
                  width={80}
                  height={50}
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            <div className="flex items-center space-x-6">
              <DesktopProfile />
              <div className="flex items-center space-x-6">
                <AuthSection />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="fixed left-0 right-0 top-16 md:top-24 h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] bg-gradient-to-b from-black via-black/95 to-black/90 backdrop-blur-lg border-t border-white/10 shadow-2xl md:hidden overflow-y-auto"
        style={{ display: "none" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -z-10" />

            {/* Menu items */}
            <div className="space-y-0" ref={menuItemsRef}>
              {navItems.map((item, index) => (
                <div key={item.label} className="opacity-0">
                  <div className="group block">
                    <div
                      className="relative py-5 px-8 cursor-pointer"
                      onClick={() => {
                        if (item.label === "SERVICES") {
                          setIsServiceDropdownOpen(!isServiceDropdownOpen);
                        } else {
                          router.push(item.href);
                          setIsMenuOpen(false);
                        }
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2" />
                      <div className="relative flex items-center justify-between">
                        <span className="text-4xl font-montserrat text-white/80 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-2">
                          {item.label}
                        </span>
                        {item.label === "SERVICES" && (
                          <svg
                            className={`w-6 h-6 text-white/70 transition-transform duration-300 ${
                              isServiceDropdownOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    {item.label === "SERVICES" &&
                      item.dropdownItems &&
                      isServiceDropdownOpen && (
                        <div className="bg-white/5 rounded-lg mx-8 mb-4">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.label}
                              href={dropdownItem.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="block px-6 py-3 text-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                  {index < navItems.length - 1 && (
                    <div className="mx-8">
                      <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
                    </div>
                  )}
                </div>
              ))}
              <div className="opacity-0">
                <Link
                  href="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="group block"
                >
                  <div className="relative py-5 px-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-2" />
                    <div className="relative flex items-center justify-between">
                      <span className="text-4xl font-montserrat text-white/80 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-2">
                        LOGIN
                      </span>
                      <div className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <svg
                          className="w-6 h-6 text-white/70"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div
              ref={socialLinksRef}
              className="mt-12 flex items-center justify-center gap-12"
            >
              <Link
                href="#"
                className="text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 transition-colors p-2"
              >
                <Facebook className="w-6 h-6" strokeWidth={1.25} />
              </Link>
              <Link
                href="#"
                className="text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 transition-colors p-2"
              >
                <Instagram className="w-6 h-6" strokeWidth={1.25} />
              </Link>
              <Link
                href="#"
                className="text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 transition-colors p-2"
              >
                <Twitter className="w-6 h-6" strokeWidth={1.25} />
              </Link>
              <Link
                href="#"
                className="text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 transition-colors p-2"
              >
                <Linkedin className="w-6 h-6" strokeWidth={1.25} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;