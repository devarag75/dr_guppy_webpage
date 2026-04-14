import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import logoImage from "../../assets/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getCartCount } = useCart();
  const { isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Shop" },
    { to: "/wishlist", label: "Wishlist" },
    { to: "/cart", label: "Cart" },
  ];

  if (isAdmin) {
    navLinks.push({ to: "/admin", label: "Admin" });
  }

  const cartCount = getCartCount();

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
        id="main-navbar"
      >
        <div className="container-app">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" id="navbar-logo">
              <div className="w-[50px] h-[50px] rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow bg-white shrink-0 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="Dr Guppy Farm Logo" 
                  className="w-full h-full object-cover scale-[1.1]"
                  onError={(e) => {
                    e.target.parentElement.style.display = 'none';
                    e.target.parentElement.nextSibling.style.display = 'flex';
                  }}
                />
              </div>
              <div className="hidden w-[50px] h-[50px] rounded-full bg-gradient-to-br from-neon-green to-aqua items-center justify-center text-white font-bold text-sm font-heading shadow-md">
                DR
              </div>
              <span className="font-heading font-black tracking-tight text-xl text-text-primary hidden sm:block uppercase">
                Dr Guppy <span className="text-neon-green">Farm</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    location.pathname === link.to
                      ? "text-neon-green bg-neon-green/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-dark-600/50"
                  }`}
                >
                  {link.label}
                  {link.to === "/cart" && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 badge badge-green">
                      {cartCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg text-text-secondary hover:text-neon-green hover:bg-dark-600/50 transition-all"
                id="search-toggle"
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </button>

              {/* Cart (Mobile) */}
              <Link
                to="/cart"
                className="md:hidden p-2 rounded-lg text-text-secondary hover:text-neon-green hover:bg-dark-600/50 transition-all relative"
                id="mobile-cart-link"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 badge badge-green">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg text-text-secondary hover:text-neon-green hover:bg-dark-600/50 transition-all"
                id="mobile-menu-toggle"
                aria-label="Menu"
              >
                {isOpen ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar (Expandable) */}
          {searchOpen && (
            <div className="py-3 animate-fade-in-down">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guppies..."
                  className="form-input pr-12"
                  autoFocus
                  id="search-input"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-neon-green transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" id="mobile-menu">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-dark-800 border-l border-glass-border shadow-2xl animate-slide-in-right">
            <div className="pt-20 px-6">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      location.pathname === link.to
                        ? "text-neon-green bg-neon-green/10"
                        : "text-text-secondary hover:text-text-primary hover:bg-dark-600/50"
                    }`}
                  >
                    {link.label}
                    {link.to === "/cart" && cartCount > 0 && (
                      <span className="ml-2 badge badge-green">{cartCount}</span>
                    )}
                  </Link>
                ))}
                {!isAdmin && (
                  <Link
                    to="/admin/login"
                    className="px-4 py-3 rounded-xl text-base font-medium text-text-muted hover:text-text-secondary hover:bg-dark-600/50 transition-all mt-4 border-t border-dark-600 pt-6"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-18" />
    </>
  );
}
