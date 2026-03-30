# MLFF Tolling System — Setup Guide

## Prerequisites
- Node.js 18+ installed
- npm 9+

## Installation

Open PowerShell in the `mlff` folder and run:

```powershell
# 1. Install all dependencies
npm install

# 2. Start the development server
npm start
```

The app will be available at: **http://localhost:4200**

## Login Credentials
- **Username:** `admin`
- **Password:** `mlff@123`

## Features
- 🏠 **Dashboard** — KPI cards, charts, lane status, recent transactions
- 📹 **Live Streaming** — 12 animated camera tiles (ANPR Front/Back, Surveillance)
- 💳 **Toll Transactions** — Filter + paginated table of 120 mock records
- 🔍 **Audit** — Bank reconciliation with status indicators
- 🎟️ **E-Ticket** — Violation review with accept/reject
- 🌐 **NMS** — Equipment health monitoring with real-time ping
- 📊 **Report** — Generate and download reports
- ⚙️ **Configuration** — Lane, camera, RFID, system, user, threshold settings
