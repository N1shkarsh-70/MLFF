import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen overflow-hidden bg-surface-light dark:bg-dark-bg transition-colors duration-300">

      <!-- Mobile Backdrop -->
      <div *ngIf="sidebarOpen()" (click)="sidebarOpen.set(false)" class="fixed inset-0 bg-gray-900/50 dark:bg-black/60 z-20 md:hidden backdrop-blur-sm transition-opacity duration-300"></div>

      <!-- ===== SIDEBAR ===== -->
      <aside
        [class]="sidebarOpen() ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 w-64 md:w-16'"
        class="fixed md:relative inset-y-0 left-0 sidebar-transition flex-shrink-0 bg-white dark:bg-dark-card border-r border-surface-border dark:border-dark-border flex flex-col z-30 transition-transform duration-300 ease-in-out"
      >
        <!-- Logo -->
        <div class="h-16 flex items-center px-4 border-b border-surface-border dark:border-dark-border flex-shrink-0">
          <div class="flex items-center overflow-hidden">
            <img src="flow.png" alt="Trafiksol Logo" class="h-9 w-auto object-contain flex-shrink-0" />
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          <p *ngIf="sidebarOpen()" class="text-xs font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2 mt-1">Main</p>

          <ng-container *ngFor="let item of navItems">
            <a
              [routerLink]="item.route"
              routerLinkActive="active"
              class="nav-item group relative"
              [title]="!sidebarOpen() ? item.label : ''"
            >
              <!-- Icon -->
              <span class="flex-shrink-0 w-5 h-5" [innerHTML]="item.icon"></span>

              <!-- Label + badge -->
              <span *ngIf="sidebarOpen()" class="flex-1 truncate text-sm">{{ item.label }}</span>
              <span *ngIf="sidebarOpen() && item.badge"
                class="ml-auto bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {{ item.badge }}
              </span>

              <!-- Tooltip when collapsed -->
              <div *ngIf="!sidebarOpen()"
                class="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-150">
                {{ item.label }}
              </div>
            </a>
          </ng-container>

          <div class="pt-3 pb-1">
            <div class="border-t border-surface-border dark:border-dark-border"></div>
          </div>

          <p *ngIf="sidebarOpen()" class="text-xs font-semibold uppercase tracking-widest text-gray-400 px-3 mb-2 mt-1">System</p>

          <ng-container *ngFor="let item of systemNavItems">
            <a
              [routerLink]="item.route"
              routerLinkActive="active"
              class="nav-item group relative"
              [title]="!sidebarOpen() ? item.label : ''"
            >
              <span class="flex-shrink-0 w-5 h-5" [innerHTML]="item.icon"></span>
              <span *ngIf="sidebarOpen()" class="flex-1 truncate text-sm">{{ item.label }}</span>
              <div *ngIf="!sidebarOpen()"
                class="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-150">
                {{ item.label }}
              </div>
            </a>
          </ng-container>
        </nav>

        <!-- User info at bottom -->
        <div class="border-t border-surface-border dark:border-dark-border p-3 flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {{ auth.currentUser()?.name?.charAt(0) || 'A' }}
            </div>
            <div *ngIf="sidebarOpen()" class="overflow-hidden">
              <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ auth.currentUser()?.name }}</p>
              <p class="text-xs text-gray-400 truncate">{{ auth.currentUser()?.role }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- ===== MAIN CONTENT ===== -->
      <div class="flex-1 flex flex-col overflow-hidden">

        <!-- ===== HEADER ===== -->
        <header class="h-16 bg-white dark:bg-dark-card border-b border-surface-border dark:border-dark-border flex items-center px-4 gap-4 z-20 flex-shrink-0">

          <!-- Sidebar Toggle -->
          <button
            (click)="sidebarOpen.set(!sidebarOpen())"
            id="sidebar-toggle"
            class="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-all"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <!-- Breadcrumb -->
          <div class="flex items-center gap-1 sm:gap-2 text-sm text-gray-500 dark:text-slate-400 flex-1 min-w-0">
            <span class="hidden sm:inline text-gray-300 dark:text-slate-600">MLFF</span>
            <svg class="hidden sm:inline w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
            <span class="font-medium text-gray-900 dark:text-white capitalize truncate">{{ getCurrentPageName() }}</span>
          </div>

          <!-- Right Controls -->
          <div class="flex items-center gap-1 md:gap-2">

            <!-- Date/Time -->
            <div class="hidden md:block text-right mr-2">
              <p class="text-xs font-semibold text-gray-700 dark:text-slate-200">{{ currentTime }}</p>
              <p class="text-xs text-gray-400">{{ currentDate }}</p>
            </div>

            <!-- Alerts -->
            <button class="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Dark Mode Toggle -->
            <button
              (click)="theme.toggle()"
              id="theme-toggle"
              class="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-all"
            >
              <!-- Sun -->
              <svg *ngIf="theme.isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
              <!-- Moon -->
              <svg *ngIf="!theme.isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            </button>

            <!-- Profile Dropdown -->
            <div class="relative">
              <button
                (click)="profileOpen.set(!profileOpen())"
                id="profile-btn"
                class="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
              >
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                  {{ auth.currentUser()?.name?.charAt(0) || 'A' }}
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white leading-none">{{ auth.currentUser()?.name }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ auth.currentUser()?.role }}</p>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Dropdown -->
              <div *ngIf="profileOpen()"
                class="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-dark-card rounded-xl shadow-card-lg border border-surface-border dark:border-dark-border z-50 overflow-hidden animate-fade-in-up">
                <div class="px-4 py-3 border-b border-surface-border dark:border-dark-border">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ auth.currentUser()?.name }}</p>
                  <p class="text-xs text-gray-400">{{ auth.currentUser()?.email }}</p>
                </div>
                <div class="py-1">
                  <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    My Profile
                  </button>
                  <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    Settings
                  </button>
                </div>
                <div class="border-t border-surface-border dark:border-dark-border py-1">
                  <button (click)="auth.logout()" id="logout-btn"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- ===== PAGE CONTENT ===== -->
        <main class="flex-1 overflow-y-auto p-6 bg-surface-light dark:bg-dark-bg">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class ShellComponent {
  sidebarOpen = signal(true);
  profileOpen = signal(false);
  currentTime = '';
  currentDate = '';

  navItems: NavItem[] = [
    {
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
      label: 'Dashboard', route: '/dashboard'
    },
    {
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`,
      label: 'Live Streaming', route: '/live-streaming', badge: 4
    },
    {
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`,
      label: 'Toll Transactions', route: '/toll-transactions'
    },
    {
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
      label: 'Audit', route: '/audit'
    },
    {
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>`,
      label: 'E-Ticket', route: '/e-ticket', badge: 7
    },
  ];

  systemNavItems: NavItem[] = [
    {
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>`,
      label: 'NMS', route: '/nms'
    },
    {
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
      label: 'Report', route: '/report'
    },
    {
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
      label: 'Configuration', route: '/configuration'
    },
  ];

  constructor(public auth: AuthService, public theme: ThemeService) {
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 1000);
    
    // Close sidebar by default on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.sidebarOpen.set(false);
    }
  }

  updateDateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.currentDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getCurrentPageName(): string {
    const path = window.location.pathname.replace('/', '').replace('-', ' ');
    return path || 'dashboard';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('#profile-btn') && !target.closest('.profile-dropdown')) {
      this.profileOpen.set(false);
    }
  }
}
