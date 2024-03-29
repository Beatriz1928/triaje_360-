import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Imagen } from '../models/imagen.model';

@Injectable({ providedIn: 'root' })
export class ImagenService {
  constructor(private http: HttpClient) { }

  // ******* PETICIONES IMAGENES *********

  getImages(tipo?:string ,pageSize?: number, currentPage?: number, texto?: string) {
    const url = environment.base_url + '/imagenes/'+tipo;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    if(pageSize) { params = params.append('pageSize', pageSize + ''); }
    if(currentPage) { params = params.append('currentPage', currentPage + ''); }
    if(texto && texto!='') { params = params.append('texto', texto + ''); }

    return this.http.get(url, { headers, params });

  }

  getImage(id: number,tipo: string) {
    const url = environment.base_url + '/imagenes/'+tipo+'/';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    params = params.append('id', id + '');

    return this.http.get(url, { headers, params });
  }


  updateImage(ruta, data: Imagen,id: number, tipo) {
    const url = environment.base_url + '/imagenes/'+tipo+'/'+id;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // DATA
    const sendData = {
      "nombre": data['nombre'],
      "descripcion": data['descripcion'],
      "ruta": ruta
    }

    // PARAMS
    let params = new HttpParams();
    console.log('JEJE EL ID: '+id)
    params = params.append('id', id + '');

    return this.http.put(url, sendData, { headers, params });
  }
  subirimgescenario( file, tipo, ruta,nombre) {
    const url = `${environment.base_url}/upload/${tipo}`;
    const token = localStorage.getItem('token');
    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    console.log( url);
    // DATA
    let params = new HttpParams();
    params = params.append('archivo', file + '');
    const datos: FormData = new FormData();
    datos.append('archivo', file, nombre);
    datos.append('path', ruta);
   // const datos: FormData = new FormData();
    //datos.append('archivo',file, name);
  console.log(ruta, 'y el tipo '+ tipo);

    return this.http.post(url, datos, { headers });
  }

  createImage(data: Imagen,tipo) {
    const url = environment.base_url + '/imagenes/'+tipo;
    const token = localStorage.getItem('token');
    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    console.log( url);
    // DATA
    const sendData = {
      "nombre": data['nombre'],
      "descripcion": data['descripcion'],
      "ruta": data['ruta']
    }

    // PARAMS
    let params = new HttpParams();
    return this.http.post(url, sendData, { headers, params });
  }

  subirFoto( file: File, tipo, path) {
    // subimos la escena con nombre de carpeta el nombre de la imagen y preview como nombre de archivo
    const url = `${environment.base_url}/upload/${tipo}`;
    const token = localStorage.getItem('token');
      // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    // PARAMS
   let params = new HttpParams();
   params = params.append('archivo', file + '');

    const datos: FormData = new FormData();
    datos.append('archivo', file, file.name);
    datos.append('path', path);
    return this.http.post(url, datos, { headers });

  }



  subirPaciente( file: File, tipo) {
    // subimos la escena con nombre de carpeta el nombre de la imagen y preview como nombre de archivo
    const url = `${environment.base_url}/upload/${tipo}`;
    const token = localStorage.getItem('token');
      // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    // PARAMS
   // PARAMS
   let params = new HttpParams();
   params = params.append('archivo', file + '');

    const datos: FormData = new FormData();
    datos.append('archivo', file, file.name);
    datos.append('path', file.name);
    return this.http.post(url, datos, { headers });
  }

  dropImage(id: number, tipo: string) {
    const url = environment.base_url + '/imagenes/'+tipo+'/'+id;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS

    return this.http.delete(url, { headers });
  }

}
