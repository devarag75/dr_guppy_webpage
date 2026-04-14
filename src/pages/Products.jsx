import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/product/ProductCard";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import { sampleProducts, CATEGORIES, COLORS, TYPES, isFirebaseConfigured } from "../data/sampleData";
import { getProducts } from "../services/productService";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters from URL
  const activeCategory = searchParams.get("category") || "";
  const activeType = searchParams.get("type") || "";
  const activeColor = searchParams.get("color") || "";
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "newest";
  const [priceRange, setPriceRange] = useState([0, 500]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        if (isFirebaseConfigured()) {
          const data = await getProducts();
          setProducts(data);
        } else {
          await new Promise((r) => setTimeout(r, 600));
          setProducts(sampleProducts);
        }
      } catch {
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (activeType) {
      result = result.filter((p) => p.type === activeType);
    }
    if (activeColor) {
      result = result.filter((p) => p.color === activeColor);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // newest
        break;
    }

    return result;
  }, [products, activeCategory, activeType, activeColor, searchQuery, sortBy, priceRange]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange([0, 500]);
  };

  const activeFilterCount = [activeCategory, activeType, activeColor, searchQuery].filter(Boolean).length;

  return (
    <div className="py-6 md:py-10" id="products-page">
      <div className="container-app">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary">
              {searchQuery ? `Results for "${searchQuery}"` : "All Guppies"}
            </h1>
            <p className="text-text-muted text-sm mt-1">
              {loading ? "Loading..." : `${filteredProducts.length} products found`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="md:hidden btn-ghost flex items-center gap-2"
              id="filter-toggle"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="badge badge-green">{activeFilterCount}</span>
              )}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="form-select text-sm py-2.5 max-w-[180px]"
              id="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* ===== FILTERS SIDEBAR ===== */}
          <aside
            className={`${
              filtersOpen ? "fixed inset-0 z-40 md:relative md:inset-auto" : "hidden md:block"
            } md:w-64 md:flex-shrink-0`}
            id="filters-sidebar"
          >
            {/* Mobile overlay */}
            {filtersOpen && (
              <div className="absolute inset-0 bg-black/60 md:hidden" onClick={() => setFiltersOpen(false)} />
            )}

            <div className={`${
              filtersOpen
                ? "absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-dark-800 p-6 overflow-y-auto z-10 animate-slide-in-left"
                : ""
            } md:relative md:w-full md:p-0`}>
              <div className="glass-card p-5 space-y-6 md:sticky md:top-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-semibold text-text-primary">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-neon-green hover:underline">
                      Clear All
                    </button>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="form-label">Category</label>
                  <select
                    value={activeCategory}
                    onChange={(e) => updateFilter("category", e.target.value)}
                    className="form-select text-sm"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="form-label">Type</label>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => updateFilter("type", activeType === t.id ? "" : t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          activeType === t.id
                            ? "bg-neon-green/15 border-neon-green/40 text-neon-green"
                            : "border-dark-500 text-text-muted hover:border-dark-400 hover:text-text-secondary"
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <label className="form-label">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => updateFilter("color", activeColor === c.id ? "" : c.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          activeColor === c.id
                            ? "bg-neon-green/15 border-neon-green/40 text-neon-green"
                            : "border-dark-500 text-text-muted hover:border-dark-400 hover:text-text-secondary"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ background: c.hex }}
                        />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="form-label">
                    Price Range: ₹{priceRange[0]} – ₹{priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={500}
                    step={10}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-neon-green mt-2"
                  />
                </div>

                {/* Close (Mobile) */}
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="md:hidden btn-primary w-full"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* ===== PRODUCT GRID ===== */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-heading font-semibold text-text-primary mb-2">No guppies found</h3>
                <p className="text-text-muted text-sm mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button onClick={clearFilters} className="btn-secondary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
