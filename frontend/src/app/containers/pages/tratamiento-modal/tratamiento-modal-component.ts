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
  tratamientos_vista: Accion[];
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

    this.tratamientos_vista =[];
    this.tratamientos = [];
    this.nombresAcciones = [];
    this.cantidad = p.acciones.length;
    let cantidad = 0;
    let existe = 0;
    let contenido: Accion;
    for (let a = 0; a < p.acciones.length; a++){ //recoremos las acciones
        cantidad = 0;
        existe = 0;
        for (let b = 0; b < p.acciones.length ;b++){ // las recorremos para cada una de las acciones
        if ( p.acciones[a].accion.nombre == p.acciones[b].accion.nombre){ // si es igual entonces aumentamos la cantidad 1 para saber cuantas hay
          cantidad = cantidad + 1;
          }
        }
          if(!this.nombresAcciones.includes(p.acciones[a].accion.nombre)){ // si este ya esta entonces no se añade otra vez (no dups)

              this.tratamientos.push(p.acciones[a].accion);
              contenido = new Accion(p.acciones[a].accion.uid , p.acciones[a].accion.nombre, p.acciones[a].accion.tiempo, cantidad)
              this.tratamientos_vista.push(contenido);
              this.nombresAcciones.push(p.acciones[a].accion.nombre);

          }
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
            //  console.log(this.acciones);
             for (let a = 0; a < this.acciones.length; a++){
              if(!this.nombresAcciones.includes(this.acciones[a].nombre)){
                let cantidad = 0;
                var trata = new Accion(this.acciones[a].uid,this.acciones[a].nombre,this.acciones[a].tiempo,cantidad)
                this.tratamientos_vista.push(trata);
              }
            }
    }
  );

  }



  UpdateTreatments(): void {

    var nombre = document.querySelectorAll("[id='nombre']");
    var tiempo = document.getElementsByClassName("tiempo") as HTMLCollectionOf<HTMLInputElement>;
    var cantidad = document.getElementsByClassName("cantidad") as HTMLCollectionOf<HTMLInputElement>;
    let ac= [Accion];
    ac = [];
    console.log(nombre)
    console.log(tiempo);
    console.log(cantidad);
    let num = 0;

    this.tratamientos = [];
    for (let a = 0 ; a < nombre.length; a++){

      if( parseInt(cantidad[a].value) !=0){
          for(let i = 0; i < parseInt(cantidad[a].value) ; i++){
            let uno = new AccionPaciente(nombre[a].innerHTML,parseInt(tiempo[a].value));
            this.tratamientos.push(uno);
          }
      }
    }
  for(let i=0; i<this.tratamientos.length; i++) {
    let id = this.objectId();
    let a = {
       "_id" : id,
      "accion": {
        "nombre": this.tratamientos[i].nombre,
        "tiempo": this.tratamientos[i].tiempo
      }
    }
    this.dataPaciente.acciones.push(a);
  }
  // this.dataPaciente.acciones = this.tratamientos;
  if(this.dataPaciente.uid) {
    this.victimService.updatePatient(this.dataPaciente).subscribe(
      data => {

        this.dataList.loadVictims(this.dataList.itemsPerPage, this.dataList.currentPage)
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

   objectId () {
    return this.hex(Date.now() / 1000) +
      ' '.repeat(16).replace(/./g, () => this.hex(Math.random() * 16))
  }

  hex (value) {
    return Math.floor(value).toString(16)
  }

  closeModal(): void {
    this.modalRef.hide();
  }


}
