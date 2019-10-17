const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const superagent = require('superagent');
const url = require('url');
const querystring = require('querystring');

const deviceInfo = devices['iPhone XR'];

const serverURL =
  'https://sc.ftqq.com/SCU9399Tf68579c48efce0e83d5798da3cafcfc7594b6376cdb65.send';

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.emulate(deviceInfo);
  await page.goto(
    'https://ssl.mall.cmbchina.com/_Cl5_/Product/Detail?ProductCode=S1H-50T-30U-09_015',
    { waitUntil: 'domcontentloaded' }
  );

  await page.waitFor(2000);
  await page.click(
    '#correct-wrap > div.wrap.not-touching > div:nth-child(1) > div > section:nth-child(3) > div:nth-child(1)'
  );
  await page.waitForSelector('.custom-pop-wrap');
  await page.waitFor(1000);
  await page.click(
    '#correct-wrap > div.wrap.not-touching > div:nth-child(1) > div > div > div.custom-popup-content.custom-popup-content-show > div > div.sku-selection-wrap > div.sku-group-block.parent-sku-group > div > span:nth-child(5)'
  );
  await page.waitFor(200);
  await page.click(
    '#correct-wrap > div.wrap.not-touching > div:nth-child(1) > div > div > div.custom-popup-content.custom-popup-content-show > div > div.sku-selection-wrap > div.sku-group-block.child-sku-group > div > span:nth-child(1)'
  );
  await page.waitFor(200);

  const inStock = await page.evaluate(selector => {
    return !document.querySelector(selector);
  }, '.disable-buy');

  if (inStock) {
    const param = {
      text: '紫色有货啦',
      desp: page.url(),
    };

    try {
      await superagent.get(`${serverURL}?${querystring.stringify(param)}`);
    } catch (err) {
      console.error(err);
    }
  }

  await browser.close();
})();
