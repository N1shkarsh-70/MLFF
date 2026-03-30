import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Transaction {
  id: string;
  date: string;
  time: string;
  laneId: string;
  vrn: string;
  vehicleClass: string;
  amount: number;
  tagId: string;
  status: 'Paid' | 'Failed' | 'Pending' | 'Exempted';
  paymentMode: string;
  speed: number;
}

@Component({
  selector: 'app-toll-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in-up">
      <!-- Header -->
      <div class="page-header flex items-center justify-between">
        <div>
          <h1 class="page-title">Toll Transactions</h1>
          <p class="page-subtitle">{{ filteredTxns().length }} records found · All lanes</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-secondary text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export CSV
          </button>
          <button class="btn-primary text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
            Apply Filters
          </button>
        </div>
      </div>

      <!-- Filter Panel -->
      <div class="card p-5 mb-4">
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <!-- Date From -->
          <div>
            <label class="form-label">Date From</label>
            <input type="date" [(ngModel)]="filters.dateFrom" class="form-input text-xs" id="filter-date-from"/>
          </div>
          <!-- Date To -->
          <div>
            <label class="form-label">Date To</label>
            <input type="date" [(ngModel)]="filters.dateTo" class="form-input text-xs" id="filter-date-to"/>
          </div>
          <!-- Lane -->
          <div>
            <label class="form-label">Lane ID</label>
            <select [(ngModel)]="filters.laneId" class="form-select text-xs" id="filter-lane">
              <option value="">All Lanes</option>
              <option value="Lane 1">Lane 1</option>
              <option value="Lane 2">Lane 2</option>
              <option value="Lane 3">Lane 3</option>
              <option value="Lane 4">Lane 4</option>
            </select>
          </div>
          <!-- Vehicle Class -->
          <div>
            <label class="form-label">Vehicle Class</label>
            <select [(ngModel)]="filters.vehicleClass" class="form-select text-xs" id="filter-class">
              <option value="">All Classes</option>
              <option value="Car / Jeep">Car / Jeep</option>
              <option value="LCV">LCV / Mini Bus</option>
              <option value="Bus">Bus / Truck</option>
              <option value="3-Axle">3-Axle</option>
              <option value="Oversized">Oversized</option>
            </select>
          </div>
          <!-- Status -->
          <div>
            <label class="form-label">Status</label>
            <select [(ngModel)]="filters.status" class="form-select text-xs" id="filter-status">
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Pending">Pending</option>
              <option value="Exempted">Exempted</option>
            </select>
          </div>
          <!-- VRN Search -->
          <div>
            <label class="form-label">Vehicle Reg. No.</label>
            <input type="text" [(ngModel)]="filters.vrn" placeholder="e.g. HR26..." class="form-input text-xs" id="filter-vrn"/>
          </div>
          <!-- Txn ID -->
          <div>
            <label class="form-label">Transaction ID</label>
            <input type="text" [(ngModel)]="filters.txnId" placeholder="e.g. TXN..." class="form-input text-xs" id="filter-txn-id"/>
          </div>
        </div>
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-surface-border dark:border-dark-border">
          <button (click)="resetFilters()" class="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-slate-300 flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Reset Filters
          </button>
          <!-- Summary Chips -->
          <div class="flex gap-2">
            <span class="px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">✓ {{ paid }} Paid</span>
            <span class="px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">✗ {{ failed }} Failed</span>
            <span class="px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">⏳ {{ pending }} Pending</span>
            <span class="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">↩ {{ exempted }} Exempted</span>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Date & Time</th>
                <th>Lane</th>
                <th>Vehicle Reg.</th>
                <th>Class</th>
                <th>Tag ID</th>
                <th>Speed</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let txn of paginatedTxns(); let i = index"
                class="animate-fade-in-up"
                [style.animation-delay]="(i * 30) + 'ms'">
                <td>
                  <span class="font-mono text-xs text-primary-600 font-semibold">{{ txn.id }}</span>
                </td>
                <td>
                  <div class="text-sm text-gray-900 dark:text-slate-200">{{ txn.date }}</div>
                  <div class="text-xs text-gray-400 font-mono">{{ txn.time }}</div>
                </td>
                <td>
                  <span class="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">{{ txn.laneId }}</span>
                </td>
                <td>
                  <span class="font-mono text-sm font-semibold text-gray-900 dark:text-slate-200">{{ txn.vrn }}</span>
                </td>
                <td class="text-xs text-gray-600 dark:text-slate-400">{{ txn.vehicleClass }}</td>
                <td>
                  <span class="font-mono text-xs text-gray-500">{{ txn.tagId }}</span>
                </td>
                <td>
                  <span [class]="txn.speed > 60 ? 'text-red-600 font-semibold' : 'text-gray-700 dark:text-slate-300'" class="text-sm">
                    {{ txn.speed }} km/h
                  </span>
                </td>
                <td>
                  <span class="text-sm font-semibold text-gray-900 dark:text-slate-200">₹{{ txn.amount }}</span>
                </td>
                <td>
                  <span class="text-xs text-gray-500 dark:text-slate-400">{{ txn.paymentMode }}</span>
                </td>
                <td>
                  <span [class]="getStatusClass(txn.status)">
                    <span class="w-1.5 h-1.5 rounded-full" [class]="getStatusDot(txn.status)"></span>
                    {{ txn.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-5 py-3 border-t border-surface-border dark:border-dark-border">
          <p class="text-xs text-gray-500">
            Showing {{ (currentPage() - 1) * pageSize + 1 }}–{{ Math.min(currentPage() * pageSize, filteredTxns().length) }}
            of {{ filteredTxns().length }} transactions
          </p>
          <div class="flex items-center gap-1">
            <button (click)="prevPage()" [disabled]="currentPage() === 1"
              class="px-3 py-1.5 text-xs btn-secondary disabled:opacity-40">
              ← Prev
            </button>
            <ng-container *ngFor="let p of getPages()">
              <button (click)="currentPage.set(p)"
                [class.bg-primary-700]="currentPage() === p"
                [class.text-white]="currentPage() === p"
                class="w-8 h-8 text-xs rounded-lg font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
                {{ p }}
              </button>
            </ng-container>
            <button (click)="nextPage()" [disabled]="currentPage() === totalPages()"
              class="px-3 py-1.5 text-xs btn-secondary disabled:opacity-40">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TollTransactionsComponent {
  Math = Math;
  filters = {
    dateFrom: '',
    dateTo: '',
    laneId: '',
    vehicleClass: '',
    status: '',
    vrn: '',
    txnId: ''
  };

  currentPage = signal(1);
  pageSize = 10;

  transactions: Transaction[] = this.generateMockTransactions();

  filteredTxns = computed(() => {
    return this.transactions.filter(t => {
      if (this.filters.laneId && t.laneId !== this.filters.laneId) return false;
      if (this.filters.status && t.status !== this.filters.status) return false;
      if (this.filters.vrn && !t.vrn.toLowerCase().includes(this.filters.vrn.toLowerCase())) return false;
      if (this.filters.txnId && !t.id.toLowerCase().includes(this.filters.txnId.toLowerCase())) return false;
      if (this.filters.vehicleClass && !t.vehicleClass.toLowerCase().includes(this.filters.vehicleClass.toLowerCase())) return false;
      return true;
    });
  });

  paginatedTxns = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredTxns().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filteredTxns().length / this.pageSize));

  get paid(): number { return this.transactions.filter(t => t.status === 'Paid').length; }
  get failed(): number { return this.transactions.filter(t => t.status === 'Failed').length; }
  get pending(): number { return this.transactions.filter(t => t.status === 'Pending').length; }
  get exempted(): number { return this.transactions.filter(t => t.status === 'Exempted').length; }

  resetFilters(): void {
    this.filters = { dateFrom: '', dateTo: '', laneId: '', vehicleClass: '', status: '', vrn: '', txnId: '' };
    this.currentPage.set(1);
  }

  prevPage(): void { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage(): void { if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1); }

  getPages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Paid': 'badge-success text-xs',
      'Failed': 'badge-failed text-xs',
      'Pending': 'badge-pending text-xs',
      'Exempted': 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600'
    };
    return map[status] || 'badge-pending text-xs';
  }

  getStatusDot(status: string): string {
    const map: Record<string, string> = {
      'Paid': 'bg-green-500',
      'Failed': 'bg-red-500',
      'Pending': 'bg-yellow-500',
      'Exempted': 'bg-gray-400'
    };
    return map[status] || 'bg-gray-400';
  }

  generateMockTransactions(): Transaction[] {
    const vrns = ['HR26 DX 4421', 'DL01 CA 2291', 'MH04 BK 9934', 'UP32 AT 5512', 'PB10 CG 7743', 'GJ01 AB 1234', 'RJ14 DC 6678', 'KA09 MN 2231', 'TN22 BZ 9900', 'WB04 XY 3344'];
    const classes = ['Car / Jeep', 'LCV', 'Bus', '3-Axle', 'Car / Jeep', 'Car / Jeep', 'Oversized', 'LCV', 'Bus', 'Car / Jeep'];
    const lanes = ['Lane 1', 'Lane 2', 'Lane 3'];
    const statuses: ('Paid' | 'Failed' | 'Pending' | 'Exempted')[] = ['Paid', 'Paid', 'Paid', 'Paid', 'Failed', 'Pending', 'Paid', 'Paid', 'Exempted', 'Paid'];
    const amounts = [185, 285, 445, 685, 185, 255, 985, 285, 0, 185];
    const modes = ['FASTag', 'FASTag', 'FASTag', 'FASTag', 'Cash', 'FASTag', 'FASTag', 'FASTag', 'Exempted', 'FASTag'];

    const txns: Transaction[] = [];
    for (let i = 0; i < 120; i++) {
      const idx = i % 10;
      const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
      const min = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const month = String(Math.floor(Math.random() * 3) + 1).padStart(2, '0');
      txns.push({
        id: 'TXN' + String(100000 + i).padStart(8, '0'),
        date: `2025-${month}-${day}`,
        time: `${hour}:${min}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        laneId: lanes[Math.floor(Math.random() * 3)],
        vrn: vrns[idx],
        vehicleClass: classes[idx],
        amount: amounts[idx],
        tagId: 'TAG' + String(400000000 + i * 17),
        status: statuses[idx],
        paymentMode: amounts[idx] === 0 ? 'Exempted' : modes[idx],
        speed: 45 + Math.floor(Math.random() * 40)
      });
    }
    return txns;
  }
}
