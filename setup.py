from setuptools import setup, find_packages

setup(
    name="caption-per-book",
    version="0.1",
    packages=find_packages(where=".github/plugins"),
    package_dir={"": ".github/plugins"},
    entry_points={
        "mkdocs.plugins": [
            "caption-per-book = caption_per_book.caption_per_book:CaptionPerBookPlugin",
        ]
    },
)