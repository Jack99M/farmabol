import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../product.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app-container">
      <header class="header">
        <h1>📦 Gestión de Inventario</h1>
        <div class="header-actions">
          <input type="text" [(ngModel)]="searchTerm" (input)="filterProducts()" placeholder="Buscar por nombre o código..." class="search-input">
          <button class="btn-refresh" (click)="loadProducts()">Actualizar</button>
        </div>
      </header>

      <!-- Custom Modal: Venta -->
      <div class="modal-overlay" *ngIf="showSaleModal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Confirmar Venta</h3>
            <button class="close-btn" (click)="showSaleModal = false">×</button>
          </div>
          <div class="modal-body">
            <p>¿Desea registrar la venta de 1 unidad de <strong>{{ selectedProduct?.nombre }}</strong>?</p>
            <div class="info-row">
              <span>Precio:</span>
              <strong>Bs. {{ selectedProduct?.precio }}</strong>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="showSaleModal = false">Cancelar</button>
            <button class="btn-confirm" (click)="confirmSale()">Confirmar Venta</button>
          </div>
        </div>
      </div>

      <!-- Custom Modal: Traslado -->
      <div class="modal-overlay" *ngIf="showTransferModal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Registrar Traslado</h3>
            <button class="close-btn" (click)="showTransferModal = false">×</button>
          </div>
          <div class="modal-body">
            <p>Trasladar 1 unidad de <strong>{{ selectedProduct?.nombre }}</strong></p>
            <div class="form-group">
              <label>Sucursal de Destino:</label>
              <select [(ngModel)]="toSucursal" class="modal-select">
                <option value="Sucursal Sur">Sucursal Sur</option>
                <option value="Sucursal Norte">Sucursal Norte</option>
                <option value="Sucursal El Alto">Sucursal El Alto</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="showTransferModal = false">Cancelar</button>
            <button class="btn-confirm" (click)="confirmTransfer()">Realizar Traslado</button>
          </div>
        </div>
      </div>

      <!-- Toast Notification -->
      <div class="toast" [class.show]="showToast">
        {{ toastMessage }}
      </div>

      <div class="dashboard-summary">
        <div class="summary-card">
          <h3>Total Productos</h3>
          <p>{{ products.length }}</p>
        </div>
        <div class="summary-card alert">
          <h3>Stock Bajo (<10)</h3>
          <p>{{ lowStockCount }}</p>
        </div>
        <div class="summary-card warning">
          <h3>Por Vencer (<30d)</h3>
          <p>{{ expiringCount }}</p>
        </div>
      </div>

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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filteredProducts">
              <td class="code-cell">{{ p.codigo }}</td>
              <td><strong>{{ p.nombre }}</strong></td>
              <td class="price-cell">Bs. {{ p.precio }}</td>
              <td>
                <div class="stock-indicator">
                  <span [style.color]="p.stock < 10 ? '#ef4444' : '#4ade80'">{{ p.stock }}</span>
                  <div class="stock-bar">
                    <div class="stock-progress" [style.width.%]="p.stock > 100 ? 100 : p.stock" [style.background-color]="p.stock < 10 ? '#ef4444' : '#4ade80'"></div>
                  </div>
                </div>
              </td>
              <td>{{ p.fecha_vencimiento }}</td>
              <td>
                <span *ngIf="p.stock < 10" class="badge badge-low">Stock Bajo</span>
                <span *ngIf="isExpiringSoon(p.fecha_vencimiento)" class="badge badge-warning">Próximo a Vencer</span>
                <span *ngIf="p.stock >= 10 && !isExpiringSoon(p.fecha_vencimiento)" class="badge badge-ok">Disponible</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-sell" (click)="sellProduct(p)" [disabled]="p.stock <= 0" title="Vender 1 unidad">
                    💰 Vender
                  </button>
                  <button class="btn-transfer" (click)="transferProduct(p)" [disabled]="p.stock <= 0" title="Trasladar a otra sucursal">
                    🚚 Traslado
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredProducts.length === 0">
              <td colspan="7" style="text-align: center; padding: 60px; color: #94a3b8;">
                <span style="font-size: 3rem; display: block; margin-bottom: 10px;">🔍</span>
                No se encontraron productos que coincidan con su búsqueda.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class InventoryComponent implements OnInit {
  public products: Product[] = [];
  public filteredProducts: Product[] = [];
  public searchTerm: string = '';
  
  public lowStockCount: number = 0;
  public expiringCount: number = 0;

  // Modal State
  public showSaleModal: boolean = false;
  public showTransferModal: boolean = false;
  public selectedProduct: Product | null = null;
  public toSucursal: string = 'Sucursal Sur';

  // Toast State
  public showToast: boolean = false;
  public toastMessage: string = '';

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.calculateStats();
        this.filterProducts();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.showNotify('❌ Error al cargar productos');
      }
    });
  }

  calculateStats(): void {
    this.lowStockCount = this.products.filter(p => p.stock < 10).length;
    this.expiringCount = this.products.filter(p => this.isExpiringSoon(p.fecha_vencimiento)).length;
  }

  filterProducts(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(p => 
      p.nombre.toLowerCase().includes(term) || 
      p.codigo.toLowerCase().includes(term)
    );
  }

  // --- Modal Launchers ---
  sellProduct(product: Product): void {
    this.selectedProduct = product;
    this.showSaleModal = true;
    this.cdr.detectChanges();
  }

  transferProduct(product: Product): void {
    this.selectedProduct = product;
    this.showTransferModal = true;
    this.cdr.detectChanges();
  }

  // --- Confirmation Logic ---
  confirmSale(): void {
    if (!this.selectedProduct?.id) return;

    this.productService.createSale({
      productId: this.selectedProduct.id,
      quantity: 1,
      sucursalId: 'sucursal-001'
    }).subscribe({
      next: () => {
        this.showSaleModal = false;
        this.showNotify('✅ Venta registrada correctamente');
        setTimeout(() => this.loadProducts(), 1000);
      },
      error: (err) => this.showNotify('❌ Error: ' + err.message)
    });
  }

  confirmTransfer(): void {
    if (!this.selectedProduct?.id) return;

    this.productService.transferStock({
      productId: this.selectedProduct.id,
      quantity: 1,
      fromSucursal: 'Sucursal Central',
      toSucursal: this.toSucursal
    }).subscribe({
      next: () => {
        this.showTransferModal = false;
        this.showNotify('🚚 Traslado encolado con éxito');
        setTimeout(() => this.loadProducts(), 1000);
      },
      error: (err) => this.showNotify('❌ Error: ' + err.message)
    });
  }

  showNotify(msg: string): void {
    this.toastMessage = msg;
    this.showToast = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 3000);
  }

  isExpiringSoon(dateStr: string | undefined): boolean {
    if (!dateStr) return false;
    const expDate = new Date(dateStr);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  }
}
