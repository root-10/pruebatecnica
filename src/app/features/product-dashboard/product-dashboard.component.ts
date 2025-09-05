import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { Observer, Subject, takeUntil } from 'rxjs';
import { Product } from './interfaces/product';
import { ProductService } from './services/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-product-dashboard',
  standalone: true,
  imports: [CommonModule, UpperCasePipe],
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.css']
})
export class ProductDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private destroy$ = new Subject<void>();
  products: Product[] = [];
  tableHeader: string[] = ['nombre', 'precio', 'stock'];
  tableBody: any[] = [];
  selectedRow: number | null = null;
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProducts(): void {
    const observer: Observer<Product[]> = {
      next: (value) => {
        this.products = value;
        this.tableBody = this.products;
      },
      error: () => {
        this.products = [];
        this.tableBody = [];
      },
      complete: () => { }
    }
    this.productService.getProducts().pipe(
      takeUntil(this.destroy$)
    ).subscribe(observer)
  }

  toogleSelectionOfRow(product: Product) {
    if (this.selectedRow === product.id) {
      this.selectedRow = null;
      return;
    }
    this.selectedRow = product.id;
  }

  removeProduct() {
    if (!this.selectedRow)
      return;
    const observer: Observer<Product> = {
      next: () => {
        this.selectedRow = null;
        this.getProducts();
      },
      error: () => this.selectedRow = null,
      complete: () => { }
    }
    this.productService.deleteProduct(this.selectedRow).pipe(
      takeUntil(this.destroy$)
    ).subscribe(observer);
  }

  createProduct() { // Crear Producto al llenar modal (método de abajo)
    const body: Product = { id: 22, nombre: '', precio: 122, stock: 100 };
    const observer: Observer<Product> = {
      next: () => { this.getProducts() },
      error: () => { },
      complete: () => { }
    }
    this.productService.createProduct(body).pipe(
      takeUntil(this.destroy$)
    ).subscribe(observer);
  }

  openCreateModal() {
    const modalRef = this.modalService.open(ModalComponent);
  }
}
