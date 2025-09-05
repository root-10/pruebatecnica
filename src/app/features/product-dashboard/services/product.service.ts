import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  httpClient = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${environment.server}${environment.endpoints.products}`);
  }

  createProduct(body: Product): Observable<Product> {
    return this.httpClient.post<Product>(`${environment.server}${environment.endpoints.products}`, body);
  }

  deleteProduct(id: number): Observable<Product> {
    return this.httpClient.delete<Product>(`${environment.server}${environment.endpoints.products}/${id}`);
  }
}
