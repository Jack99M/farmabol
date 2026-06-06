import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Sale } from '../product.service';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-container">
      <header class="header">
        <h1>📊 Historial de Ventas</h1>
      </header>
      
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of sales">
              <td class="code-cell">{{ s.id.substring(0,8) }}...</td>
              <td><strong>{{ s.productos?.nombre || 'Producto' }}</strong></td>
              <td>{{ s.cantidad }} unidades</td>
              <td>{{ s.fecha | date:'medium' }}</td>
            </tr>
            <tr *ngIf="sales.length === 0">
              <td colspan="4" style="text-align: center; padding: 40px; color: #64748b;">
                No se han registrado ventas aún...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SalesHistoryComponent implements OnInit {
  sales: Sale[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.productService.getSales().subscribe({
      next: (data) => this.sales = data,
      error: (err) => console.error('Error loading sales', err)
    });
  }
}
