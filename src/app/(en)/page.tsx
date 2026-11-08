import LekhKit from '@/components/LekhKit';
import { SiteFooter } from '@/components/ContentPage';
import HomeBody, { HOME_FAQ } from '@/components/HomeBody';
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

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HOME_FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <LekhKit lead="Bold, italic, lists and emoji for your LinkedIn posts, with a live desktop and mobile preview." below={<HomeBody />} footer={<SiteFooter />} />
    </>
  );
}
