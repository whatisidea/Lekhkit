import LekhKit from '@/components/LekhKit';
import { SiteFooter } from '@/components/ContentPage';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

/* Structured data so Google understands this is a free web tool. Static content, no visitor input. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires a modern web browser',
  inLanguage: 'en',
  isAccessibleForFree: true,
  image: SITE_URL + '/icon-512.png',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LekhKit footer={<SiteFooter />} />
    </>
  );
}
