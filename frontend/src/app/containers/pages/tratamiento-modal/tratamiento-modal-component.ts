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

UpdateTreatment(nom, tiempo){
  // se añade o elimina un tratamiento del paciente cuando marcamos el checkbox
  //console.log(value,nom, tiempo);
 //var inputElements  = document.getElementsByClassName('messageCheckbox');
  if(!this.nombresAcciones.includes(nom)){
    console.log('el nombre de la accion a añadir es: '+nom);
    this.nombresAcciones.push(nom);
    this.tratamientos.push(nom, tiempo);
  }
  else{
    for(let i=0; i < this.nombresAcciones.length; ++i){
      if(this.nombresAcciones[i] == nom){
        this.nombresAcciones.splice(i);
        this.tratamientos.splice(i);
        console.log('el nombre de la accion a borrar es: '+nom);
      }
    }
  }

}


  UpdateTreatments(): void {
    // for(let i=0; i<this.selected.length; i++) {
    //   this.dataPaciente.acciones[i] = {
    //     "accion": {
    //       "nombre": this.selected[i].nombre,
    //       "tiempo": this.selected[i].tiempo
    //     }
    //   }
    // }

    // if(this.dataPaciente['uid']) {
    //   this.pacienteService.updatePatient(this.dataPaciente).subscribe(
    //     data => {

    //       let parar = false;
    //       for(let i=0; i<this.dataEjercicio.pacientes.length && !parar; i++) {
    //         if(this.dataEjercicio.pacientes[i].uid == data['paciente'].uid) {
    //           this.dataEjercicio.pacientes[i] = data['paciente'];
    //           parar = true;
    //         }
    //       }

    //       this.resetDataPaciente();

    //       this.notifications.create('Paciente editado', 'Se ha editado el Paciente correctamente', NotificationType.Info, {
    //         theClass: 'outline primary',
    //         timeOut: 6000,
    //         showProgressBar: false
    //       });

    //   }, (err) => {

    //       this.notifications.create('Error', 'No se ha podido editar el Usuario', NotificationType.Error, {
    //         theClass: 'outline primary',
    //         timeOut: 6000,
    //         showProgressBar: false
    //       });

    //       return;
    //   });
    // }
    // else {
    //   this.pacienteService.createPatient(this.dataPaciente, this.exercise.uid).subscribe(
    //     data => {
    //       if (data['ok']) {
    //         this.dataEjercicio.pacientes.push(data['paciente']);
    //         this.resetDataPaciente();
    //         this.notifications.create('Paciente creado', 'Se ha creado el Paciente correctamente y se ha añadido al Ejercicio', NotificationType.Info, {
    //           theClass: 'outline primary',
    //           timeOut: 6000,
    //           showProgressBar: false
    //         });
    //       }
    //     },
    //     error => {
    //       this.notifications.create('Error', 'No se ha podido crear el Paciente', NotificationType.Error, {
    //         theClass: 'outline primary',
    //         timeOut: 6000,
    //         showProgressBar: false
    //       });

    //       return;
    //     }
    //   );
    // }

  }


}
