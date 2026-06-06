import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  codigo: string;
  nombre: string;
  precio: number;
  stock: number;
  fecha_vencimiento: string;
  imagen_url?: string;
}

export interface Sale {
  id: string;
  producto_id: string;
  cantidad: number;
  fecha: string;
  sucursal_id: string;
  productos?: {
    nombre: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Configuración dinámica para despliegue
  private baseUrl = window.location.hostname === 'localhost' 
    ? 'http://localhost:4000' 
    : 'https://farmabol-cit0.onrender.com';

  private apiUrl = `${this.baseUrl}/api/productos`;
  private salesUrl = `${this.baseUrl}/api/ventas`;
  private transferUrl = `${this.baseUrl}/api/transferencias`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.salesUrl);
  }

  createSale(saleData: { productId: string; quantity: number; sucursalId: string }): Observable<any> {
    return this.http.post(this.salesUrl, saleData);
  }

  transferStock(transferData: { productId: string; quantity: number; fromSucursal: string; toSucursal: string }): Observable<any> {
    return this.http.post(this.transferUrl, transferData);
  }
}
