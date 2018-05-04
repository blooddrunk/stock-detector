const HCCrawler = require('headless-chrome-crawler')
const request = require('superagent')
const url = require('url')
const querystring = require('querystring')

const serverURL =
  'https://sc.ftqq.com/SCU9399Tf68579c48efce0e83d5798da3cafcfc7594b6376cdb65.send'

HCCrawler.launch({
  evaluatePage: () => ({
    inStock: $('#soldOut_btnArea').hasClass('non-display'),
  }),
  onSuccess: ({ result, options }) => {
    if (result && result.inStock) {
      console.log('in stock')
      const param = {
        text: '镜片有货啦',
        desp: options.url,
      }
      request
        .get(`${serverURL}?${querystring.stringify(param)}`)
        .end((err, res) => {
          console.error(err)
        })
    }
  },
}).then(crawler => {
  crawler.queue({
    url: 'https://www.jins.com/jp/item/MUF-18S-318_392.html',
  })
  crawler.onIdle().then(() => crawler.close())
})
