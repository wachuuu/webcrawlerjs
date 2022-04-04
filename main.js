const axios = require('axios');
const cheerio = require('cheerio');

const base = 'https://www.morele.net';
const url = base + '/kategoria/klocki-lego-1045/'

const maxVisits = 5; // maximum of links visited 
const visited = new Set();
const allProducts = [];

const getHtml = async url => {
  const { data } = await axios.get(url);
  return data;
};

const extractContent = $ =>
  $('.cat-product-content')
    .map((_, product) => {
      const $product = $(product);
      return {
        title: $product.find('.cat-product-name a').attr('title'),
        price: $product.find('.cat-product-price .price-new').text().match(/\d+,?\d*/)[0],
        pieces: $product.find('.cat-product-feature:contains("Liczba elementów:")').text().match(/\d+/)[0],
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
  console.log('Crawl: ', url);

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

// Change the default concurrency or pass it as param 
const queue = (concurrency = 2) => {
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

const crawlTask = async url => {
  if (visited.size >= maxVisits) {
    console.log('Over Max Visits, exiting');
    console.log('end ', allProducts.length)
    console.log(allProducts)
    return;
  }

  if (visited.has(url)) {
    return;
  }

  await crawl(url);
};

const q = queue();
q.enqueue(crawlTask, url);