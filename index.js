const puppeteer = require("puppeteer");
const Sahibinden = require("./sahibinden.js");
var express = require('express');


var app = express();

app.get('/:car', (request, response) => {
  (async () => {
    let browser;
    let page;

    try {
      browser = await puppeteer.launch({
        headless: true
      });

      page = await browser.newPage();

      const sahibinden = new Sahibinden(browser, page);
      const scrapResult = await sahibinden.scrap(request.params.car);
      response.status(200).json({ "value": Number(scrapResult).toFixed(0) })
      
    } catch (error) {
      response.status(400).error("Network Error!")
    } finally {
      await browser.close();
    }

  })();
});

var port = process.env.PORT || 8080;
app.listen(port, function () {})
app.co


