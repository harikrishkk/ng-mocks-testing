import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  @Input() product: Product;
  @Output() onAddToCart = new EventEmitter<Product>();

  constructor() { }

  ngOnInit() {
  }

  addToCart(product: Product) {
    this.onAddToCart.emit(product)
  }

}
