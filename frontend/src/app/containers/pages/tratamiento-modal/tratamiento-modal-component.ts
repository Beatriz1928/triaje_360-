import { Component, TemplateRef,  ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Accion } from '../../../../app/models/accion.model';
import { PacienteService } from '../../../../app/data/paciente.service';
import { AccionPaciente } from '../../../../app/models/accion-paciente.model';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { AccionService } from '../../../data/accion.service';
import { DataListComponent } from 'src/app/views/app/victims/data-list/data-list.component';
import { Paciente } from 'src/app/models/paciente.model';

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
  dataPaciente = {
    "uid": '',
    "descripcion": '',
    "color": '',
    "nombre": '',
    "camina": false,
    "acciones": [],
    "img": '',
    "empeora": false,
    "tiempoEmpeora": undefined
  }

  @ViewChild('template', { static: true },) template: TemplateRef<any>;

  constructor( private modalService: BsModalService, private victimService: PacienteService, private accionesService: AccionService, private notifications: NotificationsService, private dataList: DataListComponent) { }


  show(p?: Paciente): void {
    //cargamos todos los tratamientos y despues comprobamos si la victima ya los tiene añadidos
    console.log(p.acciones);
    this.tratamientos_vista =[];
    this.tratamientos = [];
    this.nombresAcciones = [];
    this.cantidad = p.acciones.length;
     for (let a = 0; a < p.acciones.length ;a++){
     this.tratamientos.push(p.acciones[a].accion);
     this.tratamientos_vista.push(p.acciones[a].accion);
     this.nombresAcciones.push(p.acciones[a].accion.nombre);
    }
    // actualizamos los datos del paciente
    this.dataPaciente.uid = p.uid.toString();
    this.dataPaciente.descripcion = p.descripcion;
    this.dataPaciente.color = p.color;
    this.dataPaciente.nombre = p.nombre;
    this.dataPaciente.camina = p.camina;
    this.dataPaciente.img = p.img;
    this.dataPaciente.empeora = p.empeora;
    this.dataPaciente.tiempoEmpeora = p.tiempoEmpeora;


    this.getAcciones();

    this.modalRef = this.modalService.show(this.template, this.config);

  }

  getAcciones(){
    this.acciones =[];
    this.accionesService.getActions().subscribe(
      data =>{
        // console.log(data['acciones']);
        this.acciones = data['acciones'];
            // console.log(this.acciones);

        for (let a = 0; a < this.acciones.length; a++){
          if(!this.nombresAcciones.includes(this.acciones[a].nombre)){
            var trata = new AccionPaciente(this.acciones[a].nombre,this.acciones[a].tiempo)
            this.tratamientos_vista.push(trata);
          }
        }
      }
  );

  }

UpdateTreatment(nom){
  // se añade o elimina un tratamiento del paciente cuando marcamos el checkbox
  //console.log(value,nom, tiempo);
  var time = (<HTMLInputElement>document.getElementById(nom)).value;
  console.log(time);
  if(!this.nombresAcciones.includes(nom)){
    // console.log('el nombre de la accion a añadir es: '+nom);
    this.nombresAcciones.push(nom);
  }
  else{
    for(let i=0; i < this.nombresAcciones.length; ++i){
      if(this.nombresAcciones[i] == nom){
        this.nombresAcciones.splice(i);
        // console.log('el nombre de la accion a borrar es: '+nom);
      }
    }
  }
  }


  UpdateTreatments(): void {

  this.tratamientos = [];
  for (let a = 0; a < this.nombresAcciones.length ; a++){
    var time = +(<HTMLInputElement>document.getElementById(this.nombresAcciones[a])).value;
    let uno = new AccionPaciente(this.nombresAcciones[a], time);
    this.tratamientos.push(uno);
  }
  // console.log('Los tratamientos a añadir son: ')
  // for(var i = 0; i < this.tratamientos.length; i++){
  //   console.log(this.tratamientos[i].nombre);
  //   console.log(this.tratamientos[i].tiempo);
  // }
  for(let i=0; i<this.tratamientos.length; i++) {
    this.dataPaciente.acciones[i] = {
      "accion": {
        "nombre": this.tratamientos[i].nombre,
        "tiempo": this.tratamientos[i].tiempo
      }
    }
  }

  if(this.dataPaciente.uid) {
    this.victimService.updatePatient(this.dataPaciente).subscribe(
      data => {
        this.victimService.getPatients(this.dataList.itemsPerPage, this.dataList.currentPage);
        this.closeModal();
        this.notifications.create('Paciente editado', 'Se han editado los tratamientos correctamente', NotificationType.Info, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

    }, (err) => {

        this.notifications.create('Error', 'No se han podido editar los tratamientos', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
    });
  }
  }

  closeModal(): void {
    this.modalRef.hide();
  }


}
