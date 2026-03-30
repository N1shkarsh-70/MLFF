import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Violation {
  id: string;
  vrn: string;
  date: string;
  time: string;
  laneId: string;
  type: string;
  speed?: number;
  imageUrl?: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  amount: number;
  description: string;
}

@Component({
  selector: 'app-e-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in-up">
      <!-- Header -->
      <div class="page-header flex items-center justify-between">
        <div>
          <h1 class="page-title">E-Ticket</h1>
          <p class="page-subtitle">Violation management and e-challan processing</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="badge-pending">
            <span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            {{ pendingCount }} Pending Review
          </span>
          <button class="btn-primary text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export Tickets
          </button>
        </div>
      </div>

      <!-- Split Layout -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">

        <!-- Left: Violation Preview Panel -->
        <div class="card overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-surface-border dark:border-dark-border">
            <h2 class="font-semibold text-gray-900 dark:text-white text-sm">
              Violation Preview
              <span *ngIf="selectedViolation()" class="ml-2 text-primary-600">— {{ selectedViolation()!.vrn }}</span>
            </h2>
            <div class="flex gap-2">
              <button (click)="previewTab.set('image')" [class.bg-primary-700]="previewTab() === 'image'" [class.text-white]="previewTab() === 'image'"
                class="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
                📷 Image
              </button>
              <button (click)="previewTab.set('video')" [class.bg-primary-700]="previewTab() === 'video'" [class.text-white]="previewTab() === 'video'"
                class="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all">
                🎥 Video
              </button>
            </div>
          </div>

          <div *ngIf="!selectedViolation()" class="flex flex-col items-center justify-center py-20 text-center">
            <div class="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <p class="text-gray-500 dark:text-slate-400 font-medium">No violation selected</p>
            <p class="text-gray-400 text-sm mt-1">Click a row in the table below to view details</p>
          </div>

          <div *ngIf="selectedViolation()">
            <!-- Image Tab -->
            <div *ngIf="previewTab() === 'image'" class="p-4">
              <!-- Mock violation image -->
              <div class="rounded-xl overflow-hidden bg-gray-900 relative" style="height: 240px;">
                <div class="camera-tile w-full h-full">
                  <div class="camera-noise"></div>
                  <!-- Vehicle with highlighted plate -->
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 500 280" class="w-full h-full opacity-60" preserveAspectRatio="xMidYMid meet">
                      <!-- Road -->
                      <rect x="0" y="150" width="500" height="130" fill="#111827"/>
                      <rect x="0" y="145" width="500" height="5" fill="#374151"/>
                      <!-- Vehicle body -->
                      <rect x="140" y="90" width="220" height="100" rx="10" fill="#1e3a8a"/>
                      <!-- Windshield -->
                      <rect x="155" y="95" width="190" height="55" rx="5" fill="#1e40af" opacity="0.5"/>
                      <!-- Wheels -->
                      <circle cx="185" cy="192" r="22" fill="#111827" stroke="#374151" stroke-width="4"/>
                      <circle cx="315" cy="192" r="22" fill="#111827" stroke="#374151" stroke-width="4"/>
                      <!-- Number plate - highlighted with red -->
                      <rect x="196" y="172" width="108" height="30" rx="3" fill="#fef3c7" stroke="#ef4444" stroke-width="2"/>
                      <text x="250" y="193" text-anchor="middle" fill="#111827" style="font-size:13px;font-weight:900;font-family:monospace;">{{ selectedViolation()!.vrn }}</text>
                      <!-- Detection box -->
                      <rect x="140" y="90" width="220" height="115" rx="4" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="8 4"/>
                    </svg>
                  </div>
                  <!-- Timestamp overlay -->
                  <div class="absolute top-3 left-3 bg-black/60 rounded px-2 py-1">
                    <p class="text-white text-xs font-mono">{{ selectedViolation()!.date }} {{ selectedViolation()!.time }}</p>
                  </div>
                  <div class="absolute top-3 right-3 bg-red-600 rounded px-2 py-1">
                    <p class="text-white text-xs font-bold">⚠ VIOLATION</p>
                  </div>
                  <!-- Lane info -->
                  <div class="absolute bottom-3 left-3 bg-black/60 rounded px-2 py-1">
                    <p class="text-white text-xs">{{ selectedViolation()!.laneId }}</p>
                  </div>
                </div>
              </div>
              <!-- Violation details -->
              <div class="grid grid-cols-2 gap-3 mt-4">
                <div class="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <p class="text-xs text-gray-400">Violation Type</p>
                  <p class="text-sm font-semibold text-red-600 mt-0.5">{{ selectedViolation()!.type }}</p>
                </div>
                <div class="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <p class="text-xs text-gray-400">Fine Amount</p>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">₹{{ selectedViolation()!.amount }}</p>
                </div>
                <div class="col-span-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3">
                  <p class="text-xs text-gray-400">Description</p>
                  <p class="text-sm text-gray-700 dark:text-slate-300 mt-0.5">{{ selectedViolation()!.description }}</p>
                </div>
              </div>
            </div>

            <!-- Video Tab -->
            <div *ngIf="previewTab() === 'video'" class="p-4">
              <div class="rounded-xl overflow-hidden bg-gray-900 relative" style="height: 240px;">
                <div class="camera-tile w-full h-full">
                  <div class="camera-noise"></div>
                  <div class="scan-line"></div>
                  <div class="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div class="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all">
                      <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <p class="text-white/70 text-sm">Click to play violation clip</p>
                    <p class="text-white/40 text-xs">Duration: 00:12 sec</p>
                  </div>
                  <!-- Progress bar -->
                  <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80">
                    <div class="flex items-center gap-2">
                      <span class="text-white text-xs">00:00</span>
                      <div class="flex-1 h-1 bg-white/20 rounded-full">
                        <div class="h-1 bg-red-500 rounded-full" style="width: 0%"></div>
                      </div>
                      <span class="text-white text-xs">00:12</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Accept / Reject buttons -->
            <div *ngIf="selectedViolation()!.status === 'Pending'" class="flex gap-3 px-5 pb-5">
              <button (click)="handleAction('Accepted')"
                class="flex-1 btn-success py-2.5 justify-center text-sm font-semibold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                Accept Violation
              </button>
              <button (click)="handleAction('Rejected')"
                class="flex-1 btn-danger py-2.5 justify-center text-sm font-semibold">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Reject
              </button>
            </div>
            <div *ngIf="selectedViolation()!.status !== 'Pending'" class="px-5 pb-5">
              <div [class]="selectedViolation()!.status === 'Accepted' ? 'bg-green-50 border border-green-200 rounded-lg p-3 text-center' : 'bg-red-50 border border-red-200 rounded-lg p-3 text-center'">
                <p [class]="selectedViolation()!.status === 'Accepted' ? 'text-green-700 font-semibold text-sm' : 'text-red-700 font-semibold text-sm'">
                  {{ selectedViolation()!.status === 'Accepted' ? '✓ Violation Accepted — E-Challan Issued' : '✗ Violation Rejected' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Stats -->
        <div class="space-y-4">
          <!-- Violation type breakdown -->
          <div class="card p-5">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-4">Violation Breakdown</h3>
            <div class="space-y-3">
              <div *ngFor="let v of violationTypes" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-sm">{{ v.icon }}</span>
                  <span class="text-sm text-gray-700 dark:text-slate-300">{{ v.type }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-24 h-1.5 rounded-full bg-gray-100 dark:bg-slate-700">
                    <div class="h-1.5 rounded-full bg-red-500" [style.width]="v.pct + '%'"></div>
                  </div>
                  <span class="text-sm font-semibold text-gray-700 dark:text-slate-300 w-8">{{ v.count }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Today summary -->
          <div class="grid grid-cols-3 gap-3">
            <div class="card p-4 text-center">
              <p class="text-2xl font-bold text-yellow-500">{{ pendingCount }}</p>
              <p class="text-xs text-gray-500 mt-1">Pending</p>
            </div>
            <div class="card p-4 text-center">
              <p class="text-2xl font-bold text-green-600">{{ acceptedCount }}</p>
              <p class="text-xs text-gray-500 mt-1">Accepted</p>
            </div>
            <div class="card p-4 text-center">
              <p class="text-2xl font-bold text-red-500">{{ rejectedCount }}</p>
              <p class="text-xs text-gray-500 mt-1">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Violations Table -->
      <div class="card overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-surface-border dark:border-dark-border">
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Violation Records</h3>
          <div class="flex items-center gap-2">
            <input type="text" placeholder="Search VRN..." class="form-input text-xs w-40"/>
            <select class="form-select text-xs w-36">
              <option>All Types</option>
              <option>No FASTag</option>
              <option>Speeding</option>
              <option>Wrong Lane</option>
            </select>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Violation ID</th>
                <th>VRN</th>
                <th>Date & Time</th>
                <th>Lane</th>
                <th>Type</th>
                <th>Speed</th>
                <th>Fine</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let v of violations; let i = index"
                (click)="selectedViolation.set(v)"
                [class]="'cursor-pointer animate-fade-in-up ' + (selectedViolation()?.id === v.id ? 'bg-blue-50' : '')"
                [style.animation-delay]="(i * 40) + 'ms'">
                <td><span class="font-mono text-xs text-gray-500">{{ v.id }}</span></td>
                <td><span class="font-mono text-sm font-semibold text-gray-900 dark:text-slate-200">{{ v.vrn }}</span></td>
                <td>
                  <div class="text-sm text-gray-700 dark:text-slate-300">{{ v.date }}</div>
                  <div class="text-xs text-gray-400 font-mono">{{ v.time }}</div>
                </td>
                <td><span class="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">{{ v.laneId }}</span></td>
                <td>
                  <span class="px-2 py-0.5 rounded-full text-xs font-medium"
                    [class]="getViolationTypeClass(v.type)">
                    {{ v.type }}
                  </span>
                </td>
                <td>
                  <span *ngIf="v.speed" [class]="v.speed > 60 ? 'text-red-600 font-semibold text-sm' : 'text-gray-600 dark:text-slate-400 text-sm'">
                    {{ v.speed }} km/h
                  </span>
                  <span *ngIf="!v.speed" class="text-gray-300 text-xs italic">—</span>
                </td>
                <td class="font-semibold text-sm text-gray-900 dark:text-slate-200">₹{{ v.amount }}</td>
                <td>
                  <span [class]="getViolationStatusClass(v.status)" class="text-xs">
                    <span class="w-1.5 h-1.5 rounded-full" [class]="v.status === 'Pending' ? 'bg-yellow-500' : v.status === 'Accepted' ? 'bg-green-500' : 'bg-red-500'"></span>
                    {{ v.status }}
                  </span>
                </td>
                <td>
                  <div *ngIf="v.status === 'Pending'" class="flex gap-1" (click)="$event.stopPropagation()">
                    <button (click)="v.status = 'Accepted'; selectedViolation.set(v)"
                      class="px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs font-medium transition-colors">
                      Accept
                    </button>
                    <button (click)="v.status = 'Rejected'; selectedViolation.set(v)"
                      class="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium transition-colors">
                      Reject
                    </button>
                  </div>
                  <span *ngIf="v.status !== 'Pending'" [class]="v.status === 'Accepted' ? 'text-xs text-green-600 font-medium' : 'text-xs text-red-600 font-medium'">
                    {{ v.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ETicketComponent {
  previewTab = signal<'image' | 'video'>('image');
  selectedViolation = signal<Violation | null>(null);

  violationTypes = [
    { icon: '📡', type: 'No FASTag', count: 287, pct: 52 },
    { icon: '🚀', type: 'Speeding', count: 134, pct: 24 },
    { icon: '🚦', type: 'Wrong Lane', count: 89, pct: 16 },
    { icon: '⚖️', type: 'Axle Violation', count: 46, pct: 8 },
  ];

  violations: Violation[] = [
    { id: 'VIO-001', vrn: 'HR26 DX 4421', date: '2025-03-30', time: '20:45:12', laneId: 'Lane 2', type: 'No FASTag', amount: 500, status: 'Pending', description: 'Vehicle passed without valid FASTag. Toll not deducted via ETC.' },
    { id: 'VIO-002', vrn: 'DL01 CA 2291', date: '2025-03-30', time: '20:32:44', laneId: 'Lane 1', type: 'Speeding', speed: 98, amount: 1000, status: 'Pending', description: 'Vehicle exceeded speed limit. Recorded speed: 98 km/h. Limit: 60 km/h.' },
    { id: 'VIO-003', vrn: 'MH04 BK 9934', date: '2025-03-30', time: '20:18:30', laneId: 'Lane 3', type: 'No FASTag', amount: 500, status: 'Accepted', description: 'No valid FASTag detected. Manual cash collection attempted.' },
    { id: 'VIO-004', vrn: 'UP32 AT 5512', date: '2025-03-30', time: '19:55:22', laneId: 'Lane 1', type: 'Wrong Lane', amount: 250, status: 'Rejected', description: 'Vehicle classified as LCV but entered Car lane.' },
    { id: 'VIO-005', vrn: 'PB10 CG 7743', date: '2025-03-30', time: '19:40:11', laneId: 'Lane 2', type: 'Axle Violation', amount: 2000, status: 'Pending', description: 'Vehicle declared 2-axle but sensor detected 4-axle configuration.' },
    { id: 'VIO-006', vrn: 'GJ01 AB 1234', date: '2025-03-30', time: '19:22:50', laneId: 'Lane 3', type: 'Speeding', speed: 75, amount: 1000, status: 'Pending', description: 'Speed limit exceeded. Recorded: 75 km/h.' },
    { id: 'VIO-007', vrn: 'RJ14 DC 6678', date: '2025-03-30', time: '19:10:33', laneId: 'Lane 1', type: 'No FASTag', amount: 500, status: 'Accepted', description: 'Tag read failure. Vehicle blacklisted in NPCI database.' },
  ];

  get pendingCount(): number { return this.violations.filter(v => v.status === 'Pending').length; }
  get acceptedCount(): number { return this.violations.filter(v => v.status === 'Accepted').length; }
  get rejectedCount(): number { return this.violations.filter(v => v.status === 'Rejected').length; }

  handleAction(action: 'Accepted' | 'Rejected'): void {
    if (this.selectedViolation()) {
      const v = this.violations.find(x => x.id === this.selectedViolation()!.id);
      if (v) {
        v.status = action;
        this.selectedViolation.set({ ...v });
      }
    }
  }

  getViolationTypeClass(type: string): string {
    const map: Record<string, string> = {
      'No FASTag': 'bg-red-100 text-red-700',
      'Speeding': 'bg-orange-100 text-orange-700',
      'Wrong Lane': 'bg-yellow-100 text-yellow-700',
      'Axle Violation': 'bg-purple-100 text-purple-700'
    };
    return map[type] || 'bg-gray-100 text-gray-600';
  }

  getViolationStatusClass(status: string): string {
    const map: Record<string, string> = {
      'Pending': 'badge-pending',
      'Accepted': 'badge-success',
      'Rejected': 'badge-failed'
    };
    return map[status] || 'badge-pending';
  }
}
