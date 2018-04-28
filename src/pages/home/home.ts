import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { ModalController } from 'ionic-angular';
import { trigger,state,style,animate,transition,keyframes } from '@angular/animations';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
  trigger('flyInOut', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      animate(300, keyframes([
        style({opacity: 0, transform: 'translateX(-100%)', offset: 0}),
        style({opacity: 1, transform: 'translateX(15px)',  offset: 0.3}),
        style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
        ]))
      ])
    ])
  ]
})

export class HomePage {
  showDetermine : boolean = true
  showInputPassword : boolean = false
  showInputTanggalLahir : boolean = false
  cartCounter = 0
  determine=""
  password=""
  tanggalLahir=""
  chat=[{}]
  stringInput=""
  chatList=[]
  savedInput={
    nama:'',
    tanggalLahir:''
  }
  input=""
  ikan={}
  state="determine"
  // for cart
  cartList=[]

  constructor(public geolocation: Geolocation, public cartModalCtrl : ModalController, public http: Http){
    this.chatList.push({
      type:'Pesan',
      text:"Selamat datang di Ikanesia! Ayo beli ikan kami, ikannya langsung dari nelayan. Baru saja ditangkap dan masih sangat segar loh"
    })
    this.getCurrentPosition()
  }

  /**
  * Cart Related
  */
  public addToCart(dataIkan) {
    var hargaTotalTpi = 0
    //if cartlist is empty, just direct push it
    if(this.cartList.length < 1) {
      hargaTotalTpi = dataIkan.hargaIkan
      this.addToCartList(false,0,dataIkan.namaTpi,dataIkan.idTpi,hargaTotalTpi,dataIkan.namaIkan,1,dataIkan.stokIkan,dataIkan.hargaIkan,dataIkan.hargaIkan)
      this.addChat("Ikan " + dataIkan.namaIkan + " sudah dimasukkan kedalam keranjang belanja anda")
      this.cartCounter++
    }
    else{ //if cartlist is not empty, check whether id tpi in the cartlist is exist or not
      var isIdTpiExist = false
      var listIndexForExistTpi = 0
      for (var i = 0; i < this.cartList.length; i++) {
        if(this.cartList[i].idTpi == dataIkan.idTpi){
          isIdTpiExist = true
          listIndexForExistTpi = i //save the index into temp variable
          hargaTotalTpi = this.cartList[i].hargaTotalTpi //get already exist harga total
        }
      }
      if(isIdTpiExist){ //if already exist, add only the data ikan
        hargaTotalTpi += dataIkan.hargaIkan
        this.addToCartList(true,listIndexForExistTpi,dataIkan.namaTpi,dataIkan.idTpi,hargaTotalTpi,dataIkan.namaIkan,1,dataIkan.stokIkan,dataIkan.hargaIkan,dataIkan.hargaIkan)
        this.addChat("Ikan " + dataIkan.namaIkan + " sudah dimasukkan kedalam keranjang belanja anda")
        this.cartCounter++
      }
      else{ //if tpi is not exist in list, just direct push it
        hargaTotalTpi += dataIkan.hargaIkan
        this.addToCartList(false,0,dataIkan.namaTpi,dataIkan.idTpi,hargaTotalTpi,dataIkan.namaIkan,1,dataIkan.stokIkan,dataIkan.hargaIkan,dataIkan.hargaIkan)
        this.addChat("Ikan " + dataIkan.namaIkan + " sudah dimasukkan kedalam keranjang belanja anda")
        this.cartCounter++
      }
    }
  }

  //utility method untuk masukin ke cart list
  public addToCartList(isTpiExist,listIndex,namaTpi,idTpi,hargaTotalTpi,namaIkan,nominalIkan,stokIkan,hargaSatuan,hargaTotal) {
    if(isTpiExist) {
      this.cartList[listIndex].hargaTotalTpi = hargaTotalTpi
      this.cartList[listIndex].dataIkan.push({
        namaIkan:namaIkan,
        nominalIkan:nominalIkan,
        stokIkan:stokIkan,
        hargaSatuan:hargaSatuan,
        hargaTotal:hargaTotal
      })
    }
    else {
      this.cartList.push({
        namaTpi:namaTpi,
        idTpi:idTpi,
        hargaTotalTpi:hargaTotalTpi,
        kurir:"Ikanesia",
        dataIkan:[{
          namaIkan:namaIkan,
          nominalIkan:nominalIkan,
          stokIkan:stokIkan,
          hargaSatuan:hargaSatuan,
          hargaTotal:hargaTotal
        }]
      })
    }
  }

