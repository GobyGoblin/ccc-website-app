app_name = "ccc_website"
app_title = "CCC Website"
app_publisher = "CCC Facility Group"
app_description = "CCC Facility Group Website App for Frappe Builder"
app_email = "info@ccc-facility.de"
app_license = "MIT"

# Website assets - loaded on every public page
app_include_css = ["/assets/ccc_website/css/ccc_website.css"]
app_include_js = ["/assets/ccc_website/js/ccc_website.js"]

# DocType fixtures for export
fixtures = [
    {"dt": "CCC Service"},
    {"dt": "CCC Testimonial"},
    {"dt": "CCC News Article"},
    {"dt": "CCC FAQ"},
    {"dt": "CCC Stat"},
    {"dt": "CCC Process Step"},
    {"dt": "CCC Contact Person"},
    {"dt": "CCC Company Settings"},
]
