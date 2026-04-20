import pandas as pd
import streamlit as st
import matplotlib.pyplot as plt

# Page config
st.set_page_config(page_title="Sales Dashboard", layout="wide")

# Custom CSS for better UI
st.markdown("""
    <style>
    .kpi-card {
        background-color: #f0f2f6;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
    }
    .kpi-title {font-size: 18px; color: #555;}
    .kpi-value {font-size: 28px; font-weight: bold; color: #111;}
    </style>
""", unsafe_allow_html=True)

# Load data
df = pd.read_csv("data/sales_data.csv")
df["OrderDate"] = pd.to_datetime(df["OrderDate"])
df["Month"] = df["OrderDate"].dt.to_period("M").astype(str)

# Sidebar Filters
st.sidebar.header("🔍 Filters")
regions = st.sidebar.multiselect("Select Region", df["Region"].unique(), default=df["Region"].unique())
categories = st.sidebar.multiselect("Select Category", df["Category"].unique(), default=df["Category"].unique())

filtered_df = df[(df["Region"].isin(regions)) & (df["Category"].isin(categories))]

# KPIs
total_revenue = filtered_df["Revenue"].sum()
total_orders = filtered_df.shape[0]
avg_order_value = int(total_revenue / total_orders) if total_orders > 0 else 0
top_product = filtered_df.groupby("Product")["Quantity"].sum().idxmax()

st.title("📊 Sales Analytics Dashboard")

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.markdown(f'<div class="kpi-card"><div class="kpi-title">Total Revenue</div><div class="kpi-value">₹{total_revenue}</div></div>', unsafe_allow_html=True)

with col2:
    st.markdown(f'<div class="kpi-card"><div class="kpi-title">Total Orders</div><div class="kpi-value">{total_orders}</div></div>', unsafe_allow_html=True)

with col3:
    st.markdown(f'<div class="kpi-card"><div class="kpi-title">Avg Order Value</div><div class="kpi-value">₹{avg_order_value}</div></div>', unsafe_allow_html=True)

with col4:
    st.markdown(f'<div class="kpi-card"><div class="kpi-title">Top Product</div><div class="kpi-value">{top_product}</div></div>', unsafe_allow_html=True)

st.markdown("---")

# Charts Layout
col5, col6 = st.columns(2)

# Monthly Sales Trend
with col5:
    st.subheader("📈 Monthly Sales Trend")
    monthly_sales = filtered_df.groupby("Month")["Revenue"].sum()
    st.line_chart(monthly_sales)

# Revenue by Category
with col6:
    st.subheader("📊 Revenue by Category")
    category_revenue = filtered_df.groupby("Category")["Revenue"].sum()
    st.bar_chart(category_revenue)

# Region Pie Chart
st.subheader("🌍 Region-wise Revenue Distribution")
region_revenue = filtered_df.groupby("Region")["Revenue"].sum()
fig, ax = plt.subplots()
ax.pie(region_revenue, labels=region_revenue.index, autopct="%1.1f%%")
st.pyplot(fig)

# Data Table
st.subheader("📋 Filtered Dataset")
st.dataframe(filtered_df, use_container_width=True)