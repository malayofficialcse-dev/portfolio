import { SectionPage } from '@/pages/SectionPage';
import { adminPages } from '@/data/siteData';

export function BooksAdminPage() {
  return <SectionPage page={adminPages.books} />;
}
