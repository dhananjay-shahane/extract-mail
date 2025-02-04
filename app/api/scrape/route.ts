// app/api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const emails = await scrapeEmails(url);
    return NextResponse.json({ emails }, { status: 200 });
  } catch (error) {
    console.error('Scraping Error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape emails' },
      { status: 500 }
    );
  }
}

async function scrapeEmails(url: string) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    
    // Block unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      ['image', 'stylesheet', 'font', 'media'].includes(req.resourceType()) 
        ? req.abort() 
        : req.continue();
    });

    await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 20000  // Reduced from 30s to 20s
    });

    // Get both HTML content and mailto links
    const [htmlContent, mailtoLinks] = await Promise.all([
      page.content(),
      page.$$eval('a[href^="mailto:"]', anchors => 
        anchors.map(a => a.href.replace(/^mailto:/i, ''))
      ),
    ]);

    // Combine extraction methods
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
    const textEmails = htmlContent.match(emailRegex) || [];
    const allEmails = [...textEmails, ...mailtoLinks];

    // Normalize and deduplicate
    const normalizedEmails = allEmails.map(email => email.toLowerCase());
    const uniqueEmails = Array.from(new Set(normalizedEmails));

    return uniqueEmails.filter(email => isValidEmail(email));
  } finally {
    if (browser) await browser.close();
  }
}

// Additional validation
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}