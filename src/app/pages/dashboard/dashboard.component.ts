import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface KpiCard {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: string;
  iconBg: string;
  iconColor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="animate-fade-in-up">
      <!-- Page Header -->
      <div class="page-header flex items-center justify-between">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Real-time overview of MLFF tolling operations · NH-48 Gurugram Plaza</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Operational
          </span>
          <button class="btn-secondary text-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- KPI Cards Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div *ngFor="let card of kpiCards; let i = index"
          class="card card-hover p-4 cursor-pointer animate-fade-in-up"
          [style.animation-delay]="(i * 80) + 'ms'">
          <div class="flex items-start justify-between mb-3">
            <div [class]="'w-10 h-10 rounded-xl flex items-center justify-center ' + card.iconBg">
              <span [innerHTML]="card.icon" [class]="card.iconColor"></span>
            </div>
            <span [class]="'text-xs font-semibold ' + (card.changeType === 'up' ? 'text-green-600' : card.changeType === 'down' ? 'text-red-600' : 'text-gray-400')">
              {{ card.change }}
            </span>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white animate-count-up">{{ card.value }}</p>
          <p class="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{{ card.label }}</p>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        <!-- Bar Chart - Hourly Transactions -->
        <div class="card p-5 lg:col-span-2 animate-fade-in-up delay-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Transaction Volume</h3>
              <p class="text-xs text-gray-500 mt-0.5">Hourly breakdown · Today</p>
            </div>
            <div class="flex items-center gap-2">
              <button class="text-xs px-3 py-1 rounded-full bg-primary-700 text-white font-medium">Hourly</button>
              <button class="text-xs px-3 py-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Daily</button>
              <button class="text-xs px-3 py-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Weekly</button>
            </div>
          </div>
          <!-- Bar Chart SVG -->
          <div class="relative h-48">
            <svg class="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
              <!-- Grid lines -->
              <line x1="0" y1="36" x2="600" y2="36" stroke="#E8E6E1" stroke-width="1" stroke-dasharray="4 4"/>
              <line x1="0" y1="72" x2="600" y2="72" stroke="#E8E6E1" stroke-width="1" stroke-dasharray="4 4"/>
              <line x1="0" y1="108" x2="600" y2="108" stroke="#E8E6E1" stroke-width="1" stroke-dasharray="4 4"/>
              <line x1="0" y1="144" x2="600" y2="144" stroke="#E8E6E1" stroke-width="1" stroke-dasharray="4 4"/>

              <!-- Bars -->
              <g *ngFor="let bar of barData; let i = index">
                <!-- Background bar -->
                <rect [attr.x]="i * 50 + 8" y="0" [attr.height]="180" width="34" rx="4" fill="#F8F7F4" class="dark:fill-slate-700/50"/>
                <!-- Data bar with gradient -->
                <defs>
                  <linearGradient [attr.id]="'bar-grad-' + i" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#1d4ed8"/>
                    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.7"/>
                  </linearGradient>
                </defs>
                <rect
                  [attr.x]="i * 50 + 8"
                  [attr.y]="180 - bar.height"
                  [attr.height]="bar.height"
                  width="34"
                  rx="4"
                  [attr.fill]="'url(#bar-grad-' + i + ')'"
                  class="transition-all duration-700"
                />
                <!-- Label -->
                <text [attr.x]="i * 50 + 25" y="178" text-anchor="middle" class="fill-gray-400" style="font-size: 9px; font-family: Inter, sans-serif;">
                  {{ bar.label }}
                </text>
                <!-- Value -->
                <text [attr.x]="i * 50 + 25" [attr.y]="180 - bar.height - 5" text-anchor="middle" class="fill-primary-700" style="font-size: 9px; font-weight: 600; font-family: Inter, sans-serif;">
                  {{ bar.value }}
                </text>
              </g>
            </svg>
          </div>

          <!-- Legend -->
          <div class="flex items-center gap-6 mt-3 pt-3 border-t border-surface-border dark:border-dark-border">
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 rounded-sm bg-primary-700"></div>
              <span class="text-xs text-gray-500">Transactions</span>
            </div>
            <div class="flex items-center gap-1.5 ml-4">
              <span class="text-xs font-semibold text-gray-700 dark:text-slate-300">Peak: 08:00 — 09:00</span>
            </div>
            <div class="ml-auto text-xs text-gray-400">Total Today: <span class="font-semibold text-gray-700 dark:text-slate-200">12,840</span></div>
          </div>
        </div>

        <!-- Pie Chart - Vehicle Classes -->
        <div class="card p-5 animate-fade-in-up delay-300">
          <div class="mb-4">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Vehicle Classification</h3>
            <p class="text-xs text-gray-500 mt-0.5">Distribution · Today</p>
          </div>

          <!-- Pie Chart SVG -->
          <div class="flex justify-center mb-4">
            <div class="relative w-40 h-40">
              <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90 drop-shadow-lg">
                <!-- Background circle -->
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F3F4F6" stroke-width="12"/>
                <!-- Pie segments using stroke-dasharray trick -->
                <circle cx="50" cy="50" r="38" fill="none" stroke="#1d4ed8" stroke-width="12"
                  stroke-dasharray="91.2 147.7" stroke-dashoffset="0" stroke-linecap="round"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0ea5e9" stroke-width="12"
                  stroke-dasharray="55.3 183.6" stroke-dashoffset="-91.2" stroke-linecap="round"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#22c55e" stroke-width="12"
                  stroke-dasharray="38.9 200" stroke-dashoffset="-146.5" stroke-linecap="round"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" stroke-width="12"
                  stroke-dasharray="26.7 212.2" stroke-dashoffset="-185.4" stroke-linecap="round"/>
                <circle cx="50" cy="50" r="38" fill="none" stroke="#ef4444" stroke-width="12"
                  stroke-dasharray="26.8 212.1" stroke-dashoffset="-212.1" stroke-linecap="round"/>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-2xl font-bold text-gray-900 dark:text-white">12.8K</p>
                <p class="text-xs text-gray-400">Vehicles</p>
              </div>
            </div>
          </div>

          <!-- Legend -->
          <div class="space-y-2">
            <div *ngFor="let cls of vehicleClasses" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" [style.background-color]="cls.color"></div>
                <span class="text-xs text-gray-600 dark:text-slate-400">{{ cls.label }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                  <div class="h-full rounded-full" [style.width]="cls.pct + '%'" [style.background-color]="cls.color"></div>
                </div>
                <span class="text-xs font-semibold text-gray-700 dark:text-slate-300 w-8 text-right">{{ cls.pct }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- Revenue Trend Line Chart -->
        <div class="card p-5 lg:col-span-2 animate-fade-in-up delay-400">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Revenue Trend</h3>
              <p class="text-xs text-gray-500 mt-0.5">Last 7 days</p>
            </div>
            <p class="text-2xl font-bold text-primary-700">₹16.8L</p>
          </div>

          <div class="relative h-40">
            <svg class="w-full h-full" viewBox="0 0 600 140" preserveAspectRatio="none">
              <defs>
                <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#1d4ed8" stop-opacity="0.15"/>
                  <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <!-- Grid -->
              <line x1="0" y1="35" x2="600" y2="35" stroke="#E8E6E1" stroke-width="1" stroke-dasharray="4 4"/>
              <line x1="0" y1="70" x2="600" y2="70" stroke="#E8E6E1" stroke-width="1" stroke-dasharray="4 4"/>
              <line x1="0" y1="105" x2="600" y2="105" stroke="#E8E6E1" stroke-width="1" stroke-dasharray="4 4"/>
              <!-- Area fill -->
              <path d="M0,110 L85,95 L170,70 L255,80 L340,45 L425,55 L510,30 L600,40 L600,140 L0,140 Z"
                fill="url(#line-grad)"/>
              <!-- Line -->
              <path d="M0,110 L85,95 L170,70 L255,80 L340,45 L425,55 L510,30 L600,40"
                fill="none" stroke="#1d4ed8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Data points -->
              <circle cx="0" cy="110" r="4" fill="#1d4ed8"/>
              <circle cx="85" cy="95" r="4" fill="#1d4ed8"/>
              <circle cx="170" cy="70" r="4" fill="#1d4ed8"/>
              <circle cx="255" cy="80" r="4" fill="#1d4ed8"/>
              <circle cx="340" cy="45" r="4" fill="#1d4ed8"/>
              <circle cx="425" cy="55" r="4" fill="#1d4ed8"/>
              <circle cx="510" cy="30" r="4" fill="#1d4ed8"/>
              <circle cx="600" cy="40" r="4" fill="#1d4ed8"/>
              <!-- Labels -->
              <text x="0" y="135" style="font-size:9px;fill:#94A3B8;font-family:Inter">Mon</text>
              <text x="80" y="135" style="font-size:9px;fill:#94A3B8;font-family:Inter">Tue</text>
              <text x="165" y="135" style="font-size:9px;fill:#94A3B8;font-family:Inter">Wed</text>
              <text x="250" y="135" style="font-size:9px;fill:#94A3B8;font-family:Inter">Thu</text>
              <text x="335" y="135" style="font-size:9px;fill:#94A3B8;font-family:Inter">Fri</text>
              <text x="420" y="135" style="font-size:9px;fill:#94A3B8;font-family:Inter">Sat</text>
              <text x="505" y="135" style="font-size:9px;fill:#94A3B8;font-family:Inter">Sun</text>
            </svg>
          </div>
        </div>

        <!-- Lane Status -->
        <div class="card p-5 animate-fade-in-up delay-500">
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-4">Lane Status</h3>
          <div class="space-y-3">
            <div *ngFor="let lane of laneStatus; let i = index"
              class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              [class.animate-fade-in-up]="true"
              [style.animation-delay]="(i * 100) + 'ms'"
            >
              <div class="flex items-center gap-3">
                <div class="relative">
                  <div [class]="'w-3 h-3 rounded-full ' + (lane.active ? 'bg-green-500' : 'bg-red-500')"></div>
                  <div *ngIf="lane.active" class="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40"></div>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ lane.name }}</p>
                  <p class="text-xs text-gray-400">{{ lane.vehicles }} veh/hr</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-xs font-semibold text-gray-700 dark:text-slate-300">₹{{ lane.revenue }}</p>
                <span [class]="lane.active ? 'badge-online text-xs' : 'badge-offline text-xs'">
                  {{ lane.active ? 'Active' : 'Offline' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions / Alerts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <!-- Recent Transactions -->
        <div class="card animate-fade-in-up delay-300">
          <div class="flex items-center justify-between px-5 py-4 border-b border-surface-border dark:border-dark-border">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Recent Transactions</h3>
            <a routerLink="/toll-transactions" class="text-xs text-primary-600 hover:text-primary-700 font-medium">View All →</a>
          </div>
          <div class="divide-y divide-surface-border dark:divide-dark-border">
            <div *ngFor="let txn of recentTransactions" class="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ txn.vrn }}</p>
                  <p class="text-xs text-gray-400">{{ txn.time }} · {{ txn.lane }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">₹{{ txn.amount }}</p>
                <span [class]="txn.status === 'Paid' ? 'badge-success text-xs' : 'badge-failed text-xs'">
                  <span class="w-1.5 h-1.5 rounded-full" [class]="txn.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'"></span>
                  {{ txn.status }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- System Alerts -->
        <div class="card animate-fade-in-up delay-400">
          <div class="flex items-center justify-between px-5 py-4 border-b border-surface-border dark:border-dark-border">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">System Alerts</h3>
            <span class="badge-failed text-xs"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>3 Active</span>
          </div>
          <div class="divide-y divide-surface-border dark:divide-dark-border">
            <div *ngFor="let alert of systemAlerts" class="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <div [class]="'w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center ' + alert.iconBg">
                <span [innerHTML]="alert.icon" [class]="alert.iconColor"></span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ alert.title }}</p>
                <p class="text-xs text-gray-400 mt-0.5 truncate">{{ alert.desc }}</p>
              </div>
              <span class="text-xs text-gray-400 flex-shrink-0 mt-0.5">{{ alert.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  kpiCards: KpiCard[] = [
    {
      label: 'Total Revenue',
      value: '₹24.8L',
      change: '+12.4%',
      changeType: 'up',
      iconBg: 'bg-blue-50',
      iconColor: 'text-primary-700',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
    {
      label: 'Total Vehicles',
      value: '12,840',
      change: '+8.2%',
      changeType: 'up',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>`
    },
    {
      label: 'Transactions',
      value: '12,284',
      change: '+6.1%',
      changeType: 'up',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>`
    },
    {
      label: 'Violations',
      value: '556',
      change: '-3.2%',
      changeType: 'down',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`
    },
    {
      label: 'Active Lanes',
      value: '4 / 4',
      change: '100%',
      changeType: 'neutral',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
    {
      label: 'Failed Txns',
      value: '38',
      change: '-18.4%',
      changeType: 'down',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
      icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
  ];

  barData = [
    { label: '06', value: '342', height: 40 },
    { label: '07', value: '854', height: 80 },
    { label: '08', value: '1.2K', height: 120 },
    { label: '09', value: '1.4K', height: 140 },
    { label: '10', value: '1.1K', height: 110 },
    { label: '11', value: '980', height: 95 },
    { label: '12', value: '1.3K', height: 128 },
    { label: '13', value: '1.0K', height: 100 },
    { label: '14', value: '890', height: 88 },
    { label: '15', value: '960', height: 96 },
    { label: '16', value: '1.1K', height: 112 },
    { label: '17', value: '745', height: 74 },
  ];

  vehicleClasses = [
    { label: 'Car / Jeep', color: '#1d4ed8', pct: 38 },
    { label: 'LCV / Mini Bus', color: '#0ea5e9', pct: 23 },
    { label: 'Bus / Truck', color: '#22c55e', pct: 16 },
    { label: '3-Axle Vehicle', color: '#f59e0b', pct: 11 },
    { label: 'Over Sized', color: '#ef4444', pct: 12 },
  ];

  laneStatus = [
    { name: 'Lane 1 — Entry', active: true, vehicles: 342, revenue: '84.2K' },
    { name: 'Lane 2 — Entry', active: true, vehicles: 298, revenue: '71.6K' },
    { name: 'Lane 3 — Exit', active: true, vehicles: 226, revenue: '54.4K' },
    { name: 'Lane 4 — Exit', active: false, vehicles: 0, revenue: '0' },
  ];

  recentTransactions = [
    { vrn: 'HR26 DX 4421', time: '21:08', lane: 'Lane 1', amount: '185', status: 'Paid' },
    { vrn: 'DL01 CA 2291', time: '21:06', lane: 'Lane 2', amount: '285', status: 'Paid' },
    { vrn: 'MH04 BK 9934', time: '21:04', lane: 'Lane 3', amount: '445', status: 'Failed' },
    { vrn: 'UP32 AT 5512', time: '21:02', lane: 'Lane 1', amount: '185', status: 'Paid' },
    { vrn: 'PB10 CG 7743', time: '21:00', lane: 'Lane 2', amount: '685', status: 'Paid' },
  ];

  systemAlerts = [
    {
      title: 'ANPR Camera Offline',
      desc: 'Lane 4 Front Camera — Connection timeout',
      time: '5m ago',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`
    },
    {
      title: 'High Violation Rate',
      desc: 'Lane 2 — No FASTag vehicles: 12 in last 30 min',
      time: '12m ago',
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`
    },
    {
      title: 'Transaction Sync Delay',
      desc: 'Bank gateway response >3s for last 8 transactions',
      time: '28m ago',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
      icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
    {
      title: 'RFID Reader Degraded',
      desc: 'Lane 3 RFID — Read rate below 95%',
      time: '1h ago',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
    },
  ];

  ngOnInit(): void {}
}
