import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Sale } from '../product.service';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-container">
      <header class="header">
        <h1>📊 Dashboard de Ventas</h1>
        <button class="btn-refresh" (click)="loadSales()">Actualizar</button>
      </header>

      <div class="dashboard-summary">
        <div class="summary-card">
          <h3>Total Transacciones</h3>
          <p>{{ sales.length }}</p>
          <span class="trend">↑ 12% vs ayer</span>
        </div>
        <div class="summary-card">
          <h3>Unidades Vendidas</h3>
          <p>{{ totalItems }}</p>
          <span class="trend">↑ 5% vs ayer</span>
        </div>
        <div class="summary-card primary">
          <h3>Ingresos Estimados</h3>
          <p>Bs. {{ totalRevenue | number:'1.2-2' }}</p>
          <span class="trend">Hoy</span>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="chart-section">
          <h3>📈 Top 5 Productos más Vendidos</h3>
          <div class="bar-chart">
            <div class="chart-item" *ngFor="let p of topProducts">
              <div class="item-info">
                <span>{{ p.name }}</span>
                <span>{{ p.count }} uds</span>
              </div>
              <div class="bar-bg">
                <div class="bar-fill" [style.width.%]="p.percent"></div>
              </div>
            </div>
            <div *ngIf="topProducts.length === 0" class="empty-chart">
              No hay datos suficientes para generar el gráfico.
            </div>
          </div>
        </div>

        <div class="table-section">
          <h3>📝 Historial Reciente</h3>
          <div class="table-container compact">
            <table>
              <thead>
                <tr>
                  <th>Venta</th>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of sales.slice(0, 10)">
                  <td class="code-cell">#{{ s.id.substring(0,5).toUpperCase() }}</td>
                  <td><strong>{{ s.productos?.nombre || 'Producto' }}</strong></td>
                  <td>{{ s.cantidad }}</td>
                  <td>{{ s.fecha | date:'shortTime' }}</td>
                </tr>
                <tr *ngIf="sales.length === 0">
                  <td colspan="4" style="text-align: center; padding: 20px; color: #64748b;">
                    Sin registros...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SalesHistoryComponent implements OnInit {
  public sales: Sale[] = [];
  public totalItems: number = 0;
  public totalRevenue: number = 0;
  public topProducts: { name: string, count: number, percent: number }[] = [];

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.productService.getSales().subscribe({
      next: (data) => {
        this.sales = data;
        this.calculateStats();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading sales', err);
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats() {
    this.totalItems = this.sales.reduce((acc, s) => acc + s.cantidad, 0);
    this.totalRevenue = this.sales.length * 45.5; // Placeholder

    const counts: { [key: string]: number } = {};
    this.sales.forEach(s => {
      const name = s.productos?.nombre || 'Desconocido';
      counts[name] = (counts[name] || 0) + s.cantidad;
    });

    const sorted = Object.keys(counts).map(name => ({
      name,
      count: counts[name]
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    const max = sorted.length > 0 ? sorted[0].count : 1;
    this.topProducts = sorted.map(p => ({
      ...p,
      percent: (p.count / max) * 100
    }));
  }
}
