# Smart Invoice Workspace

A production-style invoicing SaaS UI for freelancers and small businesses. Built with React, Tailwind CSS, shadcn-style components, react-to-print, jsPDF, and Recharts.

## Features

- Full invoice editor (business, client, dates, payment status, line items)
- Auto-calculated subtotal, tax, discount, and grand total
- Live invoice preview with 4 templates (Minimal, Corporate, Freelancer, Tax Invoice)
- Print-friendly layout via browser print dialog
- PDF export (jsPDF)
- LocalStorage for drafts and recent clients
- Company logo upload
- Dashboard with revenue stats and charts

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + tailwindcss-animate
- Radix UI primitives (shadcn-style)
- react-router-dom
- react-to-print
- jsPDF + jspdf-autotable
- Recharts
