from setuptools import setup, find_packages

with open("requirements.txt") as f:
    install_requires = f.read().strip().split("\n")

setup(
    name="ccc_website",
    version="1.0.0",
    description="CCC Facility Group Website App for Frappe Builder",
    author="CCC Facility Group",
    author_email="info@ccc-facility.de",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires,
)
