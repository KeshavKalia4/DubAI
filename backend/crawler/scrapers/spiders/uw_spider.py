"""
University of Washington Spider for RAG
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
    start_urls = [
        'https://www.washington.edu/'
    ]

    custom_settings = {
        'DOWNLOAD_DELAY': 2,
        'CONCURRENT_REQUESTS_PER_DOMAIN': 1,
        # No limits - crawl as much as possible
        # 'DEPTH_LIMIT': 2,  # Removed
        # 'CLOSESPIDER_PAGECOUNT': 10,  # Removed
        'FEEDS': {
            'output/uw_data.json': {
                'format': 'json',
                'encoding': 'utf8',
                'indent': 4,
            },
        },
    }

    def parse(self, response):
        # Extracting all values inside the URL's <body> tag
        contents = response.css('body ::text').getall()
        joined_contents = ' '.join(contents).strip()

        # Following all links found on the page
        for link in response.css('a::attr(href)').getall():
            yield response.follow(link, self.parse) # Recursively follow links

        # Saving the extracted data - yield
        yield {
            'url': response.url,
            'contents': joined_contents
        }
