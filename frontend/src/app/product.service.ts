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
  private apiUrl = 'http://localhost:4000/api/productos';
  private salesUrl = 'http://localhost:4000/api/ventas';

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
}
