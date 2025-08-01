import React, { useState } from "react";
import { NavLink } from "react-router";

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface NavbarProps {
  links: NavLink[];
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout?: () => void;
  brand?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  links,
  user,
  onLogout,
  brand = "App",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-800 shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Brand and Navigation Links */}
          <div className="flex items-center">
            {/* Brand */}
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-100">{brand}</h1>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {links.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.href}
                  end
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    link.active
                      ? "border-blue-500 text-gray-100"
                      : "border-transparent text-gray-300 hover:border-gray-500 hover:text-gray-100"
                  }`}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right side - User Menu */}
          <div className="flex items-center">
            {user ? (
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  {/* User Info (hidden on mobile) */}
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    <span className="text-sm font-medium text-gray-100">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </div>

                  {/* Avatar */}
                  <div className="relative">
                    <button
                      onClick={toggleMobileMenu}
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
                    >
                      {user.avatar ? (
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={user.avatar}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Logout Button */}
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className="hidden sm:block ml-3 px-3 py-2 text-sm font-medium text-gray-300 hover:text-gray-100 hover:bg-gray-700 rounded-md transition-colors duration-200"
                    >
                      Logout
                    </button>
                  )}
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-gray-600 focus:outline-none z-50">
                    {/* Mobile Navigation Links */}
                    <div className="md:hidden border-b border-gray-700 pb-2 mb-2">
                      {links.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          className={`block px-4 py-2 text-sm ${
                            link.active
                              ? "text-blue-400 bg-blue-900/20"
                              : "text-gray-300 hover:bg-gray-700"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>

                    {/* User Info */}
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-gray-100">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>

                    {/* Logout */}
                    {onLogout && (
                      <button
                        onClick={() => {
                          onLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Login Button when no user */
              <div className="flex items-center space-x-4">
                <a
                  href="/login"
                  className="text-gray-300 hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden">
          {isMobileMenuOpen && (
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    link.active
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
