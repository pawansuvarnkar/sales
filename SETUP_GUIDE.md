# Setup Guide - Sales Analytics Dashboard

## How to Transfer and Run This Project on Another Device

### Step 1: Copy the Project Folder

**On Current Device:**
1. Navigate to: `C:\Projects\Sales-Data-Analysis\`
2. Copy the entire `Sales-Data-Analysis` folder
3. Transfer it to the new device using one of these methods:
   - USB Drive
   - Cloud Storage (Google Drive, OneDrive, Dropbox)
   - Email (if folder is small)
   - Network Share
   - GitHub (recommended for version control)

**Files to Copy (Entire Project Structure):**
```
Sales-Data-Analysis/
├── app.py
├── dashboard.py
├── sales_analysis.py
├── requirements.txt
├── README.md
├── PROJECT_REPORT.md
├── SETUP_GUIDE.md
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── script.js
└── data/
    └── sales_data.csv
```

---

### Step 2: Setup on New Device

**Prerequisites:**
The new device must have Python installed.

#### Check if Python is Installed:
Open Command Prompt or Terminal and run:
```bash
python --version
```

If Python is not installed, download it from: https://www.python.org/downloads/

**Important:** During installation, check "Add Python to PATH"

---

### Step 3: Install Required Libraries

**On the New Device:**

1. Open Command Prompt or Terminal
2. Navigate to the project folder:
   ```bash
   cd path\to\Sales-Data-Analysis
   ```
   Example:
   ```bash
   cd C:\Users\YourName\Desktop\Sales-Data-Analysis
   ```

3. Install required libraries:
   ```bash
   pip install -r requirements.txt
   ```

   **OR** install manually:
   ```bash
   pip install flask pandas
   ```

---

### Step 4: Run the Application

**In the project folder, run:**
```bash
python app.py
```

**You should see:**
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

---

### Step 5: Access the Dashboard

**On the Same Device:**
Open a web browser and go to:
```
http://localhost:5000
```
or
```
http://127.0.0.1:5000
```

---

## Access from Other Devices on Same Network

If you want to access the dashboard from other devices on the same WiFi network:

### Step 1: Find Your IP Address

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**On Mac/Linux:**
```bash
ifconfig
```
or
```bash
ip addr show
```

### Step 2: Modify app.py

Change the last line in `app.py` from:
```python
if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

To:
```python
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

### Step 3: Run the Application
```bash
python app.py
```

### Step 4: Access from Other Devices

On any device connected to the same WiFi network, open a browser and go to:
```
http://YOUR_IP_ADDRESS:5000
```

Example:
```
http://192.168.1.100:5000
```

---

## Troubleshooting

### Issue 1: "Python is not recognized"
**Solution:** Python is not in PATH. Reinstall Python and check "Add to PATH" during installation.

### Issue 2: "No module named flask"
**Solution:** Install Flask:
```bash
pip install flask
```

### Issue 3: "No module named pandas"
**Solution:** Install Pandas:
```bash
pip install pandas
```

### Issue 4: Port 5000 is already in use
**Solution:** Change the port in app.py:
```python
app.run(debug=True, port=8080)
```
Then access at: `http://localhost:8080`

### Issue 5: Cannot access from other devices
**Solution:** 
1. Make sure `host='0.0.0.0'` is set in app.py
2. Check firewall settings - allow Python through firewall
3. Make sure both devices are on the same WiFi network

### Issue 6: CSV upload not working
**Solution:** Make sure the `data` folder exists and has write permissions.

---

## Quick Start Commands

**Windows:**
```bash
cd C:\path\to\Sales-Data-Analysis
pip install -r requirements.txt
python app.py
```

**Mac/Linux:**
```bash
cd /path/to/Sales-Data-Analysis
pip3 install -r requirements.txt
python3 app.py
```

---

## Stopping the Server

Press `Ctrl + C` in the terminal/command prompt where the server is running.

---

## Project Features

✅ 9 KPI Cards with animated counters
✅ Key Insights Section
✅ 6 Interactive Charts (Monthly, Category, Region, Top Products, Daily Sales)
✅ Search & Filter Functionality
✅ Sortable Data Table with Pagination
✅ Export to CSV, Excel, PDF
✅ Dark Mode Toggle
✅ CSV Upload Section
✅ Responsive Design

---

## System Requirements

- **Operating System:** Windows, Mac, or Linux
- **Python:** Version 3.7 or higher
- **RAM:** Minimum 2GB
- **Storage:** 50MB free space
- **Browser:** Chrome, Firefox, Safari, or Edge (latest versions)

---

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all files are copied correctly
3. Ensure Python and all libraries are installed
4. Check the terminal for error messages

---

**Last Updated:** April 2026
**Version:** 1.0
