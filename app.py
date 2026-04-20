from flask import Flask, render_template, jsonify, request
import pandas as pd
import json
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'data'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Load data
df = pd.read_csv("data/sales_data.csv")
df["OrderDate"] = pd.to_datetime(df["OrderDate"])
df["Month"] = df["OrderDate"].dt.to_period("M").astype(str)
df["Week"] = df["OrderDate"].dt.isocalendar().week

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/kpis')
def get_kpis():
    regions = request.args.getlist('regions[]')
    categories = request.args.getlist('categories[]')
    
    filtered_df = df.copy()
    if regions:
        filtered_df = filtered_df[filtered_df["Region"].isin(regions)]
    if categories:
        filtered_df = filtered_df[filtered_df["Category"].isin(categories)]
    
    total_revenue = float(filtered_df["Revenue"].sum())
    total_orders = int(filtered_df.shape[0])
    avg_order_value = int(total_revenue / total_orders) if total_orders > 0 else 0
    top_product = filtered_df.groupby("Product")["Quantity"].sum().idxmax() if not filtered_df.empty else "N/A"
    
    # New KPIs
    best_region = filtered_df.groupby("Region")["Revenue"].sum().idxmax() if not filtered_df.empty else "N/A"
    best_category = filtered_df.groupby("Category")["Revenue"].sum().idxmax() if not filtered_df.empty else "N/A"
    total_quantity = int(filtered_df["Quantity"].sum())
    highest_order = float(filtered_df["Revenue"].max()) if not filtered_df.empty else 0
    
    # Monthly growth percentage
    monthly_sales = filtered_df.groupby("Month")["Revenue"].sum().sort_index()
    if len(monthly_sales) >= 2:
        last_month = monthly_sales.iloc[-1]
        prev_month = monthly_sales.iloc[-2]
        growth_pct = ((last_month - prev_month) / prev_month * 100) if prev_month > 0 else 0
    else:
        growth_pct = 0
    
    return jsonify({
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'avg_order_value': avg_order_value,
        'top_product': top_product,
        'best_region': best_region,
        'best_category': best_category,
        'total_quantity': total_quantity,
        'highest_order': highest_order,
        'growth_pct': round(growth_pct, 2)
    })

@app.route('/api/monthly-sales')
def get_monthly_sales():
    regions = request.args.getlist('regions[]')
    categories = request.args.getlist('categories[]')
    
    filtered_df = df.copy()
    if regions:
        filtered_df = filtered_df[filtered_df["Region"].isin(regions)]
    if categories:
        filtered_df = filtered_df[filtered_df["Category"].isin(categories)]
    
    monthly_sales = filtered_df.groupby("Month")["Revenue"].sum()
    
    return jsonify({
        'labels': monthly_sales.index.tolist(),
        'data': monthly_sales.values.tolist()
    })

@app.route('/api/category-revenue')
def get_category_revenue():
    regions = request.args.getlist('regions[]')
    categories = request.args.getlist('categories[]')
    
    filtered_df = df.copy()
    if regions:
        filtered_df = filtered_df[filtered_df["Region"].isin(regions)]
    if categories:
        filtered_df = filtered_df[filtered_df["Category"].isin(categories)]
    
    category_revenue = filtered_df.groupby("Category")["Revenue"].sum()
    
    return jsonify({
        'labels': category_revenue.index.tolist(),
        'data': category_revenue.values.tolist()
    })

@app.route('/api/region-revenue')
def get_region_revenue():
    regions = request.args.getlist('regions[]')
    categories = request.args.getlist('categories[]')
    
    filtered_df = df.copy()
    if regions:
        filtered_df = filtered_df[filtered_df["Region"].isin(regions)]
    if categories:
        filtered_df = filtered_df[filtered_df["Category"].isin(categories)]
    
    region_revenue = filtered_df.groupby("Region")["Revenue"].sum()
    
    return jsonify({
        'labels': region_revenue.index.tolist(),
        'data': region_revenue.values.tolist()
    })

@app.route('/api/filters')
def get_filters():
    return jsonify({
        'regions': df["Region"].unique().tolist(),
        'categories': df["Category"].unique().tolist()
    })

