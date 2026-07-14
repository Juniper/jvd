#!/usr/bin/env python3
"""Merge GitHub traffic API JSON into cumulative CSVs and generate SVG charts."""
import json, csv, os, sys

TRAFFIC_DIR = "traffic"


def merge_daily(json_file, csv_file, count_col, unique_col):
    existing = {}
    if os.path.exists(csv_file):
        with open(csv_file) as f:
            for row in csv.DictReader(f):
                existing[row["date"]] = row
    with open(json_file) as f:
        data = json.load(f)
    for entry in data.get("views", data.get("clones", [])):
        ts = entry["timestamp"][:10]
        existing[ts] = {"date": ts, count_col: str(entry["count"]), unique_col: str(entry["uniques"])}
    fieldnames = ["date", count_col, unique_col]
    with open(csv_file, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for d in sorted(existing):
            w.writerow(existing[d])


def chart(csv_file, svg_file, title, col1, col2, c1="#4ade80", c2="#60a5fa"):
    dates, v1, v2 = [], [], []
    if not os.path.exists(csv_file):
        return
    with open(csv_file) as f:
        for r in csv.DictReader(f):
            dates.append(r["date"])
            v1.append(int(r[col1]))
            v2.append(int(r[col2]))
    if len(dates) < 2:
        return
    w, h, pl, pr, pt, pb = 720, 200, 50, 20, 40, 50
    cw, ch = w - pl - pr, h - pt - pb
    mv = max(max(v1), max(v2), 1)
    n = len(dates)
    xp = lambda i: pl + (i / (n - 1)) * cw if n > 1 else pl
    yp = lambda v: pt + ch - (v / mv) * ch
    p1 = " ".join(f"{xp(i):.1f},{yp(v):.1f}" for i, v in enumerate(v1))
    p2 = " ".join(f"{xp(i):.1f},{yp(v):.1f}" for i, v in enumerate(v2))
    xl = ""
    for i, d in enumerate(dates):
        if i == 0 or i == n - 1 or i % 7 == 0:
            xl += f'<text x="{xp(i):.1f}" y="{h-10}" text-anchor="middle" font-size="11" fill="#9ca3af">{d[5:]}</text>\n'
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <rect width="{w}" height="{h}" fill="#0d1117" rx="8"/>
  <text x="{pl}" y="24" font-size="14" font-weight="600" fill="#e6edf3">{title}</text>
  <text x="{w-pr}" y="24" text-anchor="end" font-size="11" fill="#9ca3af">Last {n} days</text>
  <line x1="{pl}" y1="{pt}" x2="{pl}" y2="{pt+ch}" stroke="#21262d"/>
  <line x1="{pl}" y1="{pt+ch}" x2="{pl+cw}" y2="{pt+ch}" stroke="#21262d"/>
  <polyline points="{p1}" fill="none" stroke="{c1}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <polyline points="{p2}" fill="none" stroke="{c2}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="6,3"/>
  <circle cx="{pl+10}" cy="{h-32}" r="4" fill="{c1}"/><text x="{pl+20}" y="{h-28}" font-size="11" fill="#e6edf3">{col1}: {v1[-1]}</text>
  <circle cx="{pl+150}" cy="{h-32}" r="4" fill="{c2}"/><text x="{pl+160}" y="{h-28}" font-size="11" fill="#e6edf3">{col2}: {v2[-1]}</text>
  {xl}
  <text x="{pl-5}" y="{pt+4}" text-anchor="end" font-size="11" fill="#9ca3af">{mv}</text>
  <text x="{pl-5}" y="{pt+ch}" text-anchor="end" font-size="11" fill="#9ca3af">0</text>
</svg>'''
    with open(svg_file, "w") as f:
        f.write(svg)
    print(f"Generated {svg_file}")


if __name__ == "__main__":
    os.makedirs(TRAFFIC_DIR, exist_ok=True)
    merge_daily(f"{TRAFFIC_DIR}/views-latest.json", f"{TRAFFIC_DIR}/views-history.csv", "views", "unique_visitors")
    merge_daily(f"{TRAFFIC_DIR}/clones-latest.json", f"{TRAFFIC_DIR}/clones-history.csv", "clones", "unique_cloners")
    print("CSVs updated")
    chart(f"{TRAFFIC_DIR}/views-history.csv", f"{TRAFFIC_DIR}/views.svg", "Page Views", "views", "unique_visitors")
    chart(f"{TRAFFIC_DIR}/clones-history.csv", f"{TRAFFIC_DIR}/clones.svg", "Git Clones", "clones", "unique_cloners")
