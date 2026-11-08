const INSTAGRAM_IMAGE_DOMAINS = ['instagram.com', 'cdninstagram.com', 'fbcdn.net'];

export function proxiedImageUrl(value: string | null | undefined) {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return value;
    const host = url.hostname.replace(/^www\./i, '').toLowerCase();
    const isInstagram = INSTAGRAM_IMAGE_DOMAINS.some(
      (domain) => host === domain || host.endsWith(`.${domain}`),
    );
    return isInstagram ? `/api/media/image?url=${encodeURIComponent(value)}` : value;
  } catch {
    return value;
  }
}
