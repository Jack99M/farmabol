import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout-wrapper">
      <aside class="sidebar">
        <div class="sidebar-header">
          <span class="logo-icon">💊</span>
          <h2>Farmabol</h2>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/" class="nav-item" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <span class="icon">📦</span> Inventario
          </a>
          <a routerLink="/ventas" class="nav-item" routerLinkActive="active">
            <span class="icon">📊</span> Dashboard Ventas
          </a>
          <div class="nav-divider"></div>
          <a class="nav-item disabled"><span class="icon">👥</span> Usuarios</a>
          <a class="nav-item disabled"><span class="icon">⚙️</span> Configuración</a>
        </nav>
        <div class="sidebar-footer">
          <p>v1.0.4 - Hito 4</p>
        </div>
      </aside>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class App {
  title = 'Farmabol';
}
