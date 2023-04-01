import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Sonido } from '../models/sonido.model';

@Injectable({ providedIn: 'root' })
export class SonidoService {
  constructor(private http: HttpClient) {}

  // ******* PETICIONES SONIDOS *********

  getSonidos(pageSize?: number, currentPage?: number, search?: string) {
    const url = environment.base_url + '/sonidos';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    if (pageSize) {
      params = params.append('pageSize', pageSize + '');
    }
    if (currentPage) {
      params = params.append('currentPage', currentPage + '');
    }
    if (search) {
      params = params.append('texto', search + '');
    }

    return this.http.get(url, { headers, params });
  }

  getSonido(id: number) {
    const url = environment.base_url + '/sonidos';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // PARAMS
    let params = new HttpParams();
    params = params.append('id', id + '');

    return this.http.get(url, { headers, params });
  }

  updateSonido(ruta, data: Sonido, id: number) {
    const url = environment.base_url + '/sonidos/' + id;
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // DATA
    const sendData = {
      nombre: data['nombre'],
      descripcion: data['descripcion'],
      ruta: ruta,
    };

    // PARAMS
    let params = new HttpParams();
    params = params.append('id', id + '');
    return this.http.put(url, sendData, { headers, params });
  }

  createSonido(data: Sonido) {
    const url = environment.base_url + '/sonidos';
    const token = localStorage.getItem('token');
    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    // DATA
    const sendData = {
      nombre: data['nombre'],
      descripcion: data['descripcion'],
      ruta: data['ruta'],
    };

    // PARAMS
    let params = new HttpParams();
    return this.http.post(url, sendData, { headers, params });
  }

  subirAudio(file: File) {
    // subimos la escena con nombre de carpeta el nombre de la imagen y preview como nombre de archivo
    const url = `${environment.base_url}/upload/sonidos`;
    const token = localStorage.getItem('token');
    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);
    // PARAMS
    let params = new HttpParams();
    params = params.append('archivo', file + '');

    const datos: FormData = new FormData();
    datos.append('archivo', file, file.name);
    datos.append('path', file.name);
    return this.http.post(url, datos, { headers });

  }

  dropSonido(id: number) {
    console.log(id);
    const url = environment.base_url + '/sonidos/' + id + '';
    const token = localStorage.getItem('token');

    // HEADERS
    let headers = new HttpHeaders();
    headers = headers.append('x-token', token);

    return this.http.delete(url, { headers });
  }
}
