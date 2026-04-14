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
    <div className="py-6 md:py-10" id="product-form-page">
      <div className="container-app max-w-2xl">
        <h1 className="font-heading font-bold text-2xl md:text-3xl text-text-primary mb-2">
          {isEdit ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-text-muted text-sm mb-8">
          {isEdit ? "Update the product details below" : "Fill in the details to add a new guppy"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="glass-card p-5 space-y-5">
            <h3 className="font-heading font-semibold text-text-primary flex items-center gap-2">
              🐟 Basic Info
            </h3>

            <div>
              <label htmlFor="name" className="form-label">Product Name *</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Red Dragon Guppy Pair"
                className="form-input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="form-label">Price (₹) *</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="150"
                  className="form-input"
                  min="1"
                  required
                />
              </div>
              <div>
                <label htmlFor="stock" className="form-label">Stock *</label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="10"
                  className="form-input"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the guppy — color, fins, breeding details..."
                className="form-input min-h-[120px] resize-y"
                rows={4}
              />
            </div>
          </div>

          {/* Classification */}
          <div className="glass-card p-5 space-y-5">
            <h3 className="font-heading font-semibold text-text-primary flex items-center gap-2">
              📂 Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category" className="form-label">Category</label>
                <select id="category" name="category" value={form.category} onChange={handleChange} className="form-select">
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="type" className="form-label">Type</label>
                <select id="type" name="type" value={form.type} onChange={handleChange} className="form-select">
                  {TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="color" className="form-label">Color</label>
                <select id="color" name="color" value={form.color} onChange={handleChange} className="form-select">
                  {COLORS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="age" className="form-label">Age</label>
                <input id="age" name="age" value={form.age} onChange={handleChange} placeholder="e.g., 3-4 months" className="form-input" />
              </div>
              <div>
                <label htmlFor="size" className="form-label">Size</label>
                <input id="size" name="size" value={form.size} onChange={handleChange} placeholder="e.g., 3-4 cm" className="form-input" />
              </div>
              <div>
                <label htmlFor="breedingInfo" className="form-label">Breeding Info</label>
                <input id="breedingInfo" name="breedingInfo" value={form.breedingInfo} onChange={handleChange} placeholder="e.g., F5 generation" className="form-input" />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-dark-700/50 border border-dark-600 hover:border-dark-400 transition-colors">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded accent-neon-green"
              />
              <div>
                <span className="text-text-primary text-sm font-medium">Featured Product</span>
                <p className="text-text-muted text-xs">Show on homepage carousel</p>
              </div>
            </label>
          </div>

          {/* Images */}
          <div className="glass-card p-5 space-y-5">
            <h3 className="font-heading font-semibold text-text-primary flex items-center gap-2">
              📸 Images
            </h3>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-text-muted text-xs mb-2">Current Images</p>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="" className="w-20 h-20 rounded-xl object-cover border border-dark-600" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-coral text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Image Previews */}
            {imagePreviews.length > 0 && (
              <div>
                <p className="text-text-muted text-xs mb-2">New Images</p>
                <div className="flex flex-wrap gap-3">
                  {imagePreviews.map((preview, i) => (
                    <div key={i} className="relative group">
                      <img src={preview} alt="" className="w-20 h-20 rounded-xl object-cover border border-neon-green/30" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-coral text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                      {uploadProgress[`img_${i}`] !== undefined && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark-600 rounded-b-xl overflow-hidden">
                          <div className="h-full bg-neon-green transition-all" style={{ width: `${uploadProgress[`img_${i}`]}%` }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-dark-500 hover:border-neon-green/30 cursor-pointer transition-colors bg-dark-700/30">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted mb-2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-text-secondary text-sm font-medium">Tap to upload images</span>
              <span className="text-text-muted text-xs mt-1">JPG, PNG • Max 5 images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Video */}
          <div className="glass-card p-5 space-y-5">
            <h3 className="font-heading font-semibold text-text-primary flex items-center gap-2">
              🎥 Video (Optional)
            </h3>

            {videoPreview && (
              <div className="relative">
                <video src={videoPreview} controls className="w-full rounded-xl aspect-video" preload="metadata" />
                <button
                  type="button"
                  onClick={() => { setVideoFile(null); setVideoPreview(""); }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-dark-900/70 text-coral hover:bg-coral hover:text-white transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
                {uploadProgress.video !== undefined && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-dark-600 rounded-b-xl overflow-hidden">
                    <div className="h-full bg-neon-green transition-all" style={{ width: `${uploadProgress.video}%` }} />
                  </div>
                )}
              </div>
            )}

            {!videoPreview && (
              <label className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-dark-500 hover:border-aqua/30 cursor-pointer transition-colors bg-dark-700/30">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted mb-2">
                  <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <span className="text-text-secondary text-sm font-medium">Tap to upload video</span>
                <span className="text-text-muted text-xs mt-1">MP4, MOV • Max 50MB</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              id="submit-product-btn"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                  </svg>
                  {isEdit ? "Updating..." : "Adding..."}
                </span>
              ) : (
                isEdit ? "Update Product" : "Add Product"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="btn-ghost py-3.5 px-6"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
