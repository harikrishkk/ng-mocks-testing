import { Observable } from 'rxjs';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation-list',
  templateUrl: './navigation-list.component.html',
  styleUrls: ['./navigation-list.component.css']
})
export class NavigationListComponent implements OnInit {
  count$: Observable<number>;
  constructor(private cartService: ShoppingCartService) { }

  ngOnInit() {
    this.count$ = this.cartService.getCartCount$()
  }

}
