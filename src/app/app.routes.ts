import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'live-streaming',
        loadComponent: () => import('./pages/live-streaming/live-streaming.component').then(m => m.LiveStreamingComponent)
      },
      {
        path: 'toll-transactions',
        loadComponent: () => import('./pages/toll-transactions/toll-transactions.component').then(m => m.TollTransactionsComponent)
      },
      {
        path: 'audit',
        loadComponent: () => import('./pages/audit/audit.component').then(m => m.AuditComponent)
      },
      {
        path: 'e-ticket',
        loadComponent: () => import('./pages/e-ticket/e-ticket.component').then(m => m.ETicketComponent)
      },
      {
        path: 'nms',
        loadComponent: () => import('./pages/nms/nms.component').then(m => m.NmsComponent)
      },
      {
        path: 'report',
        loadComponent: () => import('./pages/report/report.component').then(m => m.ReportComponent)
      },
      {
        path: 'configuration',
        loadComponent: () => import('./pages/configuration/configuration.component').then(m => m.ConfigurationComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
