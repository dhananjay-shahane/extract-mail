import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

interface ScrapeResult {
  title?: string;
  link?: string;
  address?: string;
  website?: string; // Add website field
}

export async function POST(request: Request) {
  const { query, location } = await request.json();

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(query)} ${encodeURIComponent(location)}`);

    await page.waitForSelector('.Nv2PK', { timeout: 5000 });

    const results: ScrapeResult[] = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.Nv2PK')).map(store => ({
        title: store.querySelector('.qBF1Pd')?.textContent?.trim() || undefined,
        link: store.querySelector<HTMLAnchorElement>('a.hfpxzc')?.href,
        address: Array.from(store.querySelectorAll('.W4Efsd:first-child > span:first-child'))
          .map(span => span.textContent?.trim())
          .join(' '),
        website: store.querySelector<HTMLAnchorElement>('a.lcr4fd.S9kvJb')?.href || undefined // Updated selector
      }));
    });

    await browser.close();
    return NextResponse.json({ success: true, results });
    
  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
