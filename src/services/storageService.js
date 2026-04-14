import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

/**
 * Upload a file to Firebase Storage with progress tracking
 * @param {File} file - The file to upload
 * @param {string} path - Storage path (e.g., 'products/images/filename.jpg')
 * @param {function} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} Download URL
 */
export function uploadFile(file, path, onProgress) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

/**
 * Upload multiple images with progress for each
 * @param {File[]} files 
 * @param {string} productId 
 * @param {function} onProgress - callback(index, progress)
 * @returns {Promise<string[]>} Array of download URLs
 */
export async function uploadProductImages(files, productId, onProgress) {
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split(".").pop();
    const path = `products/${productId}/images/${Date.now()}_${i}.${ext}`;
    const url = await uploadFile(file, path, (progress) => {
      if (onProgress) onProgress(i, progress);
    });
    urls.push(url);
  }
  return urls;
}

/**
 * Upload a product video
 * @param {File} file 
 * @param {string} productId 
 * @param {function} onProgress 
 * @returns {Promise<string>} Download URL
 */
export async function uploadProductVideo(file, productId, onProgress) {
  const ext = file.name.split(".").pop();
  const path = `products/${productId}/video/${Date.now()}.${ext}`;
  return uploadFile(file, path, onProgress);
}

/**
 * Delete a file from Firebase Storage by its download URL
 * @param {string} url - Firebase Storage download URL
 */
export async function deleteFile(url) {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    // Don't throw — deletion failures shouldn't break the flow
  }
}

/**
 * Compress an image before upload (client-side)
 * @param {File} file 
 * @param {number} maxWidth 
 * @param {number} quality 0-1
 * @returns {Promise<Blob>}
 */
export function compressImage(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
}
