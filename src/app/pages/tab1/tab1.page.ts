import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DatalocalService } from '../../servicios/datalocal.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  lecturaTexto = '';
  lecturaFormato = '';
  optionSlide = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(private barcodeScanner: BarcodeScanner,
    private datalocalService: DatalocalService) {}

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      if (!barcodeData.cancelled) {
        this.lecturaTexto = barcodeData.text;
        this.lecturaFormato = barcodeData.format;
        this.datalocalService.guardarRegistro(this.lecturaFormato, this.lecturaTexto);
      } else {
        this.datalocalService.guardarRegistro('QRCode', 'geo:-33.48769151243474,-70.65112999090909');
        this.datalocalService.guardarRegistro('QRCode', 'https://www.google.cl');
        this.datalocalService.guardarRegistro('QRCode', 'https://www.udemy.com');
      }
     }).catch(err => {
        this.datalocalService.guardarRegistro('QRCode', 'geo:-33.48769151243474,-70.65112999090909');
        this.datalocalService.guardarRegistro('QRCode', 'https://www.google.cl');
        this.datalocalService.guardarRegistro('QRCode', 'https://www.udemy.com');
        this.lecturaTexto = err;
     });
  }

}
