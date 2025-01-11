import { Injectable, computed, signal } from '@angular/core';
import { Product } from 'app/products/data-access/product.model';
import { CartItem } from './cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Private writable signal for cart items
  private readonly _items = signal<CartItem[]>([]);

  // Public readonly signals for components to consume
  public readonly items = this._items.asReadonly();
  
  // Computed signals that automatically update when items change
  public readonly totalItems = computed(() => 
    this._items().reduce((total, item) => total + item.quantity, 0)
  );
  
  public readonly totalPrice = computed(() => 
    this._items().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  public addItem(product: Product): void {
    console.log('holla');
    
    this._items.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity if item exists
        return items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...items, { product, quantity: 1 }];
      }
    });
  }

  public removeItem(productId: number): void {
    this._items.update(items => 
      items.filter(item => item.product.id !== productId)
    );
  }

  public updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this._items.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  public clearCart(): void {
    this._items.set([]);
  }
}