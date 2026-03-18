"""
CCC Website — Frappe Builder Page JSON

This file defines the HOMEPAGE structure for import into
Frappe Builder as a "Builder Page" fixture.

HOW TO USE:
  1. Install the ccc_website app
  2. In Frappe Desk: Builder → New Page → Route: / → Save
  3. Open the page in Builder and use the Data Script below
  4. OR import this as a fixture (bench execute frappe.utils.fixtures.import_fixtures)

DATA SCRIPTS to add in Builder for each dynamic section:
"""

HOMEPAGE_DATA_SCRIPTS = {

    "services": """
data.services = frappe.get_all("CCC Service",
    filters={"is_published": 1},
    fields=["title", "description", "image"],
    order_by="display_order asc"
)
""",

    "testimonials": """
data.testimonials = frappe.get_all("CCC Testimonial",
    filters={"is_published": 1},
    fields=["quote", "author_name", "author_role"],
    order_by="display_order asc"
)
""",

    "news": """
data.news = frappe.get_all("CCC News Article",
    filters={"is_published": 1},
    fields=["title", "excerpt", "category", "image", "publish_date", "link_url"],
    order_by="publish_date desc",
    limit=3
)
""",

    "faqs": """
data.faqs = frappe.get_all("CCC FAQ",
    filters={"is_published": 1},
    fields=["question", "answer"],
    order_by="display_order asc"
)
""",

    "stats": """
data.stats = frappe.get_all("CCC Stat",
    fields=["label", "value"],
    order_by="display_order asc"
)
""",

    "process": """
data.steps = frappe.get_all("CCC Process Step",
    fields=["title", "description", "image", "step_number"],
    order_by="step_number asc"
)
""",

    "company": """
try:
    doc = frappe.get_single("CCC Company Settings")
    data.company = {
        "phone": doc.phone,
        "email": doc.email,
        "address": doc.address,
        "hero_tagline": doc.hero_tagline,
        "hero_title": doc.hero_title,
        "hero_subtitle": doc.hero_subtitle,
    }
except:
    data.company = {}
""",
}
