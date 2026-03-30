import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Camera {
  id: string;
  title: string;
  lane: string;
  type: string;
  status: 'live' | 'offline' | 'degraded';
  fps: number;
  resolution: string;
  lastEvent?: string;
}

@Component({
  selector: 'app-live-streaming',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in-up">
      <!-- Header -->
      <div class="page-header flex items-center justify-between">
        <div>
          <h1 class="page-title">Live Streaming</h1>
          <p class="page-subtitle">Real-time camera feeds from all lanes · NH-48 Gurugram Plaza</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="badge-online">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {{ liveCount }} Live
          </span>
          <span class="badge-offline">
            <span class="w-2 h-2 rounded-full bg-red-500"></span>
            {{ offlineCount }} Offline
          </span>
          <div class="flex items-center gap-1 bg-white dark:bg-dark-card border border-surface-border dark:border-dark-border rounded-lg p-1">
            <button (click)="gridCols.set(2)" [class.bg-primary-700]="gridCols() === 2" [class.text-white]="gridCols() === 2"
              class="px-3 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:text-gray-900 transition-all">2×2</button>
            <button (click)="gridCols.set(3)" [class.bg-primary-700]="gridCols() === 3" [class.text-white]="gridCols() === 3"
              class="px-3 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:text-gray-900 transition-all">3×3</button>
            <button (click)="gridCols.set(4)" [class.bg-primary-700]="gridCols() === 4" [class.text-white]="gridCols() === 4"
              class="px-3 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:text-gray-900 transition-all">4×4</button>
          </div>
        </div>
      </div>

      <!-- Camera Grid -->
      <div [class]="'grid gap-4 ' + getGridClass()">
        <div *ngFor="let cam of cameras; let i = index"
          (click)="selectedCamera.set(cam)"
          class="camera-tile rounded-xl overflow-hidden cursor-pointer group animate-fade-in-up border border-white/10 hover:border-accent-400/50 transition-all duration-200 hover:scale-[1.02]"
          [class.border-red-500]="cam.status === 'offline'"
          [style.animation-delay]="(i * 60) + 'ms'"
          style="min-height: 200px;"
        >
          <!-- Camera frame content -->
          <div class="relative w-full h-full" style="min-height: 180px;">
            <!-- Noise overlay -->
            <div class="camera-noise"></div>

            <!-- Scan line (only for live cameras) -->
            <div *ngIf="cam.status === 'live'" class="scan-line"></div>

            <!-- Mock vehicle ANPR overlay for ANPR cameras -->
            <div *ngIf="cam.type === 'ANPR' && cam.status === 'live'" class="absolute inset-0 flex items-center justify-center">
              <!-- Mock road and vehicle -->
              <svg class="w-full h-full opacity-30" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid meet">
                <!-- Road -->
                <rect x="80" y="80" width="240" height="100" fill="#222" rx="4"/>
                <rect x="80" y="80" width="240" height="100" fill="none" stroke="#444" stroke-width="1"/>
                <!-- Lane markings -->
                <line x1="200" y1="80" x2="200" y2="180" stroke="#888" stroke-width="1" stroke-dasharray="8 6"/>
                <!-- Mock vehicle outline (number plate region) -->
                <rect x="140" y="125" width="120" height="35" rx="2" fill="none" stroke="#38bdf8" stroke-width="1.5"/>
                <rect x="150" y="130" width="100" height="25" rx="1" fill="#38bdf8" opacity="0.15"/>
                <!-- Plate text mock -->
                <text x="200" y="147" text-anchor="middle" fill="#38bdf8" style="font-size:12px;font-weight:bold;font-family:monospace;" opacity="0.8">HR26 DX 4421</text>
                <!-- Corner detection boxes -->
                <rect x="140" y="125" width="10" height="3" fill="#38bdf8"/>
                <rect x="140" y="125" width="3" height="10" fill="#38bdf8"/>
                <rect x="250" y="125" width="10" height="3" fill="#38bdf8"/>
                <rect x="257" y="125" width="3" height="10" fill="#38bdf8"/>
                <rect x="140" y="157" width="10" height="3" fill="#38bdf8"/>
                <rect x="140" y="150" width="3" height="10" fill="#38bdf8"/>
                <rect x="250" y="157" width="10" height="3" fill="#38bdf8"/>
                <rect x="257" y="150" width="3" height="10" fill="#38bdf8"/>
              </svg>
            </div>

            <!-- Surveillance mock scene -->
            <div *ngIf="cam.type === 'Surveillance' && cam.status === 'live'" class="absolute inset-0 flex items-end justify-center pb-6 opacity-25">
              <svg viewBox="0 0 400 180" class="w-full" preserveAspectRatio="xMidYMax meet">
                <!-- Road scene -->
                <rect x="0" y="120" width="400" height="60" fill="#1a1a2e"/>
                <rect x="0" y="115" width="400" height="5" fill="#334"/>
                <line x1="0" y1="140" x2="400" y2="140" stroke="#444" stroke-width="1" stroke-dasharray="20 15"/>
                <!-- Vehicles -->
                <rect x="50" y="122" width="70" height="28" rx="3" fill="#2563eb" opacity="0.7"/>
                <rect x="160" y="125" width="50" height="22" rx="3" fill="#16a34a" opacity="0.7"/>
                <rect x="270" y="120" width="90" height="32" rx="3" fill="#dc2626" opacity="0.6"/>
                <!-- Trees/barriers -->
                <rect x="10" y="60" width="8" height="60" fill="#1f2937"/>
                <ellipse cx="14" cy="55" rx="18" ry="20" fill="#064e3b" opacity="0.8"/>
                <rect x="380" y="70" width="8" height="50" fill="#1f2937"/>
                <ellipse cx="384" cy="65" rx="16" ry="18" fill="#064e3b" opacity="0.8"/>
              </svg>
            </div>

            <!-- Offline overlay -->
            <div *ngIf="cam.status === 'offline'"
              class="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80">
              <svg class="w-10 h-10 text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
              </svg>
              <p class="text-red-400 text-sm font-semibold">Camera Offline</p>
              <p class="text-gray-500 text-xs mt-1">Signal lost · Reconnecting...</p>
            </div>

            <!-- Top bar overlay -->
            <div class="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/60 to-transparent">
              <div class="flex items-center gap-1.5">
                <span *ngIf="cam.status === 'live'"
                  class="flex items-center gap-1 px-1.5 py-0.5 bg-red-500 rounded text-white text-xs font-bold camera-live-badge">
                  ● LIVE
                </span>
                <span *ngIf="cam.status === 'offline'"
                  class="px-1.5 py-0.5 bg-gray-700 rounded text-gray-300 text-xs font-bold">
                  OFFLINE
                </span>
                <span *ngIf="cam.status === 'degraded'"
                  class="px-1.5 py-0.5 bg-yellow-500 rounded text-white text-xs font-bold">
                  DEGRADED
                </span>
              </div>
              <span class="text-white/60 text-xs font-mono">{{ cam.fps }} fps</span>
            </div>

            <!-- Bottom info bar -->
            <div class="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
              <p class="text-white text-sm font-semibold">{{ cam.title }}</p>
              <div class="flex items-center justify-between mt-0.5">
                <p class="text-white/50 text-xs">{{ cam.lane }}</p>
                <p class="text-white/50 text-xs font-mono">{{ cam.resolution }}</p>
              </div>
              <p *ngIf="cam.lastEvent" class="text-accent-400 text-xs mt-1 truncate">{{ cam.lastEvent }}</p>
            </div>

            <!-- Fullscreen overlay on hover -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
              <div class="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Camera Detail Modal -->
      <div *ngIf="selectedCamera()"
        class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in-up"
        (click)="selectedCamera.set(null)">
        <div class="bg-dark-card rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl border border-white/10" (click)="$event.stopPropagation()">
          <!-- Modal camera view -->
          <div class="camera-tile relative" style="height: 400px;">
            <div class="camera-noise"></div>
            <div *ngIf="selectedCamera()!.status === 'live'" class="scan-line"></div>
            <!-- Status bar -->
            <div class="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
              <div class="flex items-center gap-2">
                <span class="flex items-center gap-1 px-2 py-1 bg-red-500 rounded text-white text-sm font-bold camera-live-badge">
                  ● LIVE
                </span>
                <span class="text-white font-semibold">{{ selectedCamera()!.title }}</span>
              </div>
              <button (click)="selectedCamera.set(null)" class="text-white/70 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <!-- Camera info -->
          <div class="p-5 grid grid-cols-4 gap-4">
            <div class="text-center">
              <p class="text-xs text-slate-400">Lane</p>
              <p class="text-white font-semibold mt-1">{{ selectedCamera()!.lane }}</p>
            </div>
            <div class="text-center">
              <p class="text-xs text-slate-400">Type</p>
              <p class="text-white font-semibold mt-1">{{ selectedCamera()!.type }}</p>
            </div>
            <div class="text-center">
              <p class="text-xs text-slate-400">Resolution</p>
              <p class="text-white font-semibold mt-1">{{ selectedCamera()!.resolution }}</p>
            </div>
            <div class="text-center">
              <p class="text-xs text-slate-400">Frame Rate</p>
              <p class="text-white font-semibold mt-1">{{ selectedCamera()!.fps }} fps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LiveStreamingComponent {
  gridCols = signal(3);
  selectedCamera = signal<Camera | null>(null);

  cameras: Camera[] = [
    { id: 'L1-ANPR-F', title: 'ANPR Camera Front', lane: 'Lane 1', type: 'ANPR', status: 'live', fps: 30, resolution: '4K UHD', lastEvent: 'Last Read: HR26 DX 4421 — 21:08:34' },
    { id: 'L1-ANPR-B', title: 'ANPR Camera Rear', lane: 'Lane 1', type: 'ANPR', status: 'live', fps: 30, resolution: '4K UHD', lastEvent: 'Last Read: HR26 DX 4421 — 21:08:34' },
    { id: 'L2-ANPR-F', title: 'ANPR Camera Front', lane: 'Lane 2', type: 'ANPR', status: 'live', fps: 30, resolution: '4K UHD', lastEvent: 'Last Read: DL01 CA 2291 — 21:06:12' },
    { id: 'L2-ANPR-B', title: 'ANPR Camera Rear', lane: 'Lane 2', type: 'ANPR', status: 'live', fps: 30, resolution: '4K UHD', lastEvent: 'Last Read: DL01 CA 2291 — 21:06:12' },
    { id: 'L3-ANPR-F', title: 'ANPR Camera Front', lane: 'Lane 3', type: 'ANPR', status: 'live', fps: 30, resolution: '1080P', lastEvent: 'Last Read: MH04 BK 9934 — 21:04:50' },
    { id: 'L3-ANPR-B', title: 'ANPR Camera Rear', lane: 'Lane 3', type: 'ANPR', status: 'live', fps: 25, resolution: '1080P', lastEvent: 'Last Read: MH04 BK 9934 — 21:04:50' },
    { id: 'L4-ANPR-F', title: 'ANPR Camera Front', lane: 'Lane 4', type: 'ANPR', status: 'offline', fps: 0, resolution: '1080P' },
    { id: 'L4-ANPR-B', title: 'ANPR Camera Rear', lane: 'Lane 4', type: 'ANPR', status: 'offline', fps: 0, resolution: '1080P' },
    { id: 'SURV-1', title: 'Surveillance Cam 1', lane: 'Plaza Overview', type: 'Surveillance', status: 'live', fps: 25, resolution: '4K UHD', lastEvent: 'Motion detected — 21:07:22' },
    { id: 'SURV-2', title: 'Surveillance Cam 2', lane: 'Entry Zone', type: 'Surveillance', status: 'live', fps: 25, resolution: '1080P' },
    { id: 'SURV-3', title: 'Surveillance Cam 3', lane: 'Exit Zone', type: 'Surveillance', status: 'live', fps: 25, resolution: '1080P' },
    { id: 'SURV-4', title: 'Surveillance Cam 4', lane: 'Parking Area', type: 'Surveillance', status: 'degraded', fps: 15, resolution: '720P', lastEvent: 'Signal degraded' },
  ];

  get liveCount(): number { return this.cameras.filter(c => c.status === 'live').length; }
  get offlineCount(): number { return this.cameras.filter(c => c.status === 'offline').length; }

  getGridClass(): string {
    const cols = this.gridCols();
    return cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-4';
  }
}
