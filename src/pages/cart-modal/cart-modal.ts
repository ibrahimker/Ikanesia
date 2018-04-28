import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
	selector: 'page-cart-modal',
	templateUrl: 'cart-modal.html',
})
export class CartModalPage {

	cartList = []
	updateList:any
	cartCounter = 0
	listKurir = ['Ikanesia','JNE','Tiki']
	ongkir = 15000
	constructor(public navCtrl: NavController, public viewCtrl : ViewController, public navParams: NavParams) {

	}

	ionViewDidLoad() {
		this.cartList = this.navParams.get('list')
		this.updateList = this.navParams.get('update')
		this.cartCounter = this.navParams.get('counter')
	}

	public closeModal(){
		this.viewCtrl.dismiss();
		console.log(this.ongkir)
	}

	public clearItem(listIndex,listIkanIndex){
		//kalau isi cart cuman 1, langsung hapus saja
		if(this.cartCounter == 1) {
			this.cartList = []
		}
		else { //kalau lebih dari satu, lihat yang mana yang punya 2 ikan atau lebih
			if(listIkanIndex > 0) { //lebih dari 1 ikan, hapus ikannya saja
				this.cartList[listIndex].dataIkan = this.remove(this.cartList[listIndex].dataIkan,this.cartList[listIndex].dataIkan[listIkanIndex])
			}
			else { //jika hanya ada 1 ikan di tpi itu, maka hapus 1 tpi
				this.cartList = this.remove(this.cartList,this.cartList[listIndex])
			}
		}
		this.cartCounter--
		this.updateCartList(this.cartList,this.cartCounter)
	}
	updateCartList(list,counter){
		this.updateList(this.cartList,this.cartCounter)
	}
	//utility method untuk apus array
	public remove(array, element) {
		return array.filter(e => e !== element)
	}
}