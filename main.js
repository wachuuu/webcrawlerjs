const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const base = 'https://www.morele.net';
const url = base + '/kategoria/klocki-lego-1045/'

const maxVisits = 40; // maximum of links visited 
const visited = new Set();
const allProducts = [];
let q;

const queue = (concurrency = 5) => {
  let running = 0;
  const tasks = [];

  return {
    enqueue: async (task, ...params) => {
      tasks.push({ task, params });
      if (running >= concurrency) {
        return;
      }

      ++running;
      while (tasks.length) {
        const { task, params } = tasks.shift();
        await task(...params);
      }
      --running;
    },
  };
};

const getHtml = async url => {
  const { data } = await axios.get(url);
  return data;
};

const extractContent = $ =>
  $('.cat-product-content')
    .map((_, product) => {
      const $product = $(product);
      const $price = $product.find('.cat-product-price .price-new').text().match(/\d+( ?\d*)*,?\d*/)
      const $pieces = $product.find('.cat-product-feature:contains("Liczba elementów:")').text().match(/\d+/)
      return {
        title: $product.find('.cat-product-name a').attr('title'),
        price: $price ? parseFloat($price[0].replaceAll(/ /g, '').replace(/,/g, '.')) : undefined,
        pieces: $pieces ? parseInt($pieces[0]) : undefined,
        pricePerPiece: ($price && $pieces) ? parseFloat($price[0].replaceAll(/ /g, '').replace(/,/g, '.'))/parseInt($pieces[0]) : undefined
      };
    })
    .toArray();

const extractLinks = $ => [
  ...new Set(
    $('.pagination-btn')
      .map((_, a) => base + $(a).attr('href'))
      .toArray()
  ),
];

const crawl = async url => {
  visited.add(url);
  console.log('Crawling: ', url);

  const html = await getHtml(url);
  const $ = cheerio.load(html);
  const content = extractContent($);
  const links = extractLinks($);
  links
    .filter(link => !visited.has(link))
    .forEach(link => {
      q.enqueue(crawlTask, link);
    });
  allProducts.push(...content);
};

const crawlTask = async url => {
  if (visited.size >= maxVisits) {
    finish()
    return;
  }

  if (visited.has(url)) {
    return;
  }

  await crawl(url);
};

const start = () => { 
  q = queue();
  q.enqueue(crawlTask, url);
}

const finish = () => {
  fs.writeFileSync('products.json', JSON.stringify(allProducts.sort((a, b) => a.pricePerPiece - b.pricePerPiece), null, 4))
}

start()
