import { Component, TemplateRef,  ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Accion } from '../../../../app/models/accion.model';
import { AccionPaciente } from '../../../../app/models/accion-paciente.model';

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



  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService) { }


  show(tratamientos?: AccionPaciente[]): void {
    //cargamos todos los tratamientos y despues comprobamos si la victima ya los tiene añadidos 
    this.tratamientos = [];

    for (let a = 0; a < tratamientos.length ;a++){
      this.tratamientos.push(tratamientos[a]);
    }
    this.modalRef = this.modalService.show(this.template, this.config);

  }

  confirmDelete(i: number){
    console.log('La posicion de la accion a borrar: '+ i);
  }



}
