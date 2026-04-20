import pandas as pd

# Load dataset
df = pd.read_csv("data/sales_data.csv")

# -------------------------------
# Data Cleaning
# -------------------------------

# Convert OrderDate to datetime format
df["OrderDate"] = pd.to_datetime(df["OrderDate"])

print("Data Types After Conversion:\n")
print(df.dtypes)

# -------------------------------
# Basic Analysis
# -------------------------------

# Total Revenue
total_revenue = df["Revenue"].sum()
print("\nTotal Revenue:", total_revenue)

# Top Selling Products (by Quantity)
top_products = df.groupby("Product")["Quantity"].sum().sort_values(ascending=False)
print("\nTop Selling Products:\n")
print(top_products)

# Revenue by Category
category_revenue = df.groupby("Category")["Revenue"].sum()
print("\nRevenue by Category:\n")
print(category_revenue)

# Monthly Sales Trend
df["Month"] = df["OrderDate"].dt.to_period("M")
monthly_sales = df.groupby("Month")["Revenue"].sum()
print("\nMonthly Sales Trend:\n")
print(monthly_sales)