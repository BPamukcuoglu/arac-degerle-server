const cheerio = require("cheerio");


module.exports = class Sahibinden {

  constructor(browser, page) {
    this.browser = browser;
    this.page = page;

  }
  
  
  async scrap(car) {
    const carSpecs = car.replaceAll("*", " ").split(" ");
    console.log(carSpecs)
    const url = `https://www.sahibinden.com/${carSpecs[0]}-${carSpecs[1]}/${carSpecs[2]}/${carSpecs[3]}?a5_max=${Number(carSpecs[5]) + 1}&a4_max=${Number(carSpecs[4]) * 1.5}&a4_min=${Number(carSpecs[4]) * .5}&a5_min=${Number(carSpecs[5]) - 1}`;
    console.log(url)
    const allSales = [];
    let numberOfSales = 0;
    let totalPrice = 0;
    let avrPrice = 0;
    await this.page.goto(url);
    await this.page.waitFor(1000);

    const response = await this.page.content();
    const $ = cheerio.load(response)

    const list = $('.searchResultsRowClass');
    const sales = list.find('tr');
    sales.each((_, el) => {
      let sale = $(el).text().trim().replaceAll("\n", "");
      sale = sale.split("        ");
      let object = [];
      sale.forEach(e => {
        if (e != "") object.push(e.trim());
      })
      allSales.push(object);
    })

    allSales.forEach((s) => {
      if(s.length){
        s.forEach(t => {
          if(t.includes(" TL")){
            t = t.replace("TL", "");
            t = t.replace(".", "");
            t = t.trim();
            try {
              t = Number(t);
              numberOfSales++;
              totalPrice += Number(t)
            } catch (error) {
            }
          }
        })
      }
    })

    avrPrice = (totalPrice/numberOfSales) * .95;

    
    await this.page.close();
    
    return avrPrice;

  }

};



