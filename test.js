const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const superagent = require('superagent');
const url = require('url');
const querystring = require('querystring');

const deviceInfo = devices['iPhone XR'];

const serverURL =
  'https://sc.ftqq.com/SCU9399Tf68579c48efce0e83d5798da3cafcfc7594b6376cdb65.send';

const pageURL =
  'https://ssl.mall.cmbchina.com/_Cl5_/Product/Detail?ProductCode=S1H-50T-30U-09_015';

const getColorSelector = index =>
  `#correct-wrap > div.wrap.not-touching > div:nth-child(1) > div > div > div.custom-popup-content.custom-popup-content-show > div > div.sku-selection-wrap > div.sku-group-block.parent-sku-group > div > span:nth-child(${index})`;

const colorList = [
  { name: '紫色', selector: getColorSelector(5) },
  { name: '绿色', selector: getColorSelector(6) },
];

const getStorageSelector = index =>
  `#correct-wrap > div.wrap.not-touching > div:nth-child(1) > div > div > div.custom-popup-content.custom-popup-content-show > div > div.sku-selection-wrap > div.sku-group-block.child-sku-group > div > span:nth-child(${index})`;

const storageList = [
  { name: '64GB', selector: getStorageSelector(1) },
  { name: '128GB', selector: getStorageSelector(2) },
];

const reportToWeixin = async ({ storage, color, url }) => {
  const param = {
    text: `${color}(${storage})有货啦`,
    desp: url,
  };

  try {
    await superagent.get(`${serverURL}?${querystring.stringify(param)}`);
  } catch (err) {
    console.error(err);
  }
};

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.emulate(deviceInfo);
  await page.goto(pageURL, { waitUntil: 'domcontentloaded' });

  await page.waitFor(2000);
  await page.click(
    '#correct-wrap > div.wrap.not-touching > div:nth-child(1) > div > section:nth-child(3) > div:nth-child(1)'
  );
  await page.waitForSelector('.custom-pop-wrap');
  await page.waitFor(1000);

  // choose 64GB storage
  for (const { name: storage, selector: storageSelector } of storageList) {
    await page.click(storageSelector);
    await page.waitFor(300);

    for (const { name: color, selector: colorSelector } of colorList) {
      await page.click(colorSelector);
      await page.waitFor(500);

      const inStock = await page.evaluate(selector => {
        return !document.querySelector(selector);
      }, '.disable-buy');

      if (inStock) {
        await page.waitFor(600);
        reportToWeixin({ storage, color, url: page.url() });
      }
    }
  }

  await browser.close();
})();
