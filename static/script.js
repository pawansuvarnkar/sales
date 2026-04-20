let monthlySalesChart, categoryRevenueChart, regionRevenueChart, topProductsChart, regionBarChart, dailySalesChart;
let allTableData = [];
let filteredTableData = [];
let currentPage = 1;
let rowsPerPage = 10;
let sortColumn = '';
let sortDirection = 'asc';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDarkModePreference();
    loadFilters();
    loadData();
    setupUploadHandlers();
    
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        filteredTableData = allTableData.filter(row => {
            return (
                row.Product.toLowerCase().includes(searchTerm) ||
                row.Category.toLowerCase().includes(searchTerm) ||
                row.Region.toLowerCase().includes(searchTerm) ||
                row.OrderID.toString().includes(searchTerm)
            );
        });
        
        currentPage = 1;
        renderTable();
    });
});

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    updateChartColors();
}

function loadDarkModePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// Load filter options
async function loadFilters() {
    try {
        const response = await fetch('/api/filters');
        const data = await response.json();
        
        const regionFilters = document.getElementById('regionFilters');
        data.regions.forEach(region => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${region}" checked> ${region}`;
            regionFilters.appendChild(label);
        });
        
        const categoryFilters = document.getElementById('categoryFilters');
        data.categories.forEach(category => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" value="${category}" checked> ${category}`;
            categoryFilters.appendChild(label);
        });
    } catch (error) {
        console.error('Error loading filters:', error);
    }
}

// Get selected filters
function getSelectedFilters() {
    const regions = Array.from(document.querySelectorAll('#regionFilters input:checked'))
        .map(cb => cb.value);
    const categories = Array.from(document.querySelectorAll('#categoryFilters input:checked'))
        .map(cb => cb.value);
    
    return { regions, categories };
}

// Apply filters
function applyFilters() {
    loadData();
}

// Load all data
async function loadData() {
    const filters = getSelectedFilters();
    const params = new URLSearchParams();
    
    filters.regions.forEach(r => params.append('regions[]', r));
    filters.categories.forEach(c => params.append('categories[]', c));
    
    await Promise.all([
        loadKPIs(params),
        loadMonthlySales(params),
        loadCategoryRevenue(params),
        loadRegionRevenue(params),
        loadTableData(params),
        loadTopProducts(params),
        loadRegionBarChart(params),
        loadDailySales(params),
        loadInsights(params)
    ]);
}

// Load KPIs with animation
async function loadKPIs(params) {
    try {
        const response = await fetch(`/api/kpis?${params}`);
        const data = await response.json();
        
        animateCounter('totalRevenue', data.total_revenue, '₹');
        animateCounter('totalOrders', data.total_orders, '');
        animateCounter('avgOrderValue', data.avg_order_value, '₹');
        document.getElementById('topProduct').textContent = data.top_product;
        document.getElementById('bestRegion').textContent = data.best_region;
        document.getElementById('bestCategory').textContent = data.best_category;
        animateCounter('totalQuantity', data.total_quantity, '');
        animateCounter('highestOrder', data.highest_order, '₹');
        
        const growthPct = data.growth_pct;
        const growthElement = document.getElementById('growthPct');
        growthElement.textContent = `${growthPct > 0 ? '+' : ''}${growthPct}%`;
        growthElement.style.color = growthPct >= 0 ? '#10b981' : '#ef4444';
    } catch (error) {
        console.error('Error loading KPIs:', error);
    }
}

// Animate counter
function animateCounter(elementId, finalValue, prefix = '') {
    const element = document.getElementById(elementId);
    const startValue = 0;
    const duration = 1000;
    const steps = 60;
    const stepValue = finalValue / steps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
        currentStep++;
        const currentValue = Math.floor(stepValue * currentStep);
        element.textContent = prefix + currentValue.toLocaleString();
        
        if (currentStep >= steps) {
            element.textContent = prefix + finalValue.toLocaleString();
            clearInterval(interval);
        }
    }, duration / steps);
}

