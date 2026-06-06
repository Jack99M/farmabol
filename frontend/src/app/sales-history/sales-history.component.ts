import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sales-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-container">
      <header class="header">
        <h1>📊 Historial de Ventas (Draft)</h1>
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
              <td>{{ s.id }}</td>
              <td>{{ s.productos?.nombre || 'Cargando...' }}</td>
              <td>{{ s.cantidad }}</td>
              <td>{{ s.fecha | date:'short' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class SalesHistoryComponent implements OnInit {
  sales: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // SMELL: Hardcoded URL and direct HTTP call (should be in service)
    this.http.get('http://localhost:4000/api/ventas').subscribe((data: any) => {
      this.sales = data;
      console.log('Sales loaded', this.sales);
    });
  }
}
