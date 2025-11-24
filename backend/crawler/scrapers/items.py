# Define here the models for your scraped items
#
# Items are containers for the data you scrape. They work like Python dictionaries
# but provide additional features like validation and cleaner syntax.
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class UwPageItem(scrapy.Item):
    """
    Template item for UW page data.

    Define the fields you want to extract from each page here.
    Each field can store any type of data (string, list, dict, etc.)

    TODO: Customize these fields based on what you want to scrape!
    """

    # Example fields (uncomment and modify as needed):

    # Page metadata
    # url = scrapy.Field()                    # The page URL
    # title = scrapy.Field()                  # Page title
    # timestamp = scrapy.Field()              # When the page was scraped

    # Content fields (examples - customize for your needs!)
    # heading = scrapy.Field()                # Main heading
    # description = scrapy.Field()            # Description text
    # body_text = scrapy.Field()              # Main content
    # images = scrapy.Field()                 # List of image URLs
    # links = scrapy.Field()                  # List of links found

    # UW-specific fields (examples)
    # department = scrapy.Field()             # Department name
    # contact_email = scrapy.Field()          # Contact information
    # office_hours = scrapy.Field()           # Office hours
    # phone = scrapy.Field()                  # Phone number

    pass  # Remove this when you add fields


class UwCourseItem(scrapy.Item):
    """
    Example item for course catalog data.

    You can create multiple item classes for different types of data!
    For example: courses, events, news articles, faculty profiles, etc.

    TODO: Add fields relevant to UW courses
    """

    # Example course fields:
    # course_code = scrapy.Field()            # e.g., "CSE 142"
    # course_name = scrapy.Field()            # e.g., "Computer Programming I"
    # credits = scrapy.Field()                # e.g., "5"
    # description = scrapy.Field()            # Course description
    # prerequisites = scrapy.Field()          # List of prerequisites
    # instructor = scrapy.Field()             # Instructor name
    # quarter = scrapy.Field()                # e.g., "Autumn 2024"

    pass  # Remove this when you add fields