// Load monthly sales chart
async function loadMonthlySales(params) {
    try {
        const response = await fetch(`/api/monthly-sales?${params}`);
        const data = await response.json();
        
        const ctx = document.getElementById('monthlySalesChart').getContext('2d');
        
        if (monthlySalesChart) {
            monthlySalesChart.destroy();
        }
        
        monthlySalesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Revenue',
                    data: data.data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        padding: 12,
                        titleFont: { size: 14 },
                        bodyFont: { size: 13 },
                        callbacks: {
                            label: function(context) {
                                return '₹' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Error loading monthly sales:', error);
    }
}

// Load category revenue chart
async function loadCategoryRevenue(params) {
    try {
        const response = await fetch(`/api/category-revenue?${params}`);
        const data = await response.json();
        
        const ctx = document.getElementById('categoryRevenueChart').getContext('2d');
        
        if (categoryRevenueChart) {
            categoryRevenueChart.destroy();
        }
        
        categoryRevenueChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Revenue',
                    data: data.data,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(237, 100, 166, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        callbacks: {
                            label: function(context) {
                                return '₹' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Error loading category revenue:', error);
    }
}

// Load region revenue pie chart
async function loadRegionRevenue(params) {
    try {
        const response = await fetch(`/api/region-revenue?${params}`);
        const data = await response.json();
        
        const ctx = document.getElementById('regionRevenueChart').getContext('2d');
        
        if (regionRevenueChart) {
            regionRevenueChart.destroy();
        }
        
        regionRevenueChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(237, 100, 166, 0.8)',
                        'rgba(255, 159, 64, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        callbacks: {
                            label: function(context) {
                                return '₹' + context.parsed.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading region revenue:', error);
    }
}

// Load top products chart
async function loadTopProducts(params) {
    try {
        const response = await fetch(`/api/top-products?${params}`);
        const data = await response.json();
        
        const ctx = document.getElementById('topProductsChart').getContext('2d');
        
        if (topProductsChart) {
            topProductsChart.destroy();
        }
        
        topProductsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Revenue',
                    data: data.data,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: '#667eea',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        callbacks: {
                            label: function(context) {
                                return '₹' + context.parsed.x.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Error loading top products:', error);
    }
}

// Load region bar chart
async function loadRegionBarChart(params) {
    try {
        const response = await fetch(`/api/region-revenue?${params}`);
        const data = await response.json();
        
        const ctx = document.getElementById('regionBarChart').getContext('2d');
        
        if (regionBarChart) {
            regionBarChart.destroy();
        }
        
        regionBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Revenue',
                    data: data.data,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(237, 100, 166, 0.8)',
                        'rgba(255, 159, 64, 0.8)'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        callbacks: {
                            label: function(context) {
                                return '₹' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Error loading region bar chart:', error);
    }
}

// Load daily sales chart
async function loadDailySales(params) {
    try {
        const response = await fetch(`/api/daily-sales?${params}`);
        const data = await response.json();
        
        const ctx = document.getElementById('dailySalesChart').getContext('2d');
        
        if (dailySalesChart) {
            dailySalesChart.destroy();
        }
        
        dailySalesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Daily Revenue',
                    data: data.data,
                    borderColor: '#764ba2',
                    backgroundColor: 'rgba(118, 75, 162, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#764ba2',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        callbacks: {
                            label: function(context) {
                                return '₹' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Error loading daily sales:', error);
    }
}

// Load insights
async function loadInsights(params) {
    try {
        const response = await fetch(`/api/insights?${params}`);
        const data = await response.json();
        
        document.getElementById('insightCategory').textContent = data.top_category;
        document.getElementById('insightRegion').textContent = data.best_region;
        document.getElementById('insightProduct').textContent = data.most_sold_product;
        document.getElementById('insightMonth').textContent = data.best_month;
    } catch (error) {
        console.error('Error loading insights:', error);
    }
}

// Table functionality
async function loadTableData(params) {
    try {
        const response = await fetch(`/api/table-data?${params}`);
        const data = await response.json();
        
        allTableData = data;
        filteredTableData = data;
        currentPage = 1;
        renderTable();
    } catch (error) {
        console.error('Error loading table data:', error);
    }
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = filteredTableData.slice(start, end);
    
    pageData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.OrderID}</td>
            <td>${row.OrderDate}</td>
            <td>${row.Product}</td>
            <td>${row.Category}</td>
            <td>${row.Region}</td>
            <td>${row.Quantity}</td>
            <td>₹${row.Price.toLocaleString()}</td>
            <td>₹${row.Revenue.toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
    
    updatePaginationInfo();
}

function updatePaginationInfo() {
    const totalPages = Math.ceil(filteredTableData.length / rowsPerPage);
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, filteredTableData.length);
    
    document.getElementById('paginationInfo').textContent = 
        `Showing ${start}-${end} of ${filteredTableData.length} entries`;
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
    
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages || totalPages === 0;
}

function nextPage() {
    const totalPages = Math.ceil(filteredTableData.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
}

function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    filteredTableData.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];
        
        if (typeof valA === 'string') {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }
        
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    currentPage = 1;
    renderTable();
}

// Export functions
function exportCSV() {
    let csv = 'Order ID,Date,Product,Category,Region,Quantity,Price,Revenue\n';
    
    filteredTableData.forEach(row => {
        csv += `${row.OrderID},"${row.OrderDate}","${row.Product}","${row.Category}","${row.Region}",${row.Quantity},${row.Price},${row.Revenue}\n`;
    });
    
    downloadFile(csv, 'sales_data.csv', 'text/csv');
}

function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(filteredTableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Data');
    XLSX.writeFile(wb, 'sales_data.xlsx');
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Sales Analytics Report', 14, 15);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 25);
    
    const tableData = filteredTableData.map(row => [
        row.OrderID,
        row.OrderDate,
        row.Product,
        row.Category,
        row.Region,
        row.Quantity,
        '₹' + row.Price.toLocaleString(),
        '₹' + row.Revenue.toLocaleString()
    ]);
    
    doc.autoTable({
        head: [['Order ID', 'Date', 'Product', 'Category', 'Region', 'Qty', 'Price', 'Revenue']],
        body: tableData,
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 9 }
    });
    
    doc.save('sales_report.pdf');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Update chart colors for dark mode
function updateChartColors() {
    if (monthlySalesChart) monthlySalesChart.update();
    if (categoryRevenueChart) categoryRevenueChart.update();
    if (regionRevenueChart) regionRevenueChart.update();
    if (topProductsChart) topProductsChart.update();
    if (regionBarChart) regionBarChart.update();
    if (dailySalesChart) dailySalesChart.update();
}

// CSV Upload Handlers
function setupUploadHandlers() {
    const uploadArea = document.getElementById('uploadArea');
    const csvFile = document.getElementById('csvFile');
    const browseBtn = document.getElementById('browseBtn');
    
    // Click browse button only
    browseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        csvFile.click();
    });
    
    // File input change
    csvFile.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            uploadFile(e.target.files[0]);
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    });
}

function uploadFile(file) {
    // Validate file type
    if (!file.name.endsWith('.csv')) {
        showUploadStatus('❌', 'Error', 'Only CSV files are allowed', 'error');
        return;
    }
    
    // Validate file size (16MB)
    if (file.size > 16 * 1024 * 1024) {
        showUploadStatus('❌', 'Error', 'File size exceeds 16MB limit', 'error');
        return;
    }
    
    // Show uploading status
    showUploadStatus('⏳', 'Uploading', 'Processing your file...', 'loading');
    
    const formData = new FormData();
    formData.append('file', file);
    
    fetch('/api/upload-csv', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showUploadStatus('✅', 'Success', `${data.message}`, 'success');
            
            // Reload filters and data after 1.5 seconds
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            showUploadStatus('❌', 'Error', data.message, 'error');
        }
    })
    .catch(error => {
        showUploadStatus('❌', 'Error', 'Failed to upload file: ' + error.message, 'error');
    });
}

function showUploadStatus(icon, title, message, type) {
    const uploadArea = document.getElementById('uploadArea');
    const uploadStatus = document.getElementById('uploadStatus');
    const statusIcon = document.getElementById('statusIcon');
    const statusTitle = document.getElementById('statusTitle');
    const statusMessage = document.getElementById('statusMessage');
    
    statusIcon.textContent = icon;
    statusIcon.className = 'status-icon ' + type;
    statusTitle.textContent = title;
    statusMessage.textContent = message;
    
    uploadArea.style.display = 'none';
    uploadStatus.style.display = 'block';
    
    // Auto-hide error/success after 5 seconds
    if (type !== 'loading') {
        setTimeout(() => {
            uploadArea.style.display = 'block';
            uploadStatus.style.display = 'none';
            document.getElementById('csvFile').value = '';
        }, 5000);
    }
}
