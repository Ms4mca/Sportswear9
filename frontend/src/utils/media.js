import API_CONFIG from "../services/apiConfig";

export function resolveMediaUrl(path) {
  if (!path || typeof path !== "string") return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  const normalizedBase = API_CONFIG.BASE_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}
