

export class AuthServices {

    estaLogeado = false;
    esAdministrador = false;
    esCliente = false;
    esProductor = false;
    dataSesion = false;


    getEstaLogeado(){
        return this.estaLogeado
    }

    getEsAdministrador(){
        return this.esAdministrador
    }

    getEsProductor(){
        return this.esProductor
    }

    getEsCliente(){
        return this.esCliente
    }

    getDataSesion(){
        return this.dataSesion
    }


}