import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { addProduct, updateProduct, getProductById } from "../../services/productService";
import { uploadProductImages, uploadProductVideo, compressImage } from "../../services/storageService";
import { CATEGORIES, TYPES, COLORS, isFirebaseConfigured, sampleProducts } from "../../data/sampleData";

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(isEdit);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState({});

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "fancy",
    type: "pair",
    color: "mixed",
    stock: "",
    age: "",
    size: "",
    breedingInfo: "",
    featured: false,
  });

  useEffect(() => {
    if (isEdit) {
      async function fetchProduct() {
        try {
          let prod;
          if (isFirebaseConfigured()) {
            prod = await getProductById(id);
          } else {
            prod = sampleProducts.find((p) => p.id === id);
          }
          if (prod) {
            setForm({
              name: prod.name || "",
              price: prod.price?.toString() || "",
              description: prod.description || "",
              category: prod.category || "fancy",
              type: prod.type || "pair",
              color: prod.color || "mixed",
              stock: prod.stock?.toString() || "",
              age: prod.age || "",
              size: prod.size || "",
              breedingInfo: prod.breedingInfo || "",
              featured: prod.featured || false,
            });
            setExistingImages(prod.images || []);
            setVideoPreview(prod.videoUrl || "");
          }
        } catch {
          toast.error("Failed to load product");
          navigate("/admin/products");
        } finally {
          setFetchingProduct(false);
        }
      }
      fetchProduct();
    }
  }, [id, isEdit, navigate, toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imagePreviews.length + existingImages.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
    // Generate previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Video must be under 50MB");
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) { toast.error("Valid price is required"); return; }
    if (!form.stock || isNaN(form.stock)) { toast.error("Stock quantity is required"); return; }

    setLoading(true);
    try {
      const productData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: [...existingImages],
        videoUrl: videoPreview && !videoFile ? videoPreview : "",
      };

      if (isFirebaseConfigured()) {
        // Upload images
        if (imageFiles.length > 0) {
          const compressed = await Promise.all(
            imageFiles.map((f) => compressImage(f))
          );
          const productId = id || `product_${Date.now()}`;
          const urls = await uploadProductImages(compressed, productId, (i, progress) => {
            setUploadProgress((prev) => ({ ...prev, [`img_${i}`]: progress }));
          });
          productData.images = [...existingImages, ...urls];
        }

        // Upload video
        if (videoFile) {
          const productId = id || `product_${Date.now()}`;
          const videoUrl = await uploadProductVideo(videoFile, productId, (progress) => {
            setUploadProgress((prev) => ({ ...prev, video: progress }));
          });
          productData.videoUrl = videoUrl;
        }

        if (isEdit) {
          await updateProduct(id, productData);
          toast.success("Product updated successfully! ✅");
        } else {
          await addProduct(productData);
          toast.success("Product added successfully! 🎉");
        }
      } else {
        // Demo mode
        await new Promise((r) => setTimeout(r, 1000));
        toast.success(isEdit ? "Product updated (demo mode)" : "Product added (demo mode)");
      }

      navigate("/admin/products");
    } catch (error) {
      toast.error("Failed to save product. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="container-app py-10">
        <div className="glass-card p-8 max-w-2xl mx-auto space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-10 bg-dark-900/5 min-h-screen" id="product-form-page">
      <div className="container-app max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-black text-2xl md:text-4xl text-text-primary tracking-tight">
              {isEdit ? "Edit" : "Add"} <span className="text-neon-green">Guppy</span>
            </h1>
            <p className="text-text-muted text-sm mt-1 font-medium">
              {isEdit ? "Update current product listing" : "Create a new product listing"}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/products")}
            className="p-3 rounded-xl border border-dark-600 bg-white hover:bg-dark-600/50 transition-all text-text-muted"
            title="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="glass-card p-6 md:p-8 space-y-6 shadow-xl border-dark-600/50">
            <div className="pb-4 border-b border-dark-600 mb-2">
              <h3 className="font-heading font-black text-lg text-text-primary flex items-center gap-3 uppercase tracking-tighter">
                <span className="w-8 h-8 rounded-lg bg-neon-green/10 flex items-center justify-center text-sm">01</span>
                Basic Information
              </h3>
            </div>

            <div>
              <label htmlFor="name" className="form-label text-[10px] uppercase tracking-widest font-black opacity-70 mb-2 block">Product Name *</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Red Dragon Guppy Pair"
                className="form-input !rounded-xl border-dark-600 !py-3 shadow-sm focus:border-neon-green"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="form-label text-[10px] uppercase tracking-widest font-black opacity-70 mb-2 block">Price (₹) *</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="150"
                  className="form-input !rounded-xl border-dark-600 !py-3 shadow-sm focus:border-neon-green"
                  min="1"
                  required
                />
              </div>
              <div>
                <label htmlFor="stock" className="form-label text-[10px] uppercase tracking-widest font-black opacity-70 mb-2 block">Inventory/Stock *</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="10"
                  className="form-input !rounded-xl border-dark-600 !py-3 shadow-sm focus:border-neon-green"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="form-label text-[10px] uppercase tracking-widest font-black opacity-70 mb-2 block">Detailed Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the colors, tail shape, and breeding background..."
                className="form-input !rounded-xl border-dark-600 min-h-[140px] resize-y shadow-sm focus:border-neon-green"
                rows={5}
              />
            </div>
          </div>

          {/* Configuration */}
          <div className="glass-card p-6 md:p-8 space-y-6 shadow-xl border-dark-600/50">
            <div className="pb-4 border-b border-dark-600 mb-2">
              <h3 className="font-heading font-black text-lg text-text-primary flex items-center gap-3 uppercase tracking-tighter">
                <span className="w-8 h-8 rounded-lg bg-aqua/10 flex items-center justify-center text-sm">02</span>
                Configuration
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label htmlFor="category" className="form-label text-[10px] uppercase tracking-widest font-black opacity-70 mb-2 block">Category</label>
                <div className="relative">
                  <select id="category" name="category" value={form.category} onChange={handleChange} className="form-select !rounded-xl border-dark-600 !py-3 appearance-none shadow-sm focus:border-neon-green">
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="type" className="form-label text-[10px] uppercase tracking-widest font-black opacity-70 mb-2 block">Order Type</label>
                <select id="type" name="type" value={form.type} onChange={handleChange} className="form-select !rounded-xl border-dark-600 !py-3 shadow-sm focus:border-neon-green">
                  {TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="color" className="form-label text-[10px] uppercase tracking-widest font-black opacity-70 mb-2 block">Dominant Color</label>
                <select id="color" name="color" value={form.color} onChange={handleChange} className="form-select !rounded-xl border-dark-600 !py-3 shadow-sm focus:border-neon-green">
                  {COLORS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-dark-600 pt-6">
              <div>
                <label htmlFor="age" className="form-label text-[10px] uppercase tracking-widest font-black opacity-70 mb-2 block">Approx. Age</label>
                <input id="age" name="age" value={form.age} onChange={handleChange} placeholder="e.g., 3 mo" className="form-input !rounded-xl border-dark-600 !py-3 shadow-sm" />
              </div>
              <div>
                <label htmlFor="size" className="form-label text-[10px] uppercase tracking-widest font-black opacity-70 mb-2 block">Adult Size</label>
                <input id="size" name="size" value={form.size} onChange={handleChange} placeholder="e.g., 4 cm" className="form-input !rounded-xl border-dark-600 !py-3 shadow-sm" />
              </div>
              <div>
                <label htmlFor="breedingInfo" className="form-label text-[10px] uppercase tracking-widest font-black opacity-70 mb-2 block">Breeding Status</label>
                <input id="breedingInfo" name="breedingInfo" value={form.breedingInfo} onChange={handleChange} placeholder="e.g., Proven Pair" className="form-input !rounded-xl border-dark-600 !py-3 shadow-sm" />
              </div>
            </div>

            <label className="flex items-center gap-4 cursor-pointer p-4 rounded-xl bg-dark-700/50 border border-dark-600 hover:border-neon-green/30 transition-all group">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-6 h-6 rounded-lg accent-neon-green cursor-pointer"
              />
              <div>
                <span className="text-text-primary text-sm font-black uppercase tracking-tight group-hover:text-neon-green transition-colors">Promote as Featured</span>
                <p className="text-text-muted text-[11px] font-medium">Highlight this product on the store home page</p>
              </div>
            </label>
          </div>

          {/* Media */}
          <div className="glass-card p-6 md:p-8 space-y-6 shadow-xl border-dark-600/50">
            <div className="pb-4 border-b border-dark-600 mb-2">
              <h3 className="font-heading font-black text-lg text-text-primary flex items-center gap-3 uppercase tracking-tighter">
                <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-sm">03</span>
                Product Media
              </h3>
            </div>

            {/* Images Container */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-black opacity-70 block">Gallery Images (Max 5)</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* Existing */}
                {existingImages.map((url, i) => (
                  <div key={`exist-${i}`} className="relative group aspect-square">
                    <img src={url} alt="" className="w-full h-full rounded-xl object-cover border border-dark-600 shadow-sm" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-coral text-white text-base flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform z-10 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {/* Previews */}
                {imagePreviews.map((preview, i) => (
                  <div key={`new-${i}`} className="relative group aspect-square">
                    <img src={preview} alt="" className="w-full h-full rounded-xl object-cover border-2 border-neon-green/30 shadow-md" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-coral text-white text-base flex items-center justify-center shadow-lg z-10 font-bold"
                    >
                      ×
                    </button>
                    {uploadProgress[`img_${i}`] !== undefined && (
                      <div className="absolute inset-x-2 bottom-2 h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-md">
                        <div className="h-full bg-neon-green transition-all" style={{ width: `${uploadProgress[`img_${i}`]}%` }} />
                      </div>
                    )}
                  </div>
                ))}

                {/* Upload Trigger */}
                {(existingImages.length + imagePreviews.length < 5) && (
                  <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-dark-600 hover:border-neon-green/40 hover:bg-neon-green/5 cursor-pointer transition-all group">
                    <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-black uppercase text-text-muted tracking-tighter">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Video Container */}
            <div className="pt-6 border-t border-dark-600">
              <label className="text-[10px] uppercase tracking-widest font-black opacity-70 block mb-4">Product Video (Optional)</label>
              
              {videoPreview ? (
                <div className="relative group rounded-2xl overflow-hidden border border-dark-600 shadow-xl bg-black">
                  <video src={videoPreview} controls className="w-full aspect-video" preload="metadata" />
                  <button
                    type="button"
                    onClick={() => { setVideoFile(null); setVideoPreview(""); }}
                    className="absolute top-4 right-4 p-2.5 rounded-xl bg-dark-900/80 text-coral hover:bg-coral hover:text-white transition-all transform md:scale-0 group-hover:scale-100 font-bold"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                  {uploadProgress.video !== undefined && (
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20 overflow-hidden">
                      <div className="h-full bg-aqua transition-all" style={{ width: `${uploadProgress.video}%` }} />
                    </div>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed border-dark-600 hover:border-aqua/40 hover:bg-aqua/5 cursor-pointer transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-dark-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  </div>
                  <span className="text-text-primary text-sm font-black uppercase tracking-tight">Select Product Video</span>
                  <span className="text-text-muted text-[11px] mt-1 font-medium">MP4 or MOV Format • Up to 50MB</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-4 text-sm uppercase tracking-widest font-black disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-neon-green/10"
              id="submit-product-btn"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  Processing...
                </span>
              ) : (
                isEdit ? "Update Changes" : "Create Product"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-8 py-4 rounded-xl text-text-muted font-bold text-sm hover:bg-dark-600/50 transition-all border border-dark-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
