# Hedamo – Product Disclosure UI (Task 3)

A simple, premium, institutional frontend interface built for Hedamo to display **producer-declared product disclosures**.

This UI intentionally avoids any language implying verification, certification, or approval.

## Disclaimer (Shown in Product Detail View)
"This page presents producer-declared information; it is not certification or verification."

## Features
- Product list view with:
  - Name, category, producer, status, last updated
- Search (name/category/producer)
- Filters: category + status
- Sorting: name + date
- Product detail view:
  - Disclosure summary (declared by, declared date, evidence count)
  - Version history (2+ versions)
  - Prominent disclaimer text
- Interaction states:
  - Loading skeleton
  - Empty state with clear filters
  - Smooth transitions (150–250ms)
  - Keyboard support (Tab navigation + Esc to close modal)

## Tech Used
- HTML
- Tailwind CSS (CDN)
- Vanilla JavaScript

## How to Run
Open `index.html` in a browser.

Recommended:
- Use VS Code Live Server extension
