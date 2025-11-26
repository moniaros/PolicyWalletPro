// Image optimization utilities for mobile performance
export function getOptimizedImageUrl(
  url: string,
  width: number,
  height?: number,
  quality: number = 80
): string {
  // For local assets, return as-is
  if (url.startsWith("/") || url.startsWith(".")) {
    return url;
  }

  // For external URLs, add optimization parameters (e.g., for CDN)
  const params = new URLSearchParams();
  params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  params.set("q", quality.toString());

  // This would connect to image CDN in production
  return `${url}?${params.toString()}`;
}

export function generateSrcSet(
  baseUrl: string,
  sizes: number[] = [320, 640, 1280]
): string {
  return sizes
    .map((size) => `${getOptimizedImageUrl(baseUrl, size)} ${size}w`)
    .join(", ");
}

// WebP detection for modern image format
export function supportsWebP(): boolean {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").indexOf("image/webp") === 5;
}

// Lazy loading helper
export function observeLazyImages() {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || "";
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}
