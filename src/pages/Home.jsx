import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import { sampleProducts, CATEGORIES, isFirebaseConfigured } from "../data/sampleData";
import { getProducts } from "../services/productService";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

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

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({ left: dir * scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div>
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white mt-16" id="hero-section">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="container-app relative z-10 py-12 md:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 text-neon-green font-medium text-sm mb-6 animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                Premium Fish Delivered
              </div>

              {/* Tagline */}
              <h1 className="font-heading font-black text-4xl md:text-5xl xl:text-6xl text-text-primary mb-6 animate-fade-in-up stagger-1 leading-[1.15]">
                Premium Quality <br className="hidden lg:block"/>
                <span className="text-neon-green relative">
                  Guppies
                  <svg className="absolute -bottom-2 lg:-bottom-4 left-0 w-full h-3 text-neon-green/20" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0,10 Q50,20 100,10" fill="currentColor" />
                  </svg>
                </span>{" "}
                <br className="hidden lg:block"/>
                Delivered to Your Door
              </h1>

              <p className="text-text-secondary text-lg md:text-xl mb-10 animate-fade-in-up stagger-2 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover our handpicked collection of rare and fancy guppies. Selectively bred for superior genetics, vibrant colors, and optimal health. 🐟
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up stagger-3">
                <Link to="/products" className="btn-primary text-base px-8 py-4 shadow-xl shadow-neon-green/20 hover:shadow-neon-green/40 hover:-translate-y-1 transition-all" id="cta-shop-now">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Shop Now
                </Link>
                <Link to="/products" className="btn-secondary text-base px-8 py-4 hover:-translate-y-1 transition-transform" id="cta-view-collection">
                  View Collection
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start gap-8 md:gap-12 mt-12 animate-fade-in-up stagger-4 pt-8 border-t border-dark-600">
                <div>
                  <span className="font-heading font-black text-2xl md:text-3xl text-text-primary">50+</span>
                  <p className="text-text-muted text-sm mt-1 font-medium">Rare Varieties</p>
                </div>
                <div className="w-px h-12 bg-dark-600"></div>
                <div>
                  <span className="font-heading font-black text-2xl md:text-3xl text-text-primary">10k+</span>
                  <p className="text-text-muted text-sm mt-1 font-medium">Happy Fish</p>
                </div>
                <div className="w-px h-12 bg-dark-600"></div>
                <div>
                  <span className="font-heading font-black text-2xl md:text-3xl text-text-primary">100%</span>
                  <p className="text-text-muted text-sm mt-1 font-medium">Live Arrival</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image Container */}
            <div className="order-1 lg:order-2 relative animate-fade-in flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] aspect-square rounded-full overflow-hidden border-[12px] border-white shadow-2xl z-10 bg-dark-900 group">
                <img 
                  src="/hero.png" 
                  alt="Premium Assorted Guppies" 
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-700" 
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1522069213508-fd9cb14c5b16?q=80&w=600&h=600&auto=format&fit=crop';
                  }}
                />
              </div>
              
              {/* Floating aesthetic elements */}
              <div className="absolute top-10 -left-10 md:top-20 md:-left-12 w-24 h-24 bg-aqua/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute bottom-10 -right-10 md:bottom-20 md:-right-12 w-32 h-32 bg-neon-green/20 rounded-full blur-3xl -z-10"></div>
              
              <div className="hidden md:flex absolute top-1/4 -left-6 z-20 bg-white glass-card px-4 py-3 rounded-xl shadow-lg items-center gap-3 animate-fade-in-up stagger-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <div>
                  <p className="text-xs text-text-muted font-medium">Quality Check</p>
                  <p className="text-sm font-bold text-text-primary">100% Guaranteed</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="py-16 md:py-24" id="categories-section">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-3">
              Browse by <span className="text-neon-green">Category</span>
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Find the perfect guppy for your aquarium from our curated categories
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className={`glass-card p-6 md:p-8 text-center group animate-fade-in-up stagger-${i + 1}`}
                id={`category-${cat.id}`}
              >
                <div className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <h3 className="font-heading font-semibold text-text-primary mb-2 group-hover:text-neon-green transition-colors">
                  {cat.name}
                </h3>
                <p className="text-text-muted text-xs hidden md:block">
                  {cat.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 md:py-24 bg-white border-y border-dark-600" id="featured-section">
        <div className="container-app">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-2">
                Featured <span className="text-neon-green">Guppies</span>
              </h2>
              <p className="text-text-secondary text-sm">
                Our hand-picked premium collection
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scrollCarousel(-1)}
                className="p-2 rounded-full glass hover:border-neon-green/30 transition-all"
                aria-label="Scroll left"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => scrollCarousel(1)}
                className="p-2 rounded-full glass hover:border-neon-green/30 transition-all"
                aria-label="Scroll right"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {loading
              ? [...Array(6)].map((_, i) => (
                  <div key={i} className="min-w-[260px] md:min-w-[280px] snap-start">
                    <ProductCardSkeleton />
                  </div>
                ))
              : featured.map((product) => (
                  <div key={product.id} className="min-w-[260px] md:min-w-[280px] snap-start">
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/products" className="btn-secondary" id="view-all-products">
              View All Guppies
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-16 md:py-24" id="trust-section">
        <div className="container-app">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-text-primary mb-3">
              Why Choose <span className="text-neon-green">DR Guppy Farm</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🏆", title: "Premium Quality", desc: "All fish are selectively bred for top-quality genetics and vibrant coloring" },
              { icon: "📦", title: "Safe Packaging", desc: "Professional packaging with insulated boxes and oxygen-filled bags" },
              { icon: "🚚", title: "Pan-India Delivery", desc: "We deliver live fish safely across India via express shipping" },
              { icon: "💯", title: "Live Arrival Guarantee", desc: "We guarantee 100% live arrival or full replacement at no extra cost" },
            ].map((item, i) => (
              <div
                key={i}
                className={`glass-card p-6 text-center animate-fade-in-up stagger-${i + 1}`}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-heading font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16" id="cta-banner">
        <div className="container-app">
          <div className="glass-card p-8 md:p-14 text-center relative overflow-hidden bg-white border-dark-600">
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900 to-white" />
            <div className="relative z-10">
              <h2 className="font-heading font-bold text-2xl md:text-4xl text-text-primary mb-4">
                Ready to Start Your Guppy Collection?
              </h2>
              <p className="text-text-secondary mb-8 max-w-lg mx-auto">
                Browse our premium collection and order via WhatsApp. Fast delivery, healthy fish, guaranteed!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products" className="btn-primary px-8 py-4">
                  🐟 Explore Collection
                </Link>
                <a
                  href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "919876543210"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp px-8 py-4"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
