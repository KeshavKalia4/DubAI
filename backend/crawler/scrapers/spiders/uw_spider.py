"""
University of Washington Spider Template

This is a template spider for scraping UW websites.
Fill in the methods below as you learn Scrapy!

Documentation: https://docs.scrapy.org/en/latest/intro/tutorial.html
"""

import scrapy


class UwSpider(scrapy.Spider):
    """
    Spider for crawling University of Washington websites.

    The name attribute is used to identify the spider. You'll use this name
    when running the spider with: scrapy crawl uw
    """
    name = "uw"

    # allowed_domains restricts the spider to only crawl pages within these domains
    # This prevents your spider from accidentally crawling the entire internet!
    allowed_domains = ["washington.edu"]

    # start_urls is a list of URLs where the spider will begin crawling
    # TODO: Add your starting UW URLs here
    start_urls = [
        # Example: "https://www.washington.edu/",
        # Example: "https://www.washington.edu/about/",
    ]

    # Custom settings specific to this spider
    # These override the project-level settings in settings.py
    custom_settings = {
        # Be respectful! UW servers need breathing room
        'DOWNLOAD_DELAY': 2,
        'CONCURRENT_REQUESTS_PER_DOMAIN': 1,

        # Export your scraped data to a JSON file
        # The file will be created when you run the spider
        'FEEDS': {
            'output/uw_data.json': {
                'format': 'json',
                'encoding': 'utf8',
                'indent': 4,
            },
        },
    }

    def parse(self, response):
        """
        Default callback method for processing downloaded responses.

        This method is called for each URL in start_urls, and for each
        URL discovered by following links (if you implement link following).

        Args:
            response: The response object containing the downloaded page

        Yields:
            dict: Scraped data items
            scrapy.Request: New requests to follow links

        TODO: Implement your parsing logic here!

        Learn about:
        - CSS Selectors: response.css('selector')
        - XPath Selectors: response.xpath('//path')
        - Extracting text: .get() for single item, .getall() for list

        Example patterns (uncomment and modify as you learn):
        """

        # ─── EXAMPLE: Extract page title ───────────────────────────────────────
        # page_title = response.css('title::text').get()
        # self.logger.info(f'Page title: {page_title}')

        # ─── EXAMPLE: Extract all links on the page ───────────────────────────
        # links = response.css('a::attr(href)').getall()
        # for link in links:
        #     self.logger.info(f'Found link: {link}')

        # ─── EXAMPLE: Yield a data item ───────────────────────────────────────
        # yield {
        #     'url': response.url,
        #     'title': page_title,
        #     'timestamp': datetime.now().isoformat(),
        # }

        # ─── EXAMPLE: Follow links to other pages ─────────────────────────────
        # for link in response.css('a::attr(href)').getall():
        #     # This tells Scrapy to download the linked page and
        #     # call parse() on it as well
        #     yield response.follow(link, callback=self.parse)

        pass  # Remove this when you add your implementation

    def parse_detail_page(self, response):
        """
        Example method for parsing a detail page.

        You can create multiple parse methods for different types of pages!
        For example:
        - parse_course_listing() for course catalog pages
        - parse_department_page() for department pages
        - parse_news_article() for news articles

        To use a custom callback, pass it when following links:
        yield response.follow(url, callback=self.parse_detail_page)

        TODO: Implement detail page parsing if needed
        """
        pass

    def closed(self, reason):
        """
        Called when the spider closes.

        Useful for cleanup tasks like:
        - Logging statistics
        - Closing database connections
        - Sending completion notifications

        Args:
            reason: The reason the spider was closed
        """
        self.logger.info(f'Spider closed: {reason}')
        # TODO: Add any cleanup logic here if needed
