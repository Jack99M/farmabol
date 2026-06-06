import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../product.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-container">
      <header class="header">
        <h1>💊 Farmabol - Inventario</h1>
        <button class="btn-refresh" (click)="loadProducts()">Actualizar</button>
      </header>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Vencimiento</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of products">
              <td class="code-cell">{{ p.codigo }}</td>
              <td><strong>{{ p.nombre }}</strong></td>
              <td class="price-cell">Bs. {{ p.precio }}</td>
              <td>
                <span [style.color]="p.stock < 10 ? '#ef4444' : 'inherit'">
                  {{ p.stock }}
                </span>
              </td>
              <td>{{ p.fecha_vencimiento }}</td>
              <td>
                <span *ngIf="p.stock < 10" class="badge badge-low">Stock Bajo</span>
                <span *ngIf="p.stock >= 10" class="badge badge-ok">Normal</span>
              </td>
            </tr>
            <tr *ngIf="products.length === 0">
              <td colspan="6" style="text-align: center; padding: 40px; color: #64748b;">
                No hay productos registrados...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class InventoryComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error loading products', err)
    });
  }
}
