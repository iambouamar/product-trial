import { Component, inject } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { BadgeModule } from 'primeng/badge';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import { CartService } from "./cart/data-access/cart.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    SplitterModule, 
    ToolbarModule, 
    PanelMenuComponent,
    BadgeModule
  ],
})
export class AppComponent {
  title = "ALTEN SHOP";
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  
  public readonly cartItemCount = this.cartService.totalItems;

  public navigateToCart(): void {
    this.router.navigate(['/cart']);
  }
}
