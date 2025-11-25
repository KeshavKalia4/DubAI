# UW Crawler - Web Scraping for DubAI

A Scrapy-based web scraper for collecting data from University of Washington websites to feed into the DubAI RAG system.

## Project Structure

```
crawler/
├── scrapy.cfg              # Scrapy deployment configuration
├── README.md               # This file
└── scrapers/               # Main Python package
    ├── __init__.py
    ├── items.py            # Data models (define what to scrape)
    ├── middlewares.py      # Request/response processing
    ├── pipelines.py        # Data processing pipelines
    ├── settings.py         # Project settings
    └── spiders/            # Your spider implementations
        ├── __init__.py
        └── uw_spider.py    # Template UW spider (start here!)
```

## Quick Start

### 1. Activate the Virtual Environment

From the `backend` directory:

```bash
source venv/bin/activate
```

### 2. Navigate to the Crawler Project

```bash
cd crawler
```

### 3. Test Your Spider

Run the template spider (won't scrape anything yet - you need to add URLs first):

```bash
scrapy crawl uw
```

### 4. Learning Path

Follow this order as you learn Scrapy:

1. **Watch your Scrapy tutorial series** - Get familiar with the concepts
2. **Edit [items.py](scrapers/items.py)** - Define what data you want to scrape
3. **Edit [spiders/uw_spider.py](scrapers/spiders/uw_spider.py)** - Implement your scraping logic
4. **Run and test** - Use `scrapy crawl uw` to test
5. **Configure [settings.py](scrapers/settings.py)** - Adjust behavior as needed
6. **Set up [pipelines.py](scrapers/pipelines.py)** - Process and store your scraped data

## Essential Scrapy Commands

```bash
# Run a spider
scrapy crawl uw

# Run and save output to a file
scrapy crawl uw -O output/data.json

# Open Scrapy shell to test selectors on a page
scrapy shell "https://www.washington.edu"

# List all available spiders
scrapy list

# Check your Scrapy version
scrapy version
```

## Configuration Tips

### Respectful Scraping

The spider is pre-configured with respectful defaults:

- `DOWNLOAD_DELAY = 2` - 2 second delay between requests
- `CONCURRENT_REQUESTS_PER_DOMAIN = 1` - One request at a time per domain
- `ROBOTSTXT_OBEY = True` - Respects robots.txt

**Always follow these guidelines:**
- Respect rate limits
- Check robots.txt
- Identify your bot with a user agent
- Only scrape public information
- Cache responses during development

### Output Formats

Scrapy supports multiple output formats:

```bash
# JSON
scrapy crawl uw -O output/data.json

# JSON Lines (one object per line - better for large datasets)
scrapy crawl uw -O output/data.jsonl

# CSV
scrapy crawl uw -O output/data.csv

# XML
scrapy crawl uw -O output/data.xml
```

## Testing Selectors

Before implementing your spider, test your CSS/XPath selectors in the Scrapy shell:

```bash
# Open a page in Scrapy shell
scrapy shell "https://www.washington.edu"

# Test CSS selectors
>>> response.css('title::text').get()
>>> response.css('h1::text').getall()

# Test XPath selectors
>>> response.xpath('//title/text()').get()
>>> response.xpath('//a/@href').getall()
```

## Common Patterns

### Following Links

```python
# Follow all links on a page
for link in response.css('a::attr(href)').getall():
    yield response.follow(link, callback=self.parse)

# Follow specific links
for link in response.css('.course-link::attr(href)').getall():
    yield response.follow(link, callback=self.parse_course)
```

### Extracting Data

```python
# Single item
title = response.css('h1::text').get()
title = response.css('h1::text').get(default='No title')

# Multiple items
links = response.css('a::attr(href)').getall()

# With transformations
price = response.css('.price::text').get()
price_float = float(price.replace('$', ''))
```

### Yielding Items

```python
from scrapers.items import UwPageItem

# Yield a dictionary
yield {
    'title': title,
    'url': response.url,
}

# Or use an Item class
item = UwPageItem()
item['title'] = title
item['url'] = response.url
yield item
```

## Next Steps

1. **Define your data models** in [items.py](scrapers/items.py)
2. **Implement your spider** in [spiders/uw_spider.py](scrapers/spiders/uw_spider.py)
3. **Set up data pipelines** in [pipelines.py](scrapers/pipelines.py) to:
   - Clean and validate data
   - Store data in your database
   - Export to different formats
4. **Configure settings** in [settings.py](scrapers/settings.py)

## Resources

- [Scrapy Documentation](https://docs.scrapy.org/)
- [Scrapy Tutorial](https://docs.scrapy.org/en/latest/intro/tutorial.html)
- [CSS Selector Reference](https://www.w3schools.com/cssref/css_selectors.php)
- [XPath Tutorial](https://www.w3schools.com/xml/xpath_intro.asp)
- [Scrapy Best Practices](https://docs.scrapy.org/en/latest/topics/practices.html)

## Integration with DubAI

Once you've scraped the data, you can:

1. Process and clean it using pipelines
2. Store it in your Supabase database
3. Use it as supplemental context for your RAG system
4. Update the data regularly with scheduled crawls

## Notes

- The `output/` directory will be created automatically when you run spiders
- Add `output/` to `.gitignore` to avoid committing scraped data
- Always test on a small sample before running large scrapes
- Monitor your spider's behavior and adjust rate limits as needed
