import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface AuditRecord {
  id: string;
  txnId: string;
  vrn: string;
  amount: number;
  bankRef: string;
  sentAt: string;
  settledAt?: string;
  status: 'Success' | 'Failed' | 'Pending';
  bankName: string;
  tagBalance?: number;
}

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in-up">
      <!-- Header -->
      <div class="page-header flex items-center justify-between">
        <div>
          <h1 class="page-title">Audit</h1>
          <p class="page-subtitle">Transaction mapping & bank settlement reconciliation</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-secondary text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export
          </button>
          <button class="btn-primary text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Re-sync All Failed
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div class="card p-4 animate-fade-in-up">
          <p class="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">Total Mapped</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">12,284</p>
          <div class="mt-2 text-xs text-gray-400">of 12,840 transactions</div>
          <div class="mt-2 bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
            <div class="bg-primary-700 h-1.5 rounded-full" style="width: 95.7%"></div>
          </div>
        </div>
        <div class="card p-4 animate-fade-in-up delay-100">
          <p class="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">Settled</p>
          <p class="text-2xl font-bold text-green-600">11,890</p>
          <div class="flex items-center gap-1 mt-2">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            <span class="text-xs text-green-600 font-medium">96.8% success rate</span>
          </div>
        </div>
        <div class="card p-4 animate-fade-in-up delay-200">
          <p class="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">Failed</p>
          <p class="text-2xl font-bold text-red-500">38</p>
          <div class="flex items-center gap-1 mt-2">
            <span class="w-2 h-2 rounded-full bg-red-500"></span>
            <span class="text-xs text-red-600 font-medium">Needs retry</span>
          </div>
        </div>
        <div class="card p-4 animate-fade-in-up delay-300">
          <p class="text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">Pending</p>
          <p class="text-2xl font-bold text-yellow-500">356</p>
          <div class="flex items-center gap-1 mt-2">
            <span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            <span class="text-xs text-yellow-600 font-medium">Processing</span>
          </div>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="card p-4 mb-4 flex items-center gap-3 flex-wrap">
        <select [(ngModel)]="statusFilter" class="form-select text-xs w-36" id="audit-status-filter">
          <option value="">All Status</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
          <option value="Pending">Pending</option>
        </select>
        <input type="text" [(ngModel)]="searchQuery" placeholder="Search TxnID / VRN / Bank Ref..."
          class="form-input text-xs max-w-xs" id="audit-search"/>
        <select class="form-select text-xs w-36">
          <option>All Banks</option>
          <option>NPCI</option>
          <option>HDFC Bank</option>
          <option>SBI</option>
        </select>
        <input type="date" class="form-input text-xs w-36"/>
        <span class="ml-auto text-xs text-gray-400">{{ filteredRecords().length }} records</span>
      </div>

      <!-- Table -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" class="rounded"/>
                </th>
                <th>Audit ID</th>
                <th>Transaction ID</th>
                <th>VRN</th>
                <th>Amount</th>
                <th>Bank</th>
                <th>Bank Reference</th>
                <th>Sent At</th>
                <th>Settled At</th>
                <th>Tag Balance</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let rec of filteredRecords(); let i = index"
                class="animate-fade-in-up"
                [style.animation-delay]="(i * 25) + 'ms'">
                <td><input type="checkbox" class="rounded"/></td>
                <td><span class="font-mono text-xs text-gray-500">{{ rec.id }}</span></td>
                <td><span class="font-mono text-xs text-primary-600 font-semibold">{{ rec.txnId }}</span></td>
                <td><span class="font-mono text-sm font-semibold text-gray-900 dark:text-slate-200">{{ rec.vrn }}</span></td>
                <td><span class="font-semibold text-gray-900 dark:text-slate-200">₹{{ rec.amount }}</span></td>
                <td><span class="text-xs text-gray-600 dark:text-slate-400">{{ rec.bankName }}</span></td>
                <td>
                  <span *ngIf="rec.bankRef" class="font-mono text-xs text-gray-500">{{ rec.bankRef }}</span>
                  <span *ngIf="!rec.bankRef" class="text-xs text-gray-300 italic">—</span>
                </td>
                <td class="text-xs text-gray-500 font-mono">{{ rec.sentAt }}</td>
                <td>
                  <span *ngIf="rec.settledAt" class="text-xs text-gray-500 font-mono">{{ rec.settledAt }}</span>
                  <span *ngIf="!rec.settledAt" class="text-xs text-gray-300 italic">—</span>
                </td>
                <td>
                  <span *ngIf="rec.tagBalance !== undefined" class="text-xs font-medium text-gray-700 dark:text-slate-300">₹{{ rec.tagBalance }}</span>
                  <span *ngIf="rec.tagBalance === undefined" class="text-xs text-gray-300 italic">—</span>
                </td>
                <td>
                  <!-- Status indicator with animated dot -->
                  <div class="flex items-center gap-2">
                    <div class="relative flex-shrink-0">
                      <div [class]="'w-3 h-3 rounded-full ' + getStatusColor(rec.status)"></div>
                      <div *ngIf="rec.status === 'Pending'"
                        [class]="'absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-50 ' + getStatusColor(rec.status)"></div>
                    </div>
                    <span [class]="getStatusBadge(rec.status)">{{ rec.status }}</span>
                  </div>
                </td>
                <td>
                  <button *ngIf="rec.status === 'Failed'"
                    class="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 hover:underline">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Retry
                  </button>
                  <button *ngIf="rec.status === 'Success'"
                    class="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-5 py-3 border-t border-surface-border dark:border-dark-border">
          <p class="text-xs text-gray-500">Showing {{ filteredRecords().length }} records</p>
          <div class="flex items-center gap-1">
            <button class="px-3 py-1.5 text-xs btn-secondary">← Prev</button>
            <button class="w-8 h-8 text-xs rounded-lg font-medium bg-primary-700 text-white">1</button>
            <button class="w-8 h-8 text-xs rounded-lg font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700">2</button>
            <button class="w-8 h-8 text-xs rounded-lg font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700">3</button>
            <button class="px-3 py-1.5 text-xs btn-secondary">Next →</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuditComponent {
  statusFilter = '';
  searchQuery = '';

  records: AuditRecord[] = this.generateAuditRecords();

  filteredRecords = computed(() => {
    return this.records.filter(r => {
      if (this.statusFilter && r.status !== this.statusFilter) return false;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        return r.txnId.toLowerCase().includes(q) || r.vrn.toLowerCase().includes(q) || r.bankRef?.toLowerCase().includes(q);
      }
      return true;
    });
  });

  getStatusColor(status: string): string {
    return status === 'Success' ? 'bg-green-500' : status === 'Failed' ? 'bg-red-500' : 'bg-yellow-500';
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      'Success': 'text-xs font-medium text-green-700',
      'Failed': 'text-xs font-medium text-red-600',
      'Pending': 'text-xs font-medium text-yellow-600'
    };
    return map[status] || 'text-xs text-gray-500';
  }

  generateAuditRecords(): AuditRecord[] {
    const vrns = ['HR26 DX 4421', 'DL01 CA 2291', 'MH04 BK 9934', 'UP32 AT 5512', 'PB10 CG 7743'];
    const banks = ['NPCI/HDFC', 'NPCI/SBI', 'NPCI/ICICI', 'NPCI/AXIS', 'NPCI/PNB'];
    const statuses: ('Success' | 'Failed' | 'Pending')[] = ['Success', 'Success', 'Success', 'Failed', 'Pending', 'Success', 'Success', 'Success', 'Pending', 'Success'];
    const amounts = [185, 285, 445, 685, 185, 255, 985, 285, 185, 685];

    return Array.from({ length: 30 }, (_, i) => ({
      id: 'AUD' + String(200000 + i),
      txnId: 'TXN' + String(100000 + i).padStart(8, '0'),
      vrn: vrns[i % 5],
      amount: amounts[i % 10],
      bankRef: statuses[i % 10] !== 'Failed' ? 'NPCI' + String(8000000000 + i * 7) : '',
      sentAt: `2025-03-30 ${String(Math.floor(i / 2) + 6).padStart(2, '0')}:${String((i * 3) % 60).padStart(2, '0')}`,
      settledAt: statuses[i % 10] === 'Success' ? `2025-03-30 ${String(Math.floor(i / 2) + 7).padStart(2, '0')}:${String((i * 3 + 2) % 60).padStart(2, '0')}` : undefined,
      status: statuses[i % 10],
      bankName: banks[i % 5],
      tagBalance: statuses[i % 10] !== 'Failed' ? 1000 + (i * 23) % 500 : undefined
    }));
  }
}