@app.route('/api/table-data')
def get_table_data():
    regions = request.args.getlist('regions[]')
    categories = request.args.getlist('categories[]')
    
    filtered_df = df.copy()
    if regions:
        filtered_df = filtered_df[filtered_df["Region"].isin(regions)]
    if categories:
        filtered_df = filtered_df[filtered_df["Category"].isin(categories)]
    
    filtered_df["OrderDate"] = filtered_df["OrderDate"].dt.strftime('%Y-%m-%d')
    
    return jsonify(filtered_df.to_dict('records'))

@app.route('/api/top-products')
def get_top_products():
    regions = request.args.getlist('regions[]')
    categories = request.args.getlist('categories[]')
    
    filtered_df = df.copy()
    if regions:
        filtered_df = filtered_df[filtered_df["Region"].isin(regions)]
    if categories:
        filtered_df = filtered_df[filtered_df["Category"].isin(categories)]
    
    top_products = filtered_df.groupby("Product")["Revenue"].sum().sort_values(ascending=False).head(5)
    
    return jsonify({
        'labels': top_products.index.tolist(),
        'data': top_products.values.tolist()
    })

@app.route('/api/daily-sales')
def get_daily_sales():
    regions = request.args.getlist('regions[]')
    categories = request.args.getlist('categories[]')
    
    filtered_df = df.copy()
    if regions:
        filtered_df = filtered_df[filtered_df["Region"].isin(regions)]
    if categories:
        filtered_df = filtered_df[filtered_df["Category"].isin(categories)]
    
    daily_sales = filtered_df.groupby(filtered_df["OrderDate"].dt.strftime('%Y-%m-%d'))["Revenue"].sum().sort_index()
    
    return jsonify({
        'labels': daily_sales.index.tolist(),
        'data': daily_sales.values.tolist()
    })

@app.route('/api/insights')
def get_insights():
    regions = request.args.getlist('regions[]')
    categories = request.args.getlist('categories[]')
    
    filtered_df = df.copy()
    if regions:
        filtered_df = filtered_df[filtered_df["Region"].isin(regions)]
    if categories:
        filtered_df = filtered_df[filtered_df["Category"].isin(categories)]
    
    if filtered_df.empty:
        return jsonify({
            'top_category': 'N/A',
            'best_region': 'N/A',
            'most_sold_product': 'N/A',
            'best_month': 'N/A'
        })
    
    top_category = filtered_df.groupby("Category")["Revenue"].sum().idxmax()
    best_region = filtered_df.groupby("Region")["Revenue"].sum().idxmax()
    most_sold_product = filtered_df.groupby("Product")["Quantity"].sum().idxmax()
    best_month = filtered_df.groupby("Month")["Revenue"].sum().idxmax()
    
    return jsonify({
        'top_category': top_category,
        'best_region': best_region,
        'most_sold_product': most_sold_product,
        'best_month': str(best_month)
    })

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    global df
    
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No file selected'}), 400
    
    if not file.filename.endswith('.csv'):
        return jsonify({'success': False, 'message': 'Only CSV files are allowed'}), 400
    
    try:
        # Read the uploaded CSV
        new_df = pd.read_csv(file)
        
        # Validate required columns
        required_columns = ['OrderID', 'OrderDate', 'Product', 'Category', 'Region', 'Quantity', 'Price', 'Revenue']
        missing_columns = [col for col in required_columns if col not in new_df.columns]
        
        if missing_columns:
            return jsonify({
                'success': False, 
                'message': f'Missing required columns: {", ".join(missing_columns)}'
            }), 400
        
        # Process the dataframe
        new_df["OrderDate"] = pd.to_datetime(new_df["OrderDate"])
        new_df["Month"] = new_df["OrderDate"].dt.to_period("M").astype(str)
        new_df["Week"] = new_df["OrderDate"].dt.isocalendar().week
        
        # Update global dataframe
        df = new_df
        
        # Save to data folder
        filename = secure_filename('sales_data.csv')
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        df.to_csv(filepath, index=False)
        
        return jsonify({
            'success': True,
            'message': f'CSV uploaded successfully! Loaded {len(df)} records.',
            'records': len(df),
            'columns': list(df.columns)
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error processing file: {str(e)}'}), 400

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
