import re
from mkdocs.plugins import BasePlugin
from bs4 import BeautifulSoup

FIGURE_RE = re.compile(r'!\[(.*?)\]\((.*?)\)')
TABLE_PREFIX_RE = re.compile(r'^\s*Table:\s*(.+)$', re.IGNORECASE | re.MULTILINE)

class CaptionPerBookPlugin(BasePlugin):
    """
    Continuous figure/table numbering per book respecting nav order.
    Debug logging enabled.
    """

    def on_nav(self, nav, config, files):
        """Collect pages in nav order and precompute per-page figure/table counts."""
        self.pages_in_order = {}
        self.BOOK_COUNTERS = {}
        self.page_to_book = {}

        def count_figures_tables(md_file):
            """Return number of figures and tables in a Markdown file."""
            try:
                with open(md_file, "r", encoding="utf-8") as f:
                    content = f.read()
            except Exception:
                return 0, 0
            num_fig = len(FIGURE_RE.findall(content))
            num_tab = len(TABLE_PREFIX_RE.findall(content))
            return num_fig, num_tab

        def collect(item):
            if getattr(item, "file", None):
                src_uri = item.file.src_uri
                if src_uri.startswith("book/") and not src_uri.startswith("book/menu/"):
                    parts = src_uri.split("/")
                    if len(parts) < 2:
                        return
                    book_name = parts[1]
                    if book_name not in self.pages_in_order:
                        self.pages_in_order[book_name] = []
                        self.BOOK_COUNTERS[book_name] = {"figure": 0, "table": 0}
                    # Precompute figure/table counts
                    md_path = item.file.abs_src_path
                    num_fig, num_tab = count_figures_tables(md_path)
                    self.pages_in_order[book_name].append({
                        "src_uri": src_uri,
                        "num_fig": num_fig,
                        "num_tab": num_tab
                    })
                    self.page_to_book[src_uri] = book_name
                    #print(f"[DEBUG] Collected page: {src_uri} in book: {book_name} f"(figures={num_fig}, tables={num_tab})")
            for child in getattr(item, "children", []) or []:
                collect(child)

        for item in nav or []:
            collect(item)

        # Precompute starting counters per page according to nav order
        for book, pages in self.pages_in_order.items():
            fig_counter = 0
            tab_counter = 0
            for page_info in pages:
                page_info["start_figure"] = fig_counter
                page_info["start_table"] = tab_counter
                fig_counter += page_info["num_fig"]
                tab_counter += page_info["num_tab"]
            # Set global counters to last page totals
            self.BOOK_COUNTERS[book]["figure"] = 0
            self.BOOK_COUNTERS[book]["table"] = 0
            #print(f"[DEBUG] Precomputed page counters for book {book}: {pages}")

        return nav

    def on_page_content(self, html, page, config, files):
        """Add figure/table captions with continuous numbering."""
        src_uri = getattr(page.file, "src_uri", None)
        if not src_uri or src_uri not in self.page_to_book:
            return html

        book_name = self.page_to_book[src_uri]
        counters = self.BOOK_COUNTERS[book_name]

        # Find starting counters for this page
        start_fig = 0
        start_tab = 0
        for page_info in self.pages_in_order[book_name]:
            if page_info["src_uri"] == src_uri:
                start_fig = page_info.get("start_figure", 0)
                start_tab = page_info.get("start_table", 0)
                break

        soup = BeautifulSoup(html, "html.parser")

        # Figures
        fig_num = start_fig
        for img in soup.find_all("img"):
            fig_num += 1
            alt = img.get("alt", "")
            figure = soup.new_tag("figure")
            img.replace_with(figure)
            figure.append(img)
            figcaption = soup.new_tag("figcaption")
            figcaption.string = f"Figure {fig_num}: {alt}"
            figure.append(figcaption)
            #print(f"[DEBUG] Added figure caption: Figure {fig_num}: {alt}")
        counters["figure"] = fig_num

        # Tables
        tab_num = start_tab
        for table in soup.find_all("table"):
            caption_text = None
            prev = table.find_previous_sibling("p")
            if prev:
                match = TABLE_PREFIX_RE.match(prev.get_text(strip=True))
                if match:
                    caption_text = match.group(1).strip()
                    prev.decompose()
            if caption_text:
                tab_num += 1
                caption_tag = soup.new_tag(
                    "p",
                    **{"class": "table-caption", "style": "text-align:center; font-style:italic;"}
                )
                caption_tag.string = f"Table {tab_num}: {caption_text}"
                table.insert_after(caption_tag)
                #print(f"[DEBUG] Added table caption: Table {tab_num}: {caption_text}")
        counters["table"] = tab_num

        #print(f"[DEBUG] Updated counters after page {src_uri}: {counters}")
        return str(soup)