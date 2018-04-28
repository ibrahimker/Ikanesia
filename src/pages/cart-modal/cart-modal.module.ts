import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartModalPage } from './cart-modal';

@NgModule({
  declarations: [
    CartModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CartModalPage),
  ],
})
export class CartModalPageModule {}
