# Sales Analytics Dashboard

A professional, feature-rich sales analytics dashboard built with Flask, HTML, CSS, JavaScript, and Chart.js.

## Features

### 📊 Dashboard Metrics
- **9 KPI Cards** with animated counters:
  - Total Revenue
  - Total Orders
  - Average Order Value
  - Top Product
  - Best Region
  - Best Selling Category
  - Total Quantity Sold
  - Highest Order Value
  - Monthly Growth %

### 💡 Key Insights Section
- Top Revenue Category
- Best Performing Region
- Most Sold Product
- Best Month

### 📈 Advanced Charts (6 Total)
- Monthly Sales Trend (Line Chart)
- Revenue by Category (Bar Chart)
- Region-wise Revenue Distribution (Pie Chart)
- Top 5 Products by Revenue (Horizontal Bar Chart)
- Revenue by Region (Bar Chart)
- Daily Sales Trend (Line Chart)

### 🎯 Interactive Features
- **Filters**: Region and Category multi-select
- **Search**: Real-time table search
- **Sorting**: Click column headers to sort by any field
- **Pagination**: 10 rows per page with navigation
- **Export Options**:
  - CSV Export
  - Excel Export
  - PDF Report

### 🌙 UI Enhancements
- Dark Mode Toggle
- Animated KPI Counters
- Hover Tooltips on Charts
- Responsive Design
- Smooth Transitions
- Modern Card Layout

## Installation

```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python app.py
```

Then open `http://localhost:5000` in your browser.

## Project Structure

```
├── app.py                 # Flask backend with API endpoints
├── templates/
│   └── index.html        # Main dashboard HTML
├── static/
│   ├── style.css         # Styling with dark mode support
│   └── script.js         # Frontend logic and interactions
├── data/
│   └── sales_data.csv    # Sample sales data
└── requirements.txt      # Python dependencies
```

## API Endpoints

- `GET /` - Main dashboard page
- `GET /api/kpis` - KPI metrics
- `GET /api/monthly-sales` - Monthly sales data
- `GET /api/category-revenue` - Revenue by category
- `GET /api/region-revenue` - Revenue by region
- `GET /api/top-products` - Top 5 products
- `GET /api/daily-sales` - Daily sales data
- `GET /api/table-data` - Full sales table data
- `GET /api/insights` - Key insights
- `GET /api/filters` - Available filter options

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: Chart.js
- **Data Processing**: Pandas
- **Export**: XLSX, jsPDF, CSV
- **Storage**: LocalStorage (for dark mode preference)

## Features Breakdown

### Filters
- Multi-select region and category filters
- Real-time data updates

### KPI Cards
- Animated counter animations
- Color-coded growth indicators
- Responsive grid layout

### Charts
- Interactive tooltips
- Responsive sizing
- Multiple chart types
- Smooth animations

### Data Table
- Full-text search
- Multi-column sorting
- Pagination controls
- Export to CSV, Excel, PDF

### Dark Mode
- Toggle button in navbar
- Persistent preference (localStorage)
- Smooth transitions
- All components themed

## Responsive Design

- Mobile-friendly layout
- Tablet optimized
- Desktop full-featured
- Touch-friendly controls

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

