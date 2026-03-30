import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in-up">
      <!-- Header -->
      <div class="page-header flex items-center justify-between">
        <div>
          <h1 class="page-title">Report</h1>
          <p class="page-subtitle">Generate and download detailed operational reports</p>
        </div>
      </div>

      <!-- Filter Card -->
      <div class="card p-6 mb-4">
        <h2 class="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-4 flex items-center gap-2">
          <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
          </svg>
          Report Filters
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label class="form-label">Report Type</label>
            <select [(ngModel)]="reportType" class="form-select text-sm" id="report-type">
              <option value="transaction">Transaction Summary</option>
              <option value="revenue">Revenue Report</option>
              <option value="violation">Violation Report</option>
              <option value="audit">Audit Report</option>
              <option value="equipment">Equipment Health</option>
              <option value="shift">Shift Report</option>
            </select>
          </div>
          <div>
            <label class="form-label">Date From</label>
            <input type="date" [(ngModel)]="dateFrom" class="form-input text-sm" id="report-date-from"
              [value]="defaultDateFrom"/>
          </div>
          <div>
            <label class="form-label">Date To</label>
            <input type="date" [(ngModel)]="dateTo" class="form-input text-sm" id="report-date-to"
              [value]="defaultDateTo"/>
          </div>
          <div>
            <label class="form-label">Lane</label>
            <select [(ngModel)]="selectedLane" class="form-select text-sm" id="report-lane">
              <option value="">All Lanes</option>
              <option value="Lane 1">Lane 1</option>
              <option value="Lane 2">Lane 2</option>
              <option value="Lane 3">Lane 3</option>
              <option value="Lane 4">Lane 4</option>
            </select>
          </div>
          <div>
            <label class="form-label">Vehicle Class</label>
            <select [(ngModel)]="vehicleClass" class="form-select text-sm" id="report-class">
              <option value="">All Classes</option>
              <option value="Car">Car / Jeep</option>
              <option value="LCV">LCV / Mini Bus</option>
              <option value="Bus">Bus / Truck</option>
              <option value="3-Axle">3-Axle</option>
              <option value="Oversized">Oversized</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-between mt-5 pt-4 border-t border-surface-border dark:border-dark-border">
          <div class="flex items-center gap-2">
            <label class="form-label mb-0 mr-2">Shift:</label>
            <button *ngFor="let s of shifts" (click)="selectedShift = s"
              [class.bg-primary-700]="selectedShift === s" [class.text-white]="selectedShift === s"
              class="px-3 py-1.5 text-xs rounded-lg font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700 border border-surface-border dark:border-dark-border transition-all">
              {{ s }}
            </button>
          </div>
          <div class="flex items-center gap-2">
            <button (click)="generateReport()" class="btn-primary text-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Show Report
            </button>
            <!-- Download dropdown -->
            <div class="relative" (click)="downloadOpen.set(!downloadOpen())">
              <button class="btn-secondary text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Download
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div *ngIf="downloadOpen()"
                class="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-dark-card border border-surface-border dark:border-dark-border rounded-xl shadow-card-lg z-10 overflow-hidden">
                <button class="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2">
                  <span>📄</span> PDF
                </button>
                <button class="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2">
                  <span>📊</span> Excel
                </button>
                <button class="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2">
                  <span>📋</span> CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Summary Chips (shown after generate) -->
      <div *ngIf="reportGenerated()" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div class="card p-4 animate-fade-in-up">
          <p class="text-xs text-gray-500 font-medium">Total Transactions</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">3,420</p>
          <p class="text-xs text-green-600 mt-1">↑ 8.4% vs previous</p>
        </div>
        <div class="card p-4 animate-fade-in-up delay-100">
          <p class="text-xs text-gray-500 font-medium">Total Revenue</p>
          <p class="text-2xl font-bold text-primary-700 mt-1">₹6.24L</p>
          <p class="text-xs text-green-600 mt-1">↑ 12.8% vs previous</p>
        </div>
        <div class="card p-4 animate-fade-in-up delay-200">
          <p class="text-xs text-gray-500 font-medium">Violations</p>
          <p class="text-2xl font-bold text-red-500 mt-1">148</p>
          <p class="text-xs text-red-600 mt-1">↑ 3.2% vs previous</p>
        </div>
        <div class="card p-4 animate-fade-in-up delay-300">
          <p class="text-xs text-gray-500 font-medium">Compliance Rate</p>
          <p class="text-2xl font-bold text-green-600 mt-1">95.7%</p>
          <p class="text-xs text-green-600 mt-1">↑ 1.2% vs previous</p>
        </div>
      </div>

      <!-- Report Table -->
      <div *ngIf="reportGenerated()" class="card overflow-hidden animate-fade-in-up">
        <div class="flex items-center justify-between px-5 py-4 border-b border-surface-border dark:border-dark-border">
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm">
            {{ getReportTitle() }}
          </h3>
          <span class="text-xs text-gray-400">Generated: {{ generatedAt }}</span>
        </div>
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Lane</th>
                <th>Transactions</th>
                <th>Revenue (₹)</th>
                <th>Vehicles</th>
                <th>Violations</th>
                <th>FASTag %</th>
                <th>Avg Speed</th>
                <th>Failed</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of reportData; let i = index"
                class="animate-fade-in-up"
                [style.animation-delay]="(i * 40) + 'ms'">
                <td class="font-mono text-xs text-gray-700 dark:text-slate-300">{{ row.date }}</td>
                <td>
                  <span class="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 text-xs rounded">{{ row.lane }}</span>
                </td>
                <td class="font-semibold text-gray-900 dark:text-slate-200">{{ row.transactions.toLocaleString() }}</td>
                <td class="font-semibold text-primary-700">₹{{ row.revenue.toLocaleString() }}</td>
                <td class="text-gray-700 dark:text-slate-300">{{ row.vehicles.toLocaleString() }}</td>
                <td>
                  <span [class]="row.violations > 50 ? 'text-red-600 font-semibold' : 'text-gray-700 dark:text-slate-300'">
                    {{ row.violations }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="w-12 h-1.5 rounded-full bg-gray-100 dark:bg-slate-700">
                      <div class="h-1.5 rounded-full bg-primary-600" [style.width]="row.fastagPct + '%'"></div>
                    </div>
                    <span class="text-xs text-gray-700 dark:text-slate-300">{{ row.fastagPct }}%</span>
                  </div>
                </td>
                <td class="text-sm text-gray-700 dark:text-slate-300">{{ row.avgSpeed }} km/h</td>
                <td>
                  <span [class]="row.failed > 5 ? 'badge-failed text-xs' : 'badge-success text-xs'">
                    <span class="w-1.5 h-1.5 rounded-full" [class]="row.failed > 5 ? 'bg-red-500' : 'bg-green-500'"></span>
                    {{ row.failed }}
                  </span>
                </td>
              </tr>
            </tbody>
            <!-- Footer Total Row -->
            <tfoot>
              <tr class="border-t-2 border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20">
                <td class="px-4 py-3 text-xs font-bold text-primary-800 dark:text-primary-300">TOTAL</td>
                <td class="px-4 py-3 text-xs text-gray-500">All Lanes</td>
                <td class="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">{{ getTotalTxns().toLocaleString() }}</td>
                <td class="px-4 py-3 text-sm font-bold text-primary-700">₹{{ getTotalRevenue().toLocaleString() }}</td>
                <td class="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">{{ getTotalVehicles().toLocaleString() }}</td>
                <td class="px-4 py-3 text-sm font-bold text-red-600">{{ getTotalViolations() }}</td>
                <td class="px-4 py-3 text-sm text-gray-500">—</td>
                <td class="px-4 py-3 text-sm text-gray-500">—</td>
                <td class="px-4 py-3 text-sm font-bold text-red-600">{{ getTotalFailed() }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Empty state before generate -->
      <div *ngIf="!reportGenerated()" class="card p-16 flex flex-col items-center justify-center text-center">
        <div class="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <p class="font-semibold text-gray-700 dark:text-slate-300 text-lg">No Report Generated</p>
        <p class="text-gray-400 text-sm mt-1">Configure filters above and click "Show Report" to generate</p>
      </div>
    </div>
  `
})
export class ReportComponent {
  reportType = 'transaction';
  dateFrom = '';
  dateTo = '';
  selectedLane = '';
  vehicleClass = '';
  selectedShift = 'All';
  shifts = ['All', 'Day (06-14)', 'Eve (14-22)', 'Night (22-06)'];
  reportGenerated = signal(false);
  downloadOpen = signal(false);
  generatedAt = '';
  defaultDateFrom = '2025-03-24';
  defaultDateTo = '2025-03-30';

  reportData = [
    { date: '2025-03-24', lane: 'All Lanes', transactions: 3210, revenue: 581810, vehicles: 3380, violations: 42, fastagPct: 96, avgSpeed: 54, failed: 4 },
    { date: '2025-03-25', lane: 'All Lanes', transactions: 3560, revenue: 644680, vehicles: 3720, violations: 58, fastagPct: 97, avgSpeed: 52, failed: 6 },
    { date: '2025-03-26', lane: 'All Lanes', transactions: 2980, revenue: 539780, vehicles: 3140, violations: 35, fastagPct: 95, avgSpeed: 56, failed: 3 },
    { date: '2025-03-27', lane: 'All Lanes', transactions: 3840, revenue: 695520, vehicles: 4020, violations: 67, fastagPct: 96, avgSpeed: 53, failed: 8 },
    { date: '2025-03-28', lane: 'All Lanes', transactions: 4120, revenue: 746160, vehicles: 4310, violations: 72, fastagPct: 98, avgSpeed: 51, failed: 5 },
    { date: '2025-03-29', lane: 'All Lanes', transactions: 3690, revenue: 668290, vehicles: 3880, violations: 55, fastagPct: 97, avgSpeed: 55, failed: 4 },
    { date: '2025-03-30', lane: 'All Lanes', transactions: 2840, revenue: 514520, vehicles: 2980, violations: 48, fastagPct: 96, avgSpeed: 54, failed: 7 },
  ];

  generateReport(): void {
    this.generatedAt = new Date().toLocaleString('en-IN');
    this.reportGenerated.set(true);
  }

  getReportTitle(): string {
    const map: Record<string, string> = {
      'transaction': 'Transaction Summary Report',
      'revenue': 'Revenue Report',
      'violation': 'Violation Report',
      'audit': 'Audit Report',
      'equipment': 'Equipment Health Report',
      'shift': 'Shift Report'
    };
    return map[this.reportType] || 'Report';
  }

  getTotalTxns(): number { return this.reportData.reduce((s, r) => s + r.transactions, 0); }
  getTotalRevenue(): number { return this.reportData.reduce((s, r) => s + r.revenue, 0); }
  getTotalVehicles(): number { return this.reportData.reduce((s, r) => s + r.vehicles, 0); }
  getTotalViolations(): number { return this.reportData.reduce((s, r) => s + r.violations, 0); }
  getTotalFailed(): number { return this.reportData.reduce((s, r) => s + r.failed, 0); }
}
