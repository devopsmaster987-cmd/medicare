const defaultSiteUrl = 'https://medicareclear.top';
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const rawAdsClientId =
  process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID?.trim() ||
  process.env.ADSENSE_CLIENT_ID?.trim() ||
  '';
const adsensePublisherId = rawAdsClientId.startsWith('ca-')
  ? rawAdsClientId.slice(3)
  : rawAdsClientId;
const adsenseSlotId =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID?.trim() ||
  process.env.ADSENSE_SLOT_ID?.trim() ||
  '';
const adsRequested =
  process.env.NEXT_PUBLIC_ADS_ENABLED?.trim() === 'true' ||
  process.env.ADS_ENABLED?.trim() === 'true';
const adsEnabled = adsRequested && adsensePublisherId !== '' && adsenseSlotId !== '';

export const site = {
  siteName: 'MedicareClear',
  ownerName: 'Abdul Samad',
  contactEmail: 'ihsanaslamm@gmail.com',
  location: 'Punjab, Pakistan',
  mailingAddress: 'Punjab, Pakistan',
  governingLaw: 'Punjab, Pakistan',
  siteUrl: configuredSiteUrl || defaultSiteUrl,
  siteUrlIsPlaceholder: false,
  socialProfiles: [] as string[],
  responseTime: '2 to 3 business days',
  analytics: {
    provider: 'plausible' as const,
    domain: '',
  },
  integrations: {
    formspreeId: '',
    buttondownUser: '',
    adsensePublisherId,
    adsenseSlotId,
    indexNowKey: '',
    googleSiteVerification: '',
    bingSiteVerification: '',
  },
  features: {
    ads: adsEnabled,
    emailCapture: false,
    emailCaptureProvider: 'buttondown' as const,
    allowTrainingCrawlers: true,
  },
} as const;

export type SiteConfig = typeof site;
