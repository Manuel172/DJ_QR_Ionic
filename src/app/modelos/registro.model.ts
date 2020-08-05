
export class Registro {
    public formato: string;
    public texto: string;
    public tipo: string;
    public icono: string;
    public creado: Date;

    constructor( pformato: string, ptexto: string) {
        this.formato = pformato;
        this.texto = ptexto;
        this.creado = new Date();
        this.determinarTipo();
    }

    private determinarTipo() {
        const determinar = this.texto.substr(0 , 4);
        console.log('Tipo: ', determinar);
        switch (determinar) {
            case 'http' :
                this.tipo = 'http';
                this.icono = 'globe-outline';
                break;
            case 'geo:' :
                this.tipo = 'geo';
                this.icono = 'map-outline';
                break;
            default:
                this.tipo = 'Sin Configuración';
                this.icono = 'create-outline';
                break;
        }
    }
}
