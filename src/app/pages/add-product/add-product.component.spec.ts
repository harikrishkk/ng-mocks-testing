import { EMPTY } from 'rxjs';
import { ProductService } from './../../services/product.service';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AddProductComponent } from './add-product.component';
import { MockBuilder, MockInstance, MockRender, ngMocks } from 'ng-mocks';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Component, forwardRef } from '@angular/core';


describe('AddProductComponent', () => {
  beforeEach(() => {
    return MockBuilder(AddProductComponent)
      .keep(FormsModule)
      .mock(MatFormField)
      .mock(MatSelect)
      .mock(MatLabel)
      .mock(MatOption)
      .mock(ProductService, {
        addProductToDB: () => EMPTY
      })
  })
  it('should be defined', () => {
    const fixture = MockRender(AddProductComponent);
    expect(fixture.point.componentInstance).toBeDefined();
  })

  it('should test the Title control', async () => {

    const fixture = MockRender(AddProductComponent);
    const component = fixture.point.componentInstance;
    const titleInputEl = ngMocks.find(['data-testid', 'titleControl']);
    const focusSpy = jest.spyOn(component, 'focus').mockResolvedValue(true);

    ngMocks.change(titleInputEl, 'cool cap');
    fixture.detectChanges();
    await fixture.whenStable();
    //const el = ngMocks.find(fixture, 'button');
    //ngMocks.click(el);
    console.log(component.addForm.value)
    // expect(component.)
  })


})