  public updateCartList(cartList,cartCounter) {
    console.log("Changed cart list",cartList)
    this.cartList = cartList
    this.cartCounter = cartCounter
  }

  public openCartModal(){
    var cartModalPage = this.cartModalCtrl.create('CartModalPage',{ counter:this.cartCounter,list : this.cartList , update:this.updateCartList.bind(this)});
    cartModalPage.present();
  }

  public isCartCounterShow(){
    if(this.cartCounter > 0 ) {
      return true
    }
    else {
      return false
    }
  }

  /**
  *  End of Chat Related Functionality
  */


  /**
  *  Chat Related Functionality
  */
  public addChat(text){
    this.chatList.push({
      type:'Pesan',
      text:text
    })
  }

  public addIkanToChat(dataIkan) {
    var waktuTangkapDalamJam = this.getTimeDifference(new Date(),new Date(dataIkan.waktuTangkap))
    this.chatList.push(
    {
      type:'Ikan',
      idIkan:dataIkan.id,
      namaIkan:dataIkan.nama,
      hargaIkan:dataIkan.harga,
      waktuTangkapanIkan:waktuTangkapDalamJam,
      namaTpi:dataIkan.namaTpi,
      idTpi:dataIkan.idTpi,
      latTpi:dataIkan.latTpi,
      longTpi:dataIkan.longTpi,
      stokIkan:dataIkan.stok,
      gambarIkan:dataIkan.img,
    })
  }
  /**
  *  End of Chat Related Functionality
  */


  /**
  *  Utility Related Functionality
  */
  public getTimeDifference(currentDate,catchFishDate){
    if (catchFishDate < currentDate) {
      catchFishDate.setDate(catchFishDate.getDate() + 1);
    }
    var diff = catchFishDate - currentDate;
    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    return Math.abs(hh)
  }

  public getCurrentPosition(){
    this.geolocation.getCurrentPosition({timeout:500}).then((resp) => {
      var geocoder = new google.maps.Geocoder()
      var latlng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude)
      let chatListScoped = this.chatList
      var that = this
      geocoder.geocode({'location': latlng}, function(results, status) {
        if(status == "OK"){
          if(results[0]){
            chatListScoped.push({
              type:'Pesan',
              text:"Kamu sedang ada di " + results[0].address_components[4].short_name + ", " + results[0].address_components[5].short_name + ". Berikut beberapa ikan rekomendasi kami untuk anda"
            })
            setTimeout(function(){
              that.getRecommendedFish()
            }, 2000);
          }
        }
        else{
          console.log('Status is not OK', status);
          chatListScoped.push({
            type:'Pesan',
            text:"Kami tidak dapat mendeteksi lokasi anda. Berikut beberapa ikan rekomendasi kami untuk anda bedasarkan lokasi default kami"
          })
          setTimeout(function(){
            that.getRecommendedFish()
          }, 2000);
        }
      })
    }).catch((error) => {
      console.log('Error getting location', error);
      this.addChat("Kami tidak dapat mendeteksi lokasi anda. Berikut beberapa ikan rekomendasi kami untuk anda bedasarkan lokasi default kami")
      var that = this
      setTimeout(function(){
        that.getRecommendedFish()
      }, 2000)
    })
  }

  /**
  *  End of Utility Related Functionality
  */

  public getRecommendedFish(){
    this.http.get("http://www.mocky.io/v2/5adfefa73300006200e4dab7").map(res => res.json()).subscribe(data => {
      Object.keys(data).forEach(key=> {
        this.addIkanToChat(data[key])
      });
    })
  }
}
