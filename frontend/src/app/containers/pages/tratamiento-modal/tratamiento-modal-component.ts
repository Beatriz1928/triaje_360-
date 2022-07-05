import { Component, TemplateRef,  ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Accion } from '../../../../app/models/accion.model';
import { AccionPaciente } from '../../../../app/models/accion-paciente.model';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { AccionService } from '../../../data/accion.service';
import { lineChartData } from '../../../data/charts';

@Component({
  selector: 'app-tratamiento-modal',
  templateUrl: './tratamiento-modal.component.html',
  styles: []

})
export class TratamientoModalComponent  {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  tratamientos: AccionPaciente[];
  acciones: Accion[];
  tratamientos_vista: AccionPaciente[];
  cantidad: number;
  nombresAcciones = [];

  @ViewChild('template', { static: true },) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private accionesService: AccionService, private notifications: NotificationsService) { }


  show(tratamientos?: AccionPaciente[]): void {
    //cargamos todos los tratamientos y despues comprobamos si la victima ya los tiene añadidos


    this.tratamientos_vista =[];
    this.tratamientos = [];
    this.nombresAcciones = [];
    this.cantidad = tratamientos.length;
     for (let a = 0; a < tratamientos.length ;a++){
     this.tratamientos.push(tratamientos[a]);
     this.nombresAcciones.push(tratamientos[a].nombre);
    }
    //guardamos los nombres de las acciones definidas en la base de datos
    this.tratamientos_vista = this.tratamientos;
    this.getAcciones();

    this.modalRef = this.modalService.show(this.template, this.config);

  }

  confirmDelete(i: number){
    console.log('La posicion de la accion a borrar: '+ i);
  }

  getAcciones(){
    this.acciones =[];
    this.accionesService.getActions().subscribe(
      data =>{
        console.log(data['acciones']);
            this.acciones = data['acciones'];
            console.log(this.acciones);

            for (let a = 0; a < this.acciones.length; a++){
              if(!this.nombresAcciones.includes(this.acciones[a].nombre)){
                var trata = new AccionPaciente(this.acciones[a].nombre,this.acciones[a].tiempo)
                this.tratamientos_vista.push(trata);
              }
            }
      }
  );

  }


}
