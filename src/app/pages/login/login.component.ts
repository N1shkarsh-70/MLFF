import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex" [class.dark]="false">
      <!-- Left Branding Panel -->
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 relative overflow-hidden flex-col justify-between p-12">
        <!-- Background pattern -->
        <div class="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <!-- Animated road illustration -->
        <div class="absolute bottom-0 left-0 right-0 h-64 opacity-20">
          <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
            <rect width="800" height="300" fill="none"/>
            <!-- Road lanes -->
            <rect x="0" y="200" width="800" height="100" fill="#1a1a2e" opacity="0.5"/>
            <rect x="0" y="195" width="800" height="5" fill="white" opacity="0.3"/>
            <rect x="0" y="295" width="800" height="5" fill="white" opacity="0.3"/>
            <!-- Lane markers -->
            <line x1="0" y1="245" x2="800" y2="245" stroke="white" stroke-width="2" stroke-dasharray="40 30" opacity="0.4"/>
            <!-- Vehicles -->
            <rect x="100" y="210" width="60" height="30" rx="4" fill="#60a5fa" opacity="0.6"/>
            <rect x="300" y="215" width="80" height="25" rx="4" fill="#34d399" opacity="0.6"/>
            <rect x="550" y="208" width="100" height="35" rx="4" fill="#f472b6" opacity="0.5"/>
            <rect x="700" y="213" width="60" height="28" rx="4" fill="#fbbf24" opacity="0.6"/>
          </svg>
        </div>

        <!-- Floating decorative circles -->
        <div class="absolute top-20 right-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div class="absolute bottom-40 left-10 w-48 h-48 rounded-full bg-accent-400 opacity-10 blur-2xl"></div>

        <div class="relative z-10">
          <!-- Logo -->
          <div class="flex items-center mb-12">
            <img src="FLOW_LOGO3.png" alt="Trafiksol Logo" class="h-14 w-auto object-contain" style="filter: brightness(0) invert(1);" />
          </div>

          <h1 class="text-4xl font-bold text-white leading-tight mb-4">
            Multi Lane<br/>Free Flow<br/>
            <span class="text-accent-400">Tolling System</span>
          </h1>
          <p class="text-white/60 text-lg leading-relaxed max-w-sm">
            Advanced electronic toll collection platform for seamless, barrier-free highway management.
          </p>
        </div>

        <!-- Stats at bottom -->
        <div class="relative z-10 grid grid-cols-3 gap-6">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p class="text-white text-2xl font-bold">4</p>
            <p class="text-white/60 text-xs mt-1">Active Lanes</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p class="text-white text-2xl font-bold">₹2.4M</p>
            <p class="text-white/60 text-xs mt-1">Today's Revenue</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p class="text-white text-2xl font-bold">12,840</p>
            <p class="text-white/60 text-xs mt-1">Vehicles Today</p>
          </div>
        </div>
      </div>

      <!-- Right Login Panel -->
      <div class="flex-1 flex items-center justify-center p-8 bg-surface-light">
        <div class="w-full max-w-md animate-fade-in-up">
          <!-- Mobile logo -->
          <div class="lg:hidden flex items-center mb-8 justify-center">
            <img src="FLOW_LOGO3.png" alt="Trafiksol Logo" class="h-12 w-auto object-contain" />
          </div>

          <div class="bg-white rounded-2xl shadow-card-lg border border-surface-border p-8">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p class="text-gray-500 text-sm mt-1">Sign in to your administrator account</p>
            </div>

            <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
              <!-- Username -->
              <div class="mb-5">
                <label for="username" class="form-label">Username</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <input
                    id="username"
                    type="text"
                    [(ngModel)]="username"
                    name="username"
                    required
                    placeholder="Enter username"
                    class="form-input pl-9"
                    [class.border-red-400]="error()"
                  />
                </div>
              </div>

              <!-- Password -->
              <div class="mb-6">
                <label for="password" class="form-label">Password</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <input
                    id="password"
                    [type]="showPassword() ? 'text' : 'password'"
                    [(ngModel)]="password"
                    name="password"
                    required
                    placeholder="Enter password"
                    class="form-input pl-9 pr-10"
                    [class.border-red-400]="error()"
                  />
                  <button type="button" (click)="showPassword.set(!showPassword())"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    <svg *ngIf="!showPassword()" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg *ngIf="showPassword()" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Error message -->
              <div *ngIf="error()" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-fade-in-up">
                <svg class="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <p class="text-red-700 text-sm">Invalid credentials. Please try again.</p>
              </div>

              <!-- Submit -->
              <button
                type="submit"
                [disabled]="loading()"
                class="w-full btn-primary justify-center py-3 text-base rounded-xl relative overflow-hidden"
                id="login-submit-btn"
              >
                <span *ngIf="!loading()">Sign In to Dashboard</span>
                <span *ngIf="loading()" class="flex items-center gap-2">
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </span>
              </button>
            </form>

            <!-- Hint -->
            <div class="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p class="text-xs text-blue-700 text-center">
                <span class="font-semibold">Demo credentials:</span> admin / mlff&#64;123
              </p>
            </div>
          </div>

          <p class="text-center text-xs text-gray-400 mt-6">
            © 2024 National Highways Authority of India · MLFF Tolling System v2.4.1
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  error = signal(false);
  loading = signal(false);
  showPassword = signal(false);

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    this.error.set(false);
    this.loading.set(true);

    setTimeout(() => {
      const success = this.auth.login(this.username, this.password);
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set(true);
      }
      this.loading.set(false);
    }, 1000);
  }
}
