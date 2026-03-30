import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';

interface Equipment {
  name: string;
  type: string;
  ip: string;
  status: 'online' | 'degraded' | 'offline';
  lastPing: string;
  pingMs?: number;
  model: string;
}

interface Lane {
  id: string;
  name: string;
  direction: string;
  equipment: Equipment[];
}

@Component({
  selector: 'app-nms',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  template: `
    <div class="animate-fade-in-up">
      <!-- Header -->
      <div class="page-header flex items-center justify-between">
        <div>
          <h1 class="page-title">Network Management System</h1>
          <p class="page-subtitle">Real-time equipment health monitoring · All lanes</p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="pingAll()" class="btn-secondary text-xs" [class.opacity-75]="pinging()">
            <svg class="w-4 h-4" [class.animate-spin]="pinging()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ pinging() ? 'Pinging...' : 'Ping All' }}
          </button>
          <div class="flex items-center gap-3 bg-white dark:bg-dark-card border border-surface-border dark:border-dark-border rounded-xl px-4 py-2">
            <div class="flex items-center gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              <span class="text-xs font-medium text-gray-700 dark:text-slate-300">{{ onlineCount }} Online</span>
            </div>
            <div class="w-px h-4 bg-surface-border dark:bg-dark-border"></div>
            <div class="flex items-center gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <span class="text-xs font-medium text-gray-700 dark:text-slate-300">{{ degradedCount }} Degraded</span>
            </div>
            <div class="w-px h-4 bg-surface-border dark:bg-dark-border"></div>
            <div class="flex items-center gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span class="text-xs font-medium text-gray-700 dark:text-slate-300">{{ offlineCount }} Offline</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Overall health bar -->
      <div class="card p-4 mb-4">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-semibold text-gray-700 dark:text-slate-300">Overall System Health</p>
          <p class="text-sm font-bold" [class]="healthPct >= 90 ? 'text-green-600' : healthPct >= 70 ? 'text-yellow-600' : 'text-red-600'">
            {{ healthPct }}%
          </p>
        </div>
        <div class="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-1000"
            [style.width]="healthPct + '%'"
            [class]="healthPct >= 90 ? 'bg-green-500' : healthPct >= 70 ? 'bg-yellow-500' : 'bg-red-500'">
          </div>
        </div>
        <div class="flex justify-between mt-1">
          <span class="text-xs text-gray-400">Last scan: {{ lastScan }}</span>
          <span class="text-xs text-gray-400">{{ onlineCount + degradedCount + offlineCount }} total devices</span>
        </div>
      </div>

      <!-- Lane Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div *ngFor="let lane of lanes; let li = index"
          class="card overflow-hidden animate-fade-in-up"
          [style.animation-delay]="(li * 100) + 'ms'">

          <!-- Lane header -->
          <div [class]="'flex items-center justify-between px-5 py-4 border-b border-surface-border dark:border-dark-border ' + (getLaneHealth(lane) === 'good' ? 'bg-green-50' : getLaneHealth(lane) === 'warn' ? 'bg-yellow-50' : 'bg-red-50')">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                [class]="getLaneHealth(lane) === 'good' ? 'bg-green-100' : getLaneHealth(lane) === 'warn' ? 'bg-yellow-100' : 'bg-red-100'">
                <svg class="w-5 h-5" [class]="getLaneHealth(lane) === 'good' ? 'text-green-600' : getLaneHealth(lane) === 'warn' ? 'text-yellow-600' : 'text-red-600'"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white">{{ lane.name }}</h3>
                <p class="text-xs text-gray-500">{{ lane.direction }} · {{ lane.id }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium"
                [class]="getLaneHealth(lane) === 'good' ? 'text-green-700' : getLaneHealth(lane) === 'warn' ? 'text-yellow-700' : 'text-red-700'">
                {{ getLaneOnline(lane) }}/{{ lane.equipment.length }} Online
              </span>
            </div>
          </div>

          <!-- Equipment list -->
          <div class="divide-y divide-surface-border dark:divide-dark-border">
            <div *ngFor="let eq of lane.equipment; let i = index"
              class="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <div class="flex items-center gap-3">
                <!-- Ping dot -->
                <div class="relative flex-shrink-0">
                  <div [class]="'w-2.5 h-2.5 rounded-full ' + getEquipStatusColor(eq.status)"></div>
                  <div *ngIf="eq.status === 'online'"
                    [class]="'absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-60 ' + getEquipStatusColor(eq.status)"></div>
                </div>
                <!-- Equipment icon + name -->
                <div>
                  <p class="text-sm font-medium text-gray-800 dark:text-slate-200">{{ eq.name }}</p>
                  <p class="text-xs text-gray-400 font-mono">{{ eq.ip }}</p>
                </div>
              </div>

              <div class="flex items-center gap-3 text-right">
                <!-- Ping time -->
                <div *ngIf="eq.status !== 'offline'" class="text-right">
                  <p class="text-xs font-mono font-semibold"
                    [class]="eq.pingMs && eq.pingMs < 10 ? 'text-green-600' : eq.pingMs && eq.pingMs < 50 ? 'text-yellow-600' : 'text-red-600'">
                    {{ eq.pingMs }}ms
                  </p>
                  <p class="text-xs text-gray-400">{{ eq.lastPing }}</p>
                </div>
                <div *ngIf="eq.status === 'offline'" class="text-right">
                  <p class="text-xs text-red-500 font-semibold">Timeout</p>
                  <p class="text-xs text-gray-400">{{ eq.lastPing }}</p>
                </div>
                <!-- Status badge -->
                <span [class]="eq.status === 'online' ? 'badge-online text-xs' : eq.status === 'degraded' ? 'badge-degraded text-xs' : 'badge-offline text-xs'">
                  <span class="w-1.5 h-1.5 rounded-full"
                    [class]="eq.status === 'online' ? 'bg-green-500' : eq.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'"></span>
                  {{ eq.status | titlecase }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class NmsComponent implements OnInit, OnDestroy {
  pinging = signal(false);
  lastScan = '21:08:34';
  private pingTimer: any;

  lanes: Lane[] = [
    {
      id: 'LN-001', name: 'Lane 1', direction: 'Entry (Gurugram → Delhi)',
      equipment: [
        { name: 'ANPR Camera Front', type: 'Camera', ip: '192.168.1.11', status: 'online', lastPing: '21:08:34', pingMs: 4, model: 'Hikvision DS-2CD2T46G1' },
        { name: 'ANPR Camera Rear', type: 'Camera', ip: '192.168.1.12', status: 'online', lastPing: '21:08:34', pingMs: 3, model: 'Hikvision DS-2CD2T46G1' },
        { name: 'RFID Reader', type: 'RFID', ip: '192.168.1.13', status: 'online', lastPing: '21:08:34', pingMs: 6, model: 'Kapsch RFID UHF' },
        { name: 'Lidar Sensor', type: 'Lidar', ip: '192.168.1.14', status: 'online', lastPing: '21:08:34', pingMs: 8, model: 'Velodyne VLP-16' },
        { name: 'Radar Sensor', type: 'Radar', ip: '192.168.1.15', status: 'online', lastPing: '21:08:34', pingMs: 5, model: 'Continental LRR3' },
        { name: 'LPC Camera', type: 'Camera', ip: '192.168.1.16', status: 'online', lastPing: '21:08:34', pingMs: 4, model: 'Vivotek FE9181-H' },
        { name: 'Solar Controller', type: 'Power', ip: '192.168.1.17', status: 'online', lastPing: '21:08:34', pingMs: 12, model: 'Victron MPPT 100' },
        { name: 'LPU Controller', type: 'Controller', ip: '192.168.1.18', status: 'online', lastPing: '21:08:34', pingMs: 7, model: 'Kapsch LPU v4' },
      ]
    },
    {
      id: 'LN-002', name: 'Lane 2', direction: 'Entry (Gurugram → Delhi)',
      equipment: [
        { name: 'ANPR Camera Front', type: 'Camera', ip: '192.168.2.11', status: 'online', lastPing: '21:08:34', pingMs: 3, model: 'Hikvision DS-2CD2T46G1' },
        { name: 'ANPR Camera Rear', type: 'Camera', ip: '192.168.2.12', status: 'online', lastPing: '21:08:34', pingMs: 5, model: 'Hikvision DS-2CD2T46G1' },
        { name: 'RFID Reader', type: 'RFID', ip: '192.168.2.13', status: 'degraded', lastPing: '21:07:12', pingMs: 89, model: 'Kapsch RFID UHF' },
        { name: 'Lidar Sensor', type: 'Lidar', ip: '192.168.2.14', status: 'online', lastPing: '21:08:34', pingMs: 9, model: 'Velodyne VLP-16' },
        { name: 'Radar Sensor', type: 'Radar', ip: '192.168.2.15', status: 'online', lastPing: '21:08:34', pingMs: 6, model: 'Continental LRR3' },
        { name: 'LPC Camera', type: 'Camera', ip: '192.168.2.16', status: 'online', lastPing: '21:08:34', pingMs: 4, model: 'Vivotek FE9181-H' },
        { name: 'Solar Controller', type: 'Power', ip: '192.168.2.17', status: 'online', lastPing: '21:08:34', pingMs: 11, model: 'Victron MPPT 100' },
        { name: 'LPU Controller', type: 'Controller', ip: '192.168.2.18', status: 'online', lastPing: '21:08:34', pingMs: 8, model: 'Kapsch LPU v4' },
      ]
    },
    {
      id: 'LN-003', name: 'Lane 3', direction: 'Exit (Delhi → Gurugram)',
      equipment: [
        { name: 'ANPR Camera Front', type: 'Camera', ip: '192.168.3.11', status: 'online', lastPing: '21:08:34', pingMs: 5, model: 'Hikvision DS-2CD2T46G1' },
        { name: 'ANPR Camera Rear', type: 'Camera', ip: '192.168.3.12', status: 'degraded', lastPing: '21:06:44', pingMs: 145, model: 'Hikvision DS-2CD2T46G1' },
        { name: 'RFID Reader', type: 'RFID', ip: '192.168.3.13', status: 'online', lastPing: '21:08:34', pingMs: 7, model: 'Kapsch RFID UHF' },
        { name: 'Lidar Sensor', type: 'Lidar', ip: '192.168.3.14', status: 'online', lastPing: '21:08:34', pingMs: 6, model: 'Velodyne VLP-16' },
        { name: 'Radar Sensor', type: 'Radar', ip: '192.168.3.15', status: 'online', lastPing: '21:08:34', pingMs: 4, model: 'Continental LRR3' },
        { name: 'LPC Camera', type: 'Camera', ip: '192.168.3.16', status: 'online', lastPing: '21:08:34', pingMs: 3, model: 'Vivotek FE9181-H' },
        { name: 'Solar Controller', type: 'Power', ip: '192.168.3.17', status: 'online', lastPing: '21:08:34', pingMs: 14, model: 'Victron MPPT 100' },
        { name: 'LPU Controller', type: 'Controller', ip: '192.168.3.18', status: 'online', lastPing: '21:08:34', pingMs: 9, model: 'Kapsch LPU v4' },
      ]
    },
    {
      id: 'LN-004', name: 'Lane 4', direction: 'Exit (Delhi → Gurugram)',
      equipment: [
        { name: 'ANPR Camera Front', type: 'Camera', ip: '192.168.4.11', status: 'offline', lastPing: '20:58:14', model: 'Hikvision DS-2CD2T46G1' },
        { name: 'ANPR Camera Rear', type: 'Camera', ip: '192.168.4.12', status: 'offline', lastPing: '20:58:14', model: 'Hikvision DS-2CD2T46G1' },
        { name: 'RFID Reader', type: 'RFID', ip: '192.168.4.13', status: 'offline', lastPing: '20:58:14', model: 'Kapsch RFID UHF' },
        { name: 'Lidar Sensor', type: 'Lidar', ip: '192.168.4.14', status: 'online', lastPing: '21:08:34', pingMs: 7, model: 'Velodyne VLP-16' },
        { name: 'Radar Sensor', type: 'Radar', ip: '192.168.4.15', status: 'online', lastPing: '21:08:34', pingMs: 6, model: 'Continental LRR3' },
        { name: 'LPC Camera', type: 'Camera', ip: '192.168.4.16', status: 'offline', lastPing: '20:58:14', model: 'Vivotek FE9181-H' },
        { name: 'Solar Controller', type: 'Power', ip: '192.168.4.17', status: 'online', lastPing: '21:08:34', pingMs: 10, model: 'Victron MPPT 100' },
        { name: 'LPU Controller', type: 'Controller', ip: '192.168.4.18', status: 'offline', lastPing: '20:58:14', model: 'Kapsch LPU v4' },
      ]
    }
  ];

  get onlineCount(): number {
    return this.lanes.flatMap(l => l.equipment).filter(e => e.status === 'online').length;
  }
  get degradedCount(): number {
    return this.lanes.flatMap(l => l.equipment).filter(e => e.status === 'degraded').length;
  }
  get offlineCount(): number {
    return this.lanes.flatMap(l => l.equipment).filter(e => e.status === 'offline').length;
  }
  get healthPct(): number {
    const total = this.lanes.flatMap(l => l.equipment).length;
    return Math.round(((this.onlineCount + this.degradedCount * 0.5) / total) * 100);
  }

  getLaneHealth(lane: Lane): 'good' | 'warn' | 'bad' {
    const offline = lane.equipment.filter(e => e.status === 'offline').length;
    const degraded = lane.equipment.filter(e => e.status === 'degraded').length;
    if (offline > 2) return 'bad';
    if (offline > 0 || degraded > 0) return 'warn';
    return 'good';
  }
  getLaneOnline(lane: Lane): number {
    return lane.equipment.filter(e => e.status === 'online').length;
  }

  getEquipStatusColor(status: string): string {
    return status === 'online' ? 'bg-green-500' : status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500';
  }

  pingAll(): void {
    this.pinging.set(true);
    setTimeout(() => {
      this.lastScan = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      this.pinging.set(false);
    }, 2000);
  }

  ngOnInit(): void {
    this.pingTimer = setInterval(() => {
      this.lanes.forEach(lane => {
        lane.equipment.forEach(eq => {
          if (eq.status !== 'offline') {
            eq.pingMs = Math.floor(Math.random() * 20) + 2;
          }
        });
      });
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.pingTimer);
  }
}
