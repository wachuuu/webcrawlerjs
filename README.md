# webcrawlerjs
Web Crawling and then Scraping [morele.net](https://www.morele.net/kategoria/klocki-lego-1045/) using Node.js

This simple crawler/scraper starts in Lego category of the [morele.net](https://www.morele.net/kategoria/klocki-lego-1045/) shop, finds links to another pages and extracts data from them. In this case I use it to calculate price of one brick in the Lego set.

After scraping all subsites or exceeding visiting limit, program will sort extracted data and write it in `products.json` file. On the top of the file you can find lego sets with lowest price-per-piece ratio.

I've implemented queuing system that allows us to process data asynchronously, but with concurrency limit. With every request there are new potential subsites to visit, concurrency limit ensures that we won't utilize all subsites at once and end process

### Setup
Install packages using `npm`
```
$> npm install
```

Run script
```
$> node main.js
```
