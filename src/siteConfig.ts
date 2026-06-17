const configuredHeroVideo = import.meta.env.VITE_HERO_VIDEO_SRC?.trim();
const baseUrl = import.meta.env.BASE_URL;

function withBase(path: string) {
  if (/^(?:https?:|data:|blob:)/.test(path)) {
    return path;
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
}

export const siteMedia = {
  heroVideoSrc: configuredHeroVideo
    ? withBase(configuredHeroVideo)
    : withBase('/media/hero-opening-feishu-20260614.mp4'),
  featureVideos: {
    workExperience: withBase('/media/feature-cable.mp4'),
    projectExperience: withBase('/media/feature-flower-sea.mp4'),
    dreamScene: withBase('/media/feature-polar.mp4'),
  },
} as const;
