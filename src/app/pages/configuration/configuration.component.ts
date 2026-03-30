import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in-up">
      <!-- Header -->
      <div class="page-header flex items-center justify-between">
        <div>
          <h1 class="page-title">Configuration</h1>
          <p class="page-subtitle">System settings & component configuration</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-secondary text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export Config
          </button>
          <button (click)="saveConfig()" class="btn-primary text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Save Changes
          </button>
        </div>
      </div>

      <!-- Save notification -->
      <div *ngIf="saved()"
        class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 animate-fade-in-up">
        <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <p class="text-green-700 font-medium text-sm">Configuration saved successfully!</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 bg-white dark:bg-dark-card border border-surface-border dark:border-dark-border rounded-xl p-1 mb-4 overflow-x-auto">
        <button *ngFor="let tab of tabs" (click)="activeTab.set(tab.id)"
          [class.bg-primary-700]="activeTab() === tab.id"
          [class.text-white]="activeTab() === tab.id"
          [class.shadow-sm]="activeTab() === tab.id"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-all whitespace-nowrap">
          <span>{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>

      <!-- ====== LANE CONFIG ====== -->
      <div *ngIf="activeTab() === 'lane'" class="animate-fade-in-up">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div *ngFor="let lane of laneConfigs; let i = index" class="card p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ lane.name }}</h3>
              <!-- Toggle -->
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">{{ lane.enabled ? 'Active' : 'Disabled' }}</span>
                <button (click)="lane.enabled = !lane.enabled"
                  [class.bg-primary-700]="lane.enabled"
                  [class.bg-gray-200]="!lane.enabled"
                  [class.dark:bg-slate-600]="!lane.enabled"
                  class="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none">
                  <div [class.translate-x-5]="lane.enabled" [class.translate-x-0]="!lane.enabled"
                    class="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5 transition-transform duration-200"></div>
                </button>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="form-label">Direction</label>
                <select [(ngModel)]="lane.direction" class="form-select text-sm">
                  <option>Entry</option>
                  <option>Exit</option>
                  <option>Both</option>
                </select>
              </div>
              <div>
                <label class="form-label">Speed Limit (km/h)</label>
                <input type="number" [(ngModel)]="lane.speedLimit" class="form-input text-sm"/>
              </div>
              <div>
                <label class="form-label">Min Headway (m)</label>
                <input type="number" [(ngModel)]="lane.minHeadway" class="form-input text-sm"/>
              </div>
              <div>
                <label class="form-label">Toll Amount (₹)</label>
                <input type="number" [(ngModel)]="lane.tollAmount" class="form-input text-sm"/>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ====== CAMERA CONFIG ====== -->
      <div *ngIf="activeTab() === 'camera'" class="animate-fade-in-up">
        <div class="card overflow-hidden">
          <div class="px-5 py-4 border-b border-surface-border dark:border-dark-border">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">ANPR & Surveillance Camera Settings</h3>
          </div>
          <div class="divide-y divide-surface-border dark:divide-dark-border">
            <div *ngFor="let cam of cameraConfigs; let i = index"
              class="px-5 py-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <div>
                <p class="text-sm font-semibold text-gray-900 dark:text-slate-200">{{ cam.name }}</p>
                <p class="text-xs text-gray-400">{{ cam.lane }}</p>
              </div>
              <div>
                <label class="form-label">IP Address</label>
                <input type="text" [(ngModel)]="cam.ip" class="form-input text-xs font-mono"/>
              </div>
              <div>
                <label class="form-label">Resolution</label>
                <select [(ngModel)]="cam.resolution" class="form-select text-xs">
                  <option>720P</option>
                  <option>1080P</option>
                  <option>4K UHD</option>
                </select>
              </div>
              <div>
                <label class="form-label">Frame Rate</label>
                <select [(ngModel)]="cam.fps" class="form-select text-xs">
                  <option>15</option>
                  <option>25</option>
                  <option>30</option>
                </select>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <label class="form-label">Active</label>
                  <div class="flex items-center">
                    <button (click)="cam.active = !cam.active"
                      [class.bg-primary-700]="cam.active" [class.bg-gray-200]="!cam.active"
                      class="relative w-10 h-5 rounded-full transition-colors">
                      <div [class.translate-x-4]="cam.active" [class.translate-x-0]="!cam.active"
                        class="w-4 h-4 bg-white rounded-full shadow absolute top-0.5 left-0.5 transition-transform"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ====== RFID SETTINGS ====== -->
      <div *ngIf="activeTab() === 'rfid'" class="animate-fade-in-up">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="card p-5">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-4">RFID Reader Configuration</h3>
            <div class="space-y-4">
              <div>
                <label class="form-label">NPCI Host URL</label>
                <input type="text" value="https://npci.org.in/fastag/api/v2" class="form-input font-mono text-sm"/>
              </div>
              <div>
                <label class="form-label">API Timeout (ms)</label>
                <input type="number" value="3000" class="form-input text-sm"/>
              </div>
              <div>
                <label class="form-label">Read Rate Threshold (%)</label>
                <input type="number" value="95" class="form-input text-sm"/>
              </div>
              <div>
                <label class="form-label">Retry Attempts</label>
                <input type="number" value="3" class="form-input text-sm"/>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-slate-300">Auto Blacklist Lookup</p>
                  <p class="text-xs text-gray-400">Check NPCI blacklist on each read</p>
                </div>
                <button [class.bg-primary-700]="rfidAutoBlacklist" (click)="rfidAutoBlacklist = !rfidAutoBlacklist"
                  [class.bg-gray-200]="!rfidAutoBlacklist"
                  class="relative w-11 h-6 rounded-full transition-colors">
                  <div [class.translate-x-5]="rfidAutoBlacklist" [class.translate-x-0]="!rfidAutoBlacklist"
                    class="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5 transition-transform"></div>
                </button>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-slate-300">Duplicate Tag Filter</p>
                  <p class="text-xs text-gray-400">Ignore reads within 5 seconds</p>
                </div>
                <button [class.bg-primary-700]="rfidDupFilter" (click)="rfidDupFilter = !rfidDupFilter"
                  [class.bg-gray-200]="!rfidDupFilter"
                  class="relative w-11 h-6 rounded-full transition-colors">
                  <div [class.translate-x-5]="rfidDupFilter" [class.translate-x-0]="!rfidDupFilter"
                    class="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5 transition-transform"></div>
                </button>
              </div>
            </div>
          </div>
          <div class="card p-5">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-4">Toll Rate Configuration</h3>
            <div class="space-y-3">
              <div *ngFor="let rate of tollRates" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div class="flex items-center gap-3">
                  <span class="text-lg">{{ rate.icon }}</span>
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-slate-300">{{ rate.class }}</p>
                    <p class="text-xs text-gray-400">{{ rate.axles }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-gray-500 text-sm">₹</span>
                  <input type="number" [(ngModel)]="rate.amount" class="form-input text-sm w-20 text-right font-semibold"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ====== SYSTEM SETTINGS ====== -->
      <div *ngIf="activeTab() === 'system'" class="animate-fade-in-up">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="card p-5 space-y-4">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-2">General Settings</h3>
            <div>
              <label class="form-label">Plaza Name</label>
              <input type="text" value="NH-48 Gurugram Toll Plaza" class="form-input text-sm"/>
            </div>
            <div>
              <label class="form-label">Plaza Code</label>
              <input type="text" value="NHAI-NH48-GGN-01" class="form-input text-sm font-mono"/>
            </div>
            <div>
              <label class="form-label">Time Zone</label>
              <select class="form-select text-sm">
                <option>Asia/Kolkata (IST +05:30)</option>
              </select>
            </div>
            <div>
              <label class="form-label">Data Retention (days)</label>
              <input type="number" value="365" class="form-input text-sm"/>
            </div>
            <div>
              <label class="form-label">Report Email</label>
              <input type="email" value="toll.nhai.nh48@gov.in" class="form-input text-sm"/>
            </div>
          </div>

          <div class="card p-5 space-y-3">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-2">Feature Toggles</h3>
            <div *ngFor="let toggle of systemToggles" class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-slate-300">{{ toggle.name }}</p>
                <p class="text-xs text-gray-400">{{ toggle.desc }}</p>
              </div>
              <button (click)="toggle.enabled = !toggle.enabled"
                [class.bg-primary-700]="toggle.enabled" [class.bg-gray-200]="!toggle.enabled"
                [class.dark:bg-slate-600]="!toggle.enabled"
                class="relative w-11 h-6 rounded-full transition-colors duration-200">
                <div [class.translate-x-5]="toggle.enabled" [class.translate-x-0]="!toggle.enabled"
                  class="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5 transition-transform duration-200"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ====== USER MANAGEMENT ====== -->
      <div *ngIf="activeTab() === 'users'" class="animate-fade-in-up">
        <div class="card overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-surface-border dark:border-dark-border">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">System Users</h3>
            <button class="btn-primary text-xs">+ Add User</button>
          </div>
          <div class="overflow-x-auto">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Last Login</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of systemUsers; let i = index"
                  class="animate-fade-in-up" [style.animation-delay]="(i * 60) + 'ms'">
                  <td>
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                        {{ user.name.charAt(0) }}
                      </div>
                      <span class="text-sm font-medium text-gray-900 dark:text-slate-200">{{ user.name }}</span>
                    </div>
                  </td>
                  <td><span class="font-mono text-xs text-gray-500">{{ user.username }}</span></td>
                  <td>
                    <span [class]="user.role === 'Super Admin' ? 'px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-medium' : 'px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium'">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="text-xs text-gray-500">{{ user.email }}</td>
                  <td class="text-xs text-gray-400 font-mono">{{ user.lastLogin }}</td>
                  <td>
                    <span [class]="user.active ? 'badge-online text-xs' : 'badge-offline text-xs'">
                      <span class="w-1.5 h-1.5 rounded-full" [class]="user.active ? 'bg-green-500' : 'bg-red-500'"></span>
                      {{ user.active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td>
                    <div class="flex gap-1">
                      <button class="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors">Edit</button>
                      <button *ngIf="user.username !== 'admin'" class="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ====== THRESHOLDS ====== -->
      <div *ngIf="activeTab() === 'threshold'" class="animate-fade-in-up">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="card p-5">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-4">Alert Thresholds</h3>
            <div class="space-y-4">
              <div *ngFor="let thresh of thresholds" class="space-y-1">
                <div class="flex justify-between items-center">
                  <label class="form-label mb-0">{{ thresh.name }}</label>
                  <span class="text-sm font-semibold text-primary-700">{{ thresh.value }}{{ thresh.unit }}</span>
                </div>
                <input type="range" [(ngModel)]="thresh.value" [min]="thresh.min" [max]="thresh.max"
                  class="w-full h-1.5 rounded-full accent-primary-700 cursor-pointer"/>
                <div class="flex justify-between text-xs text-gray-400">
                  <span>{{ thresh.min }}{{ thresh.unit }}</span>
                  <span>{{ thresh.max }}{{ thresh.unit }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card p-5">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-4">Communication Settings</h3>
            <div class="space-y-4">
              <div>
                <label class="form-label">Alert Email Recipients</label>
                <textarea class="form-input text-sm h-20 resize-none" placeholder="email1@example.com, email2@example.com">toll.ops@nhai.gov.in</textarea>
              </div>
              <div>
                <label class="form-label">SMS Alert Numbers</label>
                <input type="text" value="+91-98765XXXXX" class="form-input text-sm font-mono"/>
              </div>
              <div>
                <label class="form-label">Webhook URL</label>
                <input type="url" value="https://hooks.nhai.gov.in/mlff/alerts" class="form-input text-sm font-mono"/>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-slate-300">Enable Email Alerts</p>
                </div>
                <button [class.bg-primary-700]="emailAlerts" (click)="emailAlerts = !emailAlerts"
                  [class.bg-gray-200]="!emailAlerts" class="relative w-11 h-6 rounded-full transition-colors">
                  <div [class.translate-x-5]="emailAlerts" [class.translate-x-0]="!emailAlerts"
                    class="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 left-0.5 transition-transform"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ConfigurationComponent {
  activeTab = signal('lane');
  saved = signal(false);
  rfidAutoBlacklist = true;
  rfidDupFilter = true;
  emailAlerts = true;

  tabs = [
    { id: 'lane', label: 'Lane Config', icon: '🛣️' },
    { id: 'camera', label: 'Camera Config', icon: '📷' },
    { id: 'rfid', label: 'RFID & Rates', icon: '📡' },
    { id: 'system', label: 'System Settings', icon: '⚙️' },
    { id: 'users', label: 'Users', icon: '👤' },
    { id: 'threshold', label: 'Thresholds', icon: '🔔' },
  ];

  laneConfigs = [
    { name: 'Lane 1', enabled: true, direction: 'Entry', speedLimit: 60, minHeadway: 10, tollAmount: 185 },
    { name: 'Lane 2', enabled: true, direction: 'Entry', speedLimit: 60, minHeadway: 10, tollAmount: 185 },
    { name: 'Lane 3', enabled: true, direction: 'Exit', speedLimit: 60, minHeadway: 10, tollAmount: 185 },
    { name: 'Lane 4', enabled: false, direction: 'Exit', speedLimit: 60, minHeadway: 10, tollAmount: 185 },
  ];

  cameraConfigs = [
    { name: 'ANPR Front', lane: 'Lane 1', ip: '192.168.1.11', resolution: '4K UHD', fps: '30', active: true },
    { name: 'ANPR Rear', lane: 'Lane 1', ip: '192.168.1.12', resolution: '4K UHD', fps: '30', active: true },
    { name: 'ANPR Front', lane: 'Lane 2', ip: '192.168.2.11', resolution: '4K UHD', fps: '30', active: true },
    { name: 'ANPR Rear', lane: 'Lane 2', ip: '192.168.2.12', resolution: '4K UHD', fps: '30', active: true },
    { name: 'ANPR Front', lane: 'Lane 3', ip: '192.168.3.11', resolution: '1080P', fps: '25', active: true },
    { name: 'ANPR Rear', lane: 'Lane 3', ip: '192.168.3.12', resolution: '1080P', fps: '25', active: true },
    { name: 'ANPR Front', lane: 'Lane 4', ip: '192.168.4.11', resolution: '1080P', fps: '25', active: false },
    { name: 'ANPR Rear', lane: 'Lane 4', ip: '192.168.4.12', resolution: '1080P', fps: '25', active: false },
    { name: 'Surveillance 1', lane: 'Plaza Overview', ip: '192.168.10.1', resolution: '4K UHD', fps: '25', active: true },
    { name: 'Surveillance 2', lane: 'Entry Zone', ip: '192.168.10.2', resolution: '1080P', fps: '25', active: true },
  ];

  tollRates = [
    { icon: '🚗', class: 'Car / Jeep', axles: '2-axle', amount: 185 },
    { icon: '🚐', class: 'LCV / Mini Bus', axles: '2-axle light', amount: 285 },
    { icon: '🚌', class: 'Bus / Truck', axles: '2-axle heavy', amount: 445 },
    { icon: '🚛', class: '3-Axle', axles: '3-axle', amount: 685 },
    { icon: '🚚', class: '4-6 Axle', axles: '4-6 axle', amount: 985 },
    { icon: '⛟', class: 'Oversized (7+)', axles: '7+ axle', amount: 1485 },
  ];

  systemToggles = [
    { name: 'Auto Violation Detection', desc: 'Automatically flag violations from sensor data', enabled: true },
    { name: 'Bank Auto-sync', desc: 'Sync transactions to bank every 5 minutes', enabled: true },
    { name: 'CCTV Recording', desc: 'Record all camera feeds to local storage', enabled: true },
    { name: 'Night Mode Cameras', desc: 'Switch cameras to IR mode after sunset', enabled: true },
    { name: 'SMS Alerts', desc: 'Send SMS for critical equipment failures', enabled: false },
    { name: 'Maintenance Mode', desc: 'Suppress alerts during scheduled maintenance', enabled: false },
    { name: 'Debug Logging', desc: 'Verbose logging for diagnostics', enabled: false },
  ];

  systemUsers = [
    { name: 'System Administrator', username: 'admin', role: 'Super Admin', email: 'admin@mlff.gov.in', lastLogin: '2025-03-30 21:08', active: true },
    { name: 'Rakesh Kumar', username: 'rakesh.kumar', role: 'Operator', email: 'rakesh.k@nhai.gov.in', lastLogin: '2025-03-30 08:15', active: true },
    { name: 'Priya Sharma', username: 'priya.sharma', role: 'Supervisor', email: 'priya.s@nhai.gov.in', lastLogin: '2025-03-29 22:40', active: true },
    { name: 'Amit Verma', username: 'amit.verma', role: 'Operator', email: 'amit.v@nhai.gov.in', lastLogin: '2025-03-28 14:22', active: false },
    { name: 'Neha Singh', username: 'neha.singh', role: 'Report Manager', email: 'neha.s@nhai.gov.in', lastLogin: '2025-03-30 19:55', active: true },
  ];

  thresholds = [
    { name: 'Speed Alert (km/h)', value: 60, min: 40, max: 100, unit: ' km/h' },
    { name: 'Violation Rate Alert (%)', value: 5, min: 1, max: 20, unit: '%' },
    { name: 'Failed Txn Alert (count)', value: 10, min: 1, max: 50, unit: '' },
    { name: 'Camera Downtime Alert (min)', value: 5, min: 1, max: 30, unit: ' min' },
    { name: 'RFID Read Rate Min (%)', value: 95, min: 80, max: 100, unit: '%' },
    { name: 'Ping Timeout (ms)', value: 100, min: 50, max: 500, unit: 'ms' },
  ];

  saveConfig(): void {
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 3000);
  }
}
