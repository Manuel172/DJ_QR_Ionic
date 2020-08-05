import { Component } from '@angular/core';
import { DatalocalService } from '../../servicios/datalocal.service';
import { Storage } from '@ionic/storage';
import { Registro } from '../../modelos/registro.model';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public datalocalService: DatalocalService, storage: Storage,
              private socialSharing: SocialSharing,  private platform: Platform) {}

  ionViewWillEnter() {
    this.datalocalService.cargarFavoritos();
  }

  onEnviarCorreo() {
    console.log('Correo');
    const arrTemp = [] ;
    const arrTitulos = 'Tipo, Formato, Creado en, Text\n';
    arrTemp.push(arrTitulos);
    this.datalocalService.guardados.forEach( resp => {
      const linea = `${resp.tipo}, ${resp.formato}, ${resp.creado}, ${resp.texto.replace(',' , ' ')}\n`;
      arrTemp.push(linea);
    });
    console.log(arrTemp.join(''));
    this.datalocalService.crearArchivo( arrTemp.join('')) ;
  }

  onAbrirRegistro(item: Registro) {
    this.datalocalService.abrirRegistro(item);
  }

  shared(item: Registro) {
    console.log(item);
    this.socialSharing.share(item.texto);
    if (this.platform.is('cordova')) {
      // Sharing Nativo celular
      this.socialSharing.share( 'Informacion Codigo QR', item.tipo, '', item.texto );
    } else {
      // tslint:disable-next-line: no-string-literal
      if (navigator['share']) {
        // tslint:disable-next-line: no-string-literal
        navigator['share']({
          title: 'Informacion Codigo QR',
          text: item.tipo,
          url: item.texto
        })
          .then(() => console.log('Compartido'))
          .catch((error) => console.log('Error al Compartir', error));
      } else {
        console.log('Plataforma - Browser no soporta Shared');
      }
    }

  }

  borrar(item: Registro) {
    this.datalocalService.eliminaRegistro(item);
  }

}
