import { Injectable } from '@angular/core';
import { Registro } from '../modelos/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatalocalService {
  guardados: Registro[] = [];

  constructor(private storage: Storage, private navController: NavController,
              private inAppBrowser: InAppBrowser, private file: File,
              private emailComposer: EmailComposer) {
  }

  guardarRegistro( formato: string, texto: string) {
    this.cargarFavoritos();
    const existenot = this.guardados.find( not => not.texto === texto);
    if (!existenot) {
      const nuevoRegitros =  new Registro( formato, texto );
      this.guardados.unshift(nuevoRegitros);
      console.log('Guarda Historial.: ' , this.guardados);
      this.storage.set( 'QRHistorial' , this.guardados);
      this.abrirRegistro(nuevoRegitros);
    } else {
      const nuevoRegitros =  new Registro( formato, texto );
      this.abrirRegistro(nuevoRegitros);
    }
    console.log(this.guardados);
  }

  eliminaRegistro(registro: Registro) {
      console.log('elimina: ' , registro);
      this.guardados = this.guardados.filter(regi => regi.texto !== registro.texto );
      console.log('Eliminar: ', this.guardados);
      this.storage.set( 'QRHistorial' , this.guardados);
      return;
  }

  async cargarFavoritos() {
    const recibe =  await this.storage.get('QRHistorial');
    if (recibe != null) {
      this.guardados = recibe;
      console.log('Cargar: ', this.guardados);
      return;
    } else {
      this.guardados = [];
      return;
    }
  }

  abrirRegistro( registro: Registro ) {
    this.navController.navigateForward('/tabs/tab2');
    switch (registro.tipo) {
      case 'http':
        this.inAppBrowser.create(registro.texto, '_system');
        break;
      case 'HTTP':
        this.inAppBrowser.create(registro.texto, '_system');
        break;
      case 'geo':
        this.navController.navigateForward('/tabs/tab2/mapa/' + registro.texto);
        break;
      default:
        break;
    }
  }

  crearArchivo(arrRegistros: string) {
    this.file.checkFile(this.file.dataDirectory , 'registrosQR.csv')
    .then( existe => {
      console.log('Archivo existe:', existe);
      return this.escribirArchivos(arrRegistros);
    })
    .catch (err => {
        return this.file.createFile( this.file.dataDirectory , 'registrosQR.csv', false )
              .then( resp => this.escribirArchivos(arrRegistros) )
              .catch( err2 => console.log('error al crear el archivo:', err2 ) );
    });
  }

  async escribirArchivos(arrRegistros) {
    const archivo = `${ this.file.dataDirectory }registrosQR.csv` ;
    await this.file.writeExistingFile( this.file.dataDirectory, 'registrosQR.csv', arrRegistros);
    this.emailComposer.isAvailable().then((available: boolean) => {
    if (available) {
        console.log('Servicio no disponible');
        return;
      }
    });

    const email = {
      to: 'pedro.Malo-Ms-ionic-app@gmail.com',
      attachments: [
        archivo,
      ],
      subject: 'Respaldo datos QR',
      body: 'Se adjunta archivo con los respaldos de los datos QR',
      isHtml: true
    };
    // Send a text message using default options
    this.emailComposer.open(email);
  }
}
