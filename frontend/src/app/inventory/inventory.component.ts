import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../product.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-900 text-white p-8">
      <div class="max-w-6xl mx-auto">
        <header class="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h1 class="text-3xl font-bold text-blue-400">💊 Farmabol - Inventario</h1>
          <div class="text-sm text-gray-400">Hito 3 + Hito 4 | Gestión de Stock</div>
        </header>

        <div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <table class="w-full text-left">
            <thead class="bg-gray-700 text-gray-300 uppercase text-xs">
              <tr>
                <th class="px-6 py-4">Código</th>
                <th class="px-6 py-4">Producto</th>
                <th class="px-6 py-4">Precio</th>
                <th class="px-6 py-4">Stock</th>
                <th class="px-6 py-4">Vencimiento</th>
                <th class="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
              <tr *ngFor="let p of products" class="hover:bg-gray-750 transition-colors">
                <td class="px-6 py-4 font-mono text-sm text-blue-300">{{ p.codigo }}</td>
                <td class="px-6 py-4 font-semibold">{{ p.nombre }}</td>
                <td class="px-6 py-4 text-green-400">Bs. {{ p.precio }}</td>
                <td class="px-6 py-4">
                  <span [ngClass]="p.stock < 10 ? 'text-red-500 font-bold' : 'text-gray-300'">
                    {{ p.stock }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-400">{{ p.fecha_vencimiento }}</td>
                <td class="px-6 py-4">
                  <span *ngIf="p.stock < 10" class="bg-red-900 text-red-200 text-xs px-2 py-1 rounded-full border border-red-700">
                    Stock Bajo
                  </span>
                  <span *ngIf="p.stock >= 10" class="bg-green-900 text-green-200 text-xs px-2 py-1 rounded-full border border-green-700">
                    Normal
                  </span>
                </td>
              </tr>
              <tr *ngIf="products.length === 0">
                <td colspan="6" class="px-6 py-10 text-center text-gray-500 italic">No hay productos registrados...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class InventoryComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error loading products', err)
    });
  }
}
