import fs from 'node:fs';
import path from 'node:path';
import { site } from '../data/site';

const publisher = site.integrations.adsensePublisherId;
const target = path.join(process.cwd(), 'public', 'ads.txt');
const line = publisher
  ? `google.com, ${publisher}, DIRECT, f08c47fec0942fa0`
  : '# AdSense publisher ID is not configured. Set NEXT_PUBLIC_ADSENSE_PUBLISHER_ID before launch.';

fs.writeFileSync(target, `${line}\n`, 'utf8');
console.log(publisher ? 'generate:ads-txt wrote the AdSense seller line' : 'generate:ads-txt wrote a placeholder comment');
