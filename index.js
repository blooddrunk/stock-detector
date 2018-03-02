const HCCrawler = require('headless-chrome-crawler')
const request = require('superagent')
const url = require('url')
const querystring = require('querystring')

const serverURL =
  'https://sc.ftqq.com/SCU9399Tf68579c48efce0e83d5798da3cafcfc7594b6376cdb65.send'

HCCrawler.launch({
  evaluatePage: () => ({
    error: $('.errorbox').text(),
  }),
  onSuccess: ({ result, options }) => {
    if (!result || !result.error || result.error !== 'Out of Stock') {
      console.log('in stock')
      const query = url.parse(options.url, true).query
      let title = 'bandwagonhost'
      if (query.pid === '43') {
        title += ' - KVM'
      } else if (query.pid === '56') {
        title += ' - CN2'
      }
      const param = {
        text: title,
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
    url: 'https://bwh1.net/cart.php?a=add&pid=43',
  })
  crawler.queue({
    url: 'https://bwh1.net/cart.php?a=add&pid=56',
  })
  crawler.onIdle().then(() => crawler.close())
})
