import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="main-nav">
      <a routerLink="/" class="nav-item">📦 Inventario</a>
      <a routerLink="/ventas" class="nav-item">📊 Ventas</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class App {
  title = 'Farmabol';
}
