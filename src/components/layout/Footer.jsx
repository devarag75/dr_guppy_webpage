import { Link } from "react-router-dom";
import logoImage from "../../assets/logo.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210";

  return (
    <footer className="bg-dark-800 border-t border-glass-border mt-16" id="footer">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5 group">
              <img 
                src={logoImage} 
                alt="Dr Guppy Farm Logo" 
                className="w-12 h-12 object-cover rounded-full shadow-md bg-white grayscale group-hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-10 h-10 rounded-full bg-gradient-to-br from-neon-green to-aqua items-center justify-center text-white font-bold text-sm font-heading shadow-md">
                DR
              </div>
              <span className="font-heading font-black text-xl text-text-primary tracking-tight uppercase">
                Dr Guppy <span className="text-neon-green">Farm</span>
              </span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed">
              Premium quality guppies bred with care and expertise. We deliver healthy, vibrant fish to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-text-primary mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-text-muted hover:text-neon-green transition-colors text-sm">Home</Link>
              <Link to="/products" className="text-text-muted hover:text-neon-green transition-colors text-sm">Shop All</Link>
              <Link to="/products?category=fancy" className="text-text-muted hover:text-neon-green transition-colors text-sm">Fancy Guppy</Link>
              <Link to="/products?category=rare" className="text-text-muted hover:text-neon-green transition-colors text-sm">Rare Guppy</Link>
              <Link to="/products?category=breeding-pair" className="text-text-muted hover:text-neon-green transition-colors text-sm">Breeding Pairs</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-semibold text-text-primary mb-4">Support</h4>
            <div className="flex flex-col gap-2">
              <Link to="/cart" className="text-text-muted hover:text-neon-green transition-colors text-sm">My Cart</Link>
              <Link to="/wishlist" className="text-text-muted hover:text-neon-green transition-colors text-sm">Wishlist</Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi! I have a question about DR GUPPY FARM.`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-neon-green transition-colors text-sm"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-text-primary mb-4">Get in Touch</h4>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366]/15 border border-[#25D366]/30 rounded-xl text-[#25D366] text-sm font-medium hover:bg-[#25D366]/25 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
            <p className="text-text-muted text-xs mt-3">
              Mon-Sat: 9:00 AM - 8:00 PM IST
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-600 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-text-muted text-xs">
            © {currentYear} DR GUPPY FARM. All rights reserved.
          </p>
          <p className="text-text-muted text-xs">
            Made with 🐟 for guppy lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
