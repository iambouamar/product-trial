import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Product } from "app/products/data-access/product.model";
import { ProductsService } from "app/products/data-access/products.service";
import { ProductFormComponent } from "app/products/ui/product-form/product-form.component";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DataViewModule, DataView } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";
import { TagModule } from "primeng/tag";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { CartService } from "app/cart/data-access/cart.service";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    CardModule,
    ButtonModule,
    DialogModule,
    TagModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    ProductFormComponent,
  ],
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);

  public readonly products = this.productsService.products;
  public sortField = "";
  public sortOrder = 1;
  public searchQuery = "";
  public selectedCategory: string | null = null;

  public readonly categories = [
    { label: "Tous", value: null },
    { label: "Accessories", value: "Accessories" },
    { label: "Fitness", value: "Fitness" },
    { label: "Clothing", value: "Clothing" },
    { label: "Electronics", value: "Electronics" },
  ];

  public readonly sortOptions = [
    { label: "Prix ↑", value: "price" },
    { label: "Prix ↓", value: "!price" },
    { label: "Nom", value: "name" },
  ];

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  ngOnInit() {
    this.productsService.get().subscribe();
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
    }
    this.closeDialog();
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }

  public getInventoryStatus(
    product: Product
  ):
    | "success"
    | "secondary"
    | "info"
    | "warning"
    | "danger"
    | "contrast"
    | undefined {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";
      case "LOWSTOCK":
        return "warning";
      case "OUTOFSTOCK":
        return "danger";
      default:
        return "info";
    }
  }

  public getCartQuantity(productId: number): number {
    const cartItem = this.cartService
      .items()
      .find((item) => item.product.id === productId);
    return cartItem?.quantity || 1;
  }

  public addToCart(product: Product): void {
    this.cartService.addItem(product, product.quantity || 1);
    product.quantity = 1; // Reset quantity after adding to cart
  }

  onSortChange(event: any) {
    const value = event.value;
    if (value.indexOf("!") === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  onFilter(dv: DataView) {
    const searchValue = this.searchQuery.toLowerCase();
    const filteredProducts = this.products().filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchValue) ||
        product.description.toLowerCase().includes(searchValue);
      const matchesCategory =
        !this.selectedCategory || product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
    dv.value = filteredProducts;
  }
}
