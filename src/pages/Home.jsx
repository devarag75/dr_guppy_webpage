import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import { sampleProducts, isFirebaseConfigured } from "../data/sampleData";
import { getProducts } from "../services/productService";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        if (isFirebaseConfigured()) {
          const products = await getProducts({ featured: true, limit: 8 });
          setFeatured(products);
        } else {
          // Demo mode — use sample data
          await new Promise((r) => setTimeout(r, 800));
          setFeatured(sampleProducts.filter((p) => p.featured));
        }
      } catch {
        setFeatured(sampleProducts.filter((p) => p.featured));
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <div>
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-white mt-16 border-b border-dark-600" id="hero-section">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="container-app relative z-10 py-16 md:py-24 flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 text-neon-green font-medium text-[13px] uppercase tracking-wide mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
            Premium Fish Delivery
          </div>

          {/* Tagline */}
          <h1 className="font-heading font-black text-4xl md:text-6xl xl:text-7xl text-text-primary mb-6 animate-fade-in-up stagger-1 leading-[1.1] max-w-4xl mx-auto tracking-tight">
            Premium Quality <span className="text-neon-green relative inline-block">Guppies</span> Delivered to Your Door
          </h1>

          <p className="text-text-secondary text-lg md:text-xl mb-10 animate-fade-in-up stagger-2 max-w-2xl mx-auto leading-relaxed">
            Discover our handpicked collection of rare and fancy guppies. Selectively bred for superior genetics, vibrant colors, and optimal health.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
            <Link to="/products" className="btn-primary" id="cta-shop-now">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Shop Now
            </Link>
            <Link to="/products" className="btn-secondary" id="cta-view-collection">
              View Collection
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-12 md:py-20 bg-white" id="featured-section">
        <div className="container-app">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-dark-600">
            <div>
              <h2 className="font-heading font-black text-2xl md:text-3xl text-text-primary tracking-tight">
                Featured <span className="text-neon-green">Guppies</span>
              </h2>
              <p className="hidden md:block text-text-muted text-xs font-bold uppercase tracking-widest mt-1 opacity-70">
                Premium Selection
              </p>
            </div>
            <Link to="/products" className="btn-secondary !py-2 !px-4 !text-xs !rounded-lg hover:bg-neon-green hover:text-white transition-all shadow-none">
              View All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-12 md:py-16 bg-dark-900/5" id="trust-section">
        <div className="container-app">
          <div className="text-center mb-10">
            <h2 className="font-heading font-black text-2xl md:text-3xl text-text-primary tracking-tight mb-2">
              Why <span className="text-neon-green uppercase">DR Guppy</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🏆", title: "Premium Quality", desc: "Selectively bred genetics" },
              { icon: "📦", title: "Safe Shipping", desc: "Insulated & oxygenated" },
              { icon: "🚚", title: "Pan-India", desc: "Express delivery tracking" },
              { icon: "💯", title: "Live Arrival", desc: "100% guarantee assurance" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl border border-dark-600 shadow-sm text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-heading font-bold text-text-primary text-xs uppercase tracking-wider mb-1">{item.title}</h3>
                <p className="text-text-muted text-[11px] leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-12 md:py-16" id="cta-banner">
        <div className="container-app">
          <div 
            className="p-8 md:p-12 text-center rounded-2xl relative overflow-hidden text-text-primary border border-dark-600 shadow-sm"
            style={{ background: 'linear-gradient(to right, #f8fafc, #eef2ff)' }}
          >
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">
                Start Your Collection Today
              </h2>
              <p className="text-text-secondary text-base mb-8 opacity-90">
                Browse our premium varieties and order conveniently via WhatsApp. Fast delivery & healthy fish guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/products" className="btn-primary px-10 py-3.5 rounded-lg shadow-sm">
                  🐟 Explore Collection
                </Link>
                <a
                  href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp px-10 py-3.5 rounded-lg shadow-sm"
                >
                  Chat with Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
