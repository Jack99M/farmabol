import { Routes } from '@angular/router';
import { InventoryComponent } from './inventory/inventory.component';
import { SalesHistoryComponent } from './sales-history/sales-history.component';

export const routes: Routes = [
  { path: '', component: InventoryComponent },
  { path: 'ventas', component: SalesHistoryComponent },
  { path: '**', redirectTo: '' }
];
