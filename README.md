## Testing with ng mocks

To have faster testing, we can suppress the reset of TestBed & reuse them.
eg: A form component with input text fields.
`ngMocks.faster();`

if the setup is reused by dozens of it block,

ngMocks faster. ngMocks, MockInstance, MockRender [docs](https://ng-mocks.sudo.eu/api/ngMocks/faster)

- If service has dependencies, its upto the DI to resolve those dependencies.
- TestBed is roughly equivalent to @NgModule
- TestBed emulates the NgModule

```
@NgModule({
  declarations: [],
  imports: [],
  providers: [],
  bootstrap: []
})
export class AppModule { }

similarly,

TestBed.configureTestingModule({

})
```

A component = Template + class + styles working together
ComponentFixture is a test utility that helps for interacting with a created component & its corresponding element.

fixture gives access to debugElement as well as componentInstance
debugElement abstracts the native element so that it works across all platforms.

All mock methods are empty functions that return undefined.

Automatically spy all methods of services, components, directives, pipes,
`src/test.ts`, add

```
import { ngMocks } from 'ng-mocks';
ngMocks.autoSpy('jest');
```

MockRender - shallow rendering in Angular tests
It asserts Input, Output, ChildContent, render custom templates
MockedComponentFixture has an additional property called `point`.

MockRender(Component, params)

MockRender creates a special wrapper component which should be injected into TestBed. The component is needed in order to render a custom template, which is provided or generated based on parameters.

usage of MockRender after usage of TestBed.get, TestBed.inject, TestBed.createComponent or another MockRender triggers an error about dirty TestBed

Mockrender should be used once per test

## AppCOmponent traditional test case

```

import { AppComponent } from './app.component';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockComponent, MockDirective } from 'ng-mocks';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MockComponent(NavbarComponent),
        MockComponent(FooterComponent),
        MockDirective(RouterOutlet)
      ],
    });
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance; // class instance
  })

  it('should be defined', () => {
    expect(component).toBeDefined();
  })
})

```

Seeing a green is good, but dont be fooled by it, so try to test the negative side also

Same example with ngMocks

```
import { AppComponent } from './app.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {

  beforeEach(() => {
    return MockBuilder(AppComponent)
      .mock(NavbarComponent)
      .mock(FooterComponent)
      .mock(RouterOutlet)
  })
  it('should be defined', () => {
    const fixture = MockRender(AppComponent);
    expect(fixture.point.componentInstance).toBeDefined();
  })
})
```

Search for the error

```
Can't bind to 'matBadge' since it isn't a known property of 'mat-icon' ng mocks
https://material.angular.io/components/badge/overview
```

## Testing NavigationListModule

```
import { MatIconModule } from '@angular/material/icon';
import { NavigationListComponent } from './navigation-list.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { RouterLink } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';

describe('NavigationListComponent', () => {

  beforeEach(() => {
    return MockBuilder(NavigationListComponent)
      .mock(MatIconModule)
      .mock(MatBadgeModule) // Tricky one, remove and see
      .mock(RouterLink)
  });

  it('should be defined', () => {
    const fixture = MockRender(NavigationListComponent);
    expect(fixture.point.componentInstance).toBeDefined();
  })

  it('should get display the count', () => {
    // Arrange
    const fixture = MockRender(NavigationListComponent);
    const component = fixture.point.componentInstance;
    const iconEl = ngMocks.reveal(fixture, 'mat-icon'); // Tricky one
    // Act
    component.count = 2;
    fixture.detectChanges();
    //Assert
    expect(ngMocks.input(iconEl, 'matBadge')).toBe(component.count);
  })
})

```

## Test ProductComponent

```
yarn jest src/app/components/product/product.component.spec
```

test case

```
import { RouterLink, RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MockBuilder, MockRender } from 'ng-mocks';
import { ProductComponent } from './product.component';
import { mockProduct } from '../../mocks';


describe('ProductComponent', () => {

  beforeEach(() => {
    return MockBuilder(ProductComponent)
      .mock(MatCardModule)
      .mock(MatChipsModule)
      .mock(RouterModule)
  });

  it('should be defined', () => {

    const fixture = MockRender(ProductComponent, {
      product: mockProduct,
      onAddToCart: jest.fn()
    });
    expect(fixture.point.componentInstance).toBeDefined();
  })

  it('should test the Input & Output property', () => {

    const onAddtoCartSpy = jest.fn();
    const fixture = MockRender(ProductComponent, {
      product: mockProduct,
      onAddToCart: onAddtoCartSpy
    });
    const component = fixture.componentInstance;
    expect(component.product).toBe(mockProduct);
    expect(onAddtoCartSpy).not.toHaveBeenCalled();
    const buttonEl = ngMocks.find('button');
    ngMocks.click(buttonEl);
    expect(onAddtoCartSpy).toHaveBeenCalled();
  })

})
```

## Testing Products Component

```

import { ShoppingCartService } from './../../services/shopping-cart.service';
import { ProductService } from './../../services/product.service';
import { ProductComponent } from './../product/product.component';
import { ProductsComponent } from './products.component';
import { MockComponent, MockProvider, MockRender } from "ng-mocks";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

describe('ProductsComponent', () => {

  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductsComponent,
        MockComponent(ProductComponent),
        MockComponent(MatProgressSpinner)
      ],
      providers: [
        MockProvider(ProductService, {
          getAllProducts: () => EMPTY
        }),
        MockProvider(ShoppingCartService)
      ]
    });
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
  })

  it('should create', () => {
    const fixture = MockRender(ProductsComponent, {}, { reset: true });
    expect(fixture.point.componentInstance).toBeDefined();
  });

})

```

## or the ng mocks way

make sure, there is no paths that start from `src/` and it is relative to `../`

```
import { AppModule } from './../../app.module';
import { ProductsComponent } from './products.component';
import { MockBuilder, MockRender } from "ng-mocks";

describe('ProductsComponent', () => {

  beforeEach(() => MockBuilder(ProductsComponent, AppModule));

  it('should render ignoring all dependencies', () => {
    const fixture = MockRender(ProductsComponent);
    expect(fixture).toBeDefined();
  });

})
```

## or the MockBuilder way

```
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ProductComponent } from './../product/product.component';
import { ProductsComponent } from './products.component';
import { MockBuilder, MockRender } from "ng-mocks";
import { ProductService } from '../../services/product.service';

describe('ProductsComponent', () => {

  beforeEach(() => MockBuilder(ProductsComponent)
    .mock(ProductComponent)
    .mock(MatProgressSpinner)
    .mock(ProductService)
    .mock(ShoppingCartService)
  );

  it('should render ignoring all dependencies', () => {
    const fixture = MockRender(ProductsComponent);
    expect(fixture).toBeDefined();
  });
})
```

## ProductsComponent with marble test

```
import { mockProduct, mockProducts } from './../../mocks/index';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { ProductComponent } from './../product/product.component';
import { ProductsComponent } from './products.component';
import { MockBuilder, MockRender } from "ng-mocks";
import { ProductService } from '../../services/product.service';
import { of, EMPTY } from 'rxjs';
import { cold } from 'jest-marbles';

describe('ProductsComponent', () => {

  beforeEach(() => MockBuilder(ProductsComponent)
    .mock(ProductComponent)
    .mock(MatProgressSpinner)
    .mock(ProductService, {
      getAllProducts: () => of(mockProducts)
    })
    .mock(ShoppingCartService, {
      addToCart: () => EMPTY
    })
  );

  it('should render the component', () => {
    const fixture = MockRender(ProductsComponent);
    expect(fixture).toBeDefined();
  });

  it('should have the products from service', () => {
    const fixture = MockRender(ProductsComponent);
    const component = fixture.componentInstance;
    const expected$ = cold('(a|)', { a: mockProducts });
    expect(component.products$).toBeObservable(expected$);
  })

  it('should handle add to cart', () => {

    const fixture = MockRender(ProductsComponent);
    const component = fixture.componentInstance;
    const shopService = fixture.point.injector.get(ShoppingCartService);
    const spy = jest.spyOn(shopService, 'addToCart');
    component.handleAddToCart(mockProduct);
    expect(spy).toHaveBeenCalled();
  })
})
```

## Testing a directive

```
import { HighlightDirective } from './highlight.directive';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { Component } from "@angular/core";

@Component({
  template: `<div appHighlight></div>`
})
class TestComponent { }

describe('HighlightDirective', () => {
  beforeEach(() => {
    return MockBuilder(TestComponent).keep(HighlightDirective);
  })

  it('should render', () => {
    const fixture = MockRender(TestComponent);
    const highlight = ngMocks.get(
      ngMocks.find('div'),
      HighlightDirective
    )
    const el = ngMocks.find('div');
    ngMocks.trigger(el, 'mouseover');
    fixture.detectChanges();
    expect(highlight.isHover).toBeTruthy();
    ngMocks.trigger(el, 'mouseout');
    fixture.detectChanges();
    expect(highlight.isHover).toBeFalsy();
  });

  it('should test for the added class in DOM', () => {
    const fixture = MockRender(TestComponent);
    const el = ngMocks.find('div');
    ngMocks.trigger(el, 'mouseover');
    fixture.detectChanges();
    // console.log(ngMocks.formatHtml(fixture.debugElement))
    expect(ngMocks.formatHtml(fixture.debugElement)).toContain('box_shadow');
  })

})

```

https://stackoverflow.com/questions/71984841/ng-mocks-library-to-test-form-component-template-driven-form
