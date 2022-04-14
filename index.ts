import * as play from 'playwright';
import fs from 'fs';

const GeneratePDF = async (url: string, fileName: string) => {
  const playwright = play.chromium;
  let config = {
    args: ['--disable-setuid-sandbox', '--no-sandbox'],
    defaultViewport: {
      width: 375,
      height: 812,
      deviceScaleFactor: 1
    }
  };
  const browser = await playwright.launch(config);
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.emulateMedia({ media: 'print' });
  await page.goto(url, { waitUntil: 'networkidle' });
  const pdf = await page.pdf({
    width: '375px',
    scale: 1,
  });
  browser.close();
  // write file from Buffer
  const file = fs.createWriteStream(`./output/${fileName}`);
  file.write(pdf);
};

// Get URL from command line
const url = process.argv[2];
// Get file name from command line
const fileName = process.argv[3];

GeneratePDF(url || 'https://www.google.com', fileName || 'google.pdf').then(() => {
  console.log('PDF generated');
}).catch((err) => {
  console.log(err);
});