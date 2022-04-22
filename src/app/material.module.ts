import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';


const materialModule = [MatButtonModule];
@NgModule({
  imports: [
    CommonModule,
    ...materialModule
  ],
  exports: [...materialModule]
})
export class MaterialModule { }
