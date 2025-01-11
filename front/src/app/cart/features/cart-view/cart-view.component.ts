import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { CartService } from '../../data-access/cart.service';
import { CartItem } from '../../data-access/cart.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    InputNumberModule,
    CurrencyPipe,
    FormsModule
  ]
})
export class CartViewComponent {
  private readonly cartService = inject(CartService);

  public readonly items = this.cartService.items;
  public readonly totalPrice = this.cartService.totalPrice;

  public updateQuantity(item: CartItem, quantity: number): void {
    this.cartService.updateQuantity(item.product.id, quantity);
  }

  public removeItem(item: CartItem): void {
    this.cartService.removeItem(item.product.id);
  }

  public clearCart(): void {
    this.cartService.clearCart();
  }
}
