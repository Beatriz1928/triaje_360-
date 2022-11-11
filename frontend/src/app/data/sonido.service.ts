import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Sonido } from '../models/sonido.model';

@Injectable({ providedIn: 'root' })
export class SonidoService {
  constructor(private http: HttpClient) { }

  // ******* PETICIONES IMAGENES *********

  getSonidos() {
    const url = environment.base_url + '/sonidos';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    // PARAMS
    let params = new HttpParams();

    return this.http.get(url, { headers, params });

  }

  getSonido(id: number) {
    const url = environment.base_url;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    params = params.append('id', id + '');

    return this.http.get(url, { headers, params });
  }


  updateSonido(data: Sonido, id: number) {
    const url = environment.base_url;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // DATA
    const sendData = {
      "nombre": data['nombre'],
      "descripcion": data['descripcion'],
      "ruta": data['ruta']
    }

    // PARAMS
    let params = new HttpParams();
    params = params.append('id', id + '');
    return this.http.put(url, sendData, { headers, params });
  }

  createSonido(data: Sonido) {
    const url = environment.base_url;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

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

  dropSonido(id: number, tipo: string) {
    const url = environment.base_url + '/' + id;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS

    return this.http.delete(url, { headers });
  }

}
