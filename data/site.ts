export const site = {
  siteName: 'MedicareClear',
  ownerName: 'Abdul Samad',
  contactEmail: 'ihsanaslamm@gmail.com',
  location: 'Punjab, Pakistan',
  mailingAddress: 'Punjab, Pakistan',
  governingLaw: 'Punjab, Pakistan',
  siteUrl: 'https://medicareclear.example',
  siteUrlIsPlaceholder: true,
  socialProfiles: [] as string[],
  responseTime: '2 to 3 business days',
  analytics: {
    provider: 'plausible' as const,
    domain: '',
  },
  integrations: {
    formspreeId: '',
    buttondownUser: '',
    adsensePublisherId: '',
    adsenseSlotId: '',
    indexNowKey: '',
    googleSiteVerification: '',
    bingSiteVerification: '',
  },
  features: {
    ads: false,
    emailCapture: false,
    emailCaptureProvider: 'buttondown' as const,
    allowTrainingCrawlers: true,
  },
} as const;

export type SiteConfig = typeof site;
