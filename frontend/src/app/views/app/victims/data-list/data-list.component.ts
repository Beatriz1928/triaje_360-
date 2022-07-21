import { Component, OnInit, ViewChild } from '@angular/core';
import {AddNewVictimModalComponent} from '../../../../containers/pages/add-new-victim-modal/add-new-victim-modal.component';
import { PacienteService } from '../../../../../app/data/paciente.service';
import { ImagenService } from '../../../../../app/data/imagen.service';
import { AccionService } from '../../../../../app/data/accion.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { SenderService } from './../../../../data/sender.service';
import Swal from 'sweetalert2';
import { Paciente } from '../../../../models/paciente.model';
import { TratamientoModalComponent } from '../../../../containers/pages/tratamiento-modal/tratamiento-modal-component';
import { Accion } from '../../../../models/accion.model';
import { AccionPaciente } from '../../../../models/accion-paciente.model';


@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
})
export class DataListComponent implements OnInit {
  displayMode = 'list';
  selectAllState = '';
  selected: Paciente[] = [];
  data: Paciente[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  search = '';
  orderBy = '';
  totalItem = 0;
  totalPage = 0;
  itemScene = '';
  acciones: AccionPaciente[];


  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewVictimModalComponent;
  @ViewChild('Tratamientos', { static: true }) tratamientos: TratamientoModalComponent;

  constructor(private victimService: PacienteService, imageService: ImagenService, private notifications: NotificationsService,
    public sender: SenderService) {
  }

  ngOnInit(): void {
    //this.sender.id = undefined;
    //this.sender.idSubjectExercise = undefined;
    //this.sender.idExercise = undefined;
    this.loadScenes(this.itemsPerPage, this.currentPage, this.itemScene, '');
  }

  loadScenes(pageSize: number, currentPage: number, nomScene: string, search?: string): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.victimService.getPatients(pageSize, currentPage, search).subscribe(
      data => {
        this.data = data['pacientes'];
        this.totalItem = data['totalPacientes'];

        this.setSelectAllState();
      },
      error => {
        this.notifications.create('Error', 'No se han podido cargar las víctimas', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });
      }
    );
  }

  showTratamientos(p: Paciente ){
    this.acciones = [];
    if(p.acciones) {
       for (let a = 0; a < p.acciones.length; a++){
        let nombre =p.acciones[a].accion.nombre;
        let tiempo =p.acciones[a].accion.tiempo;
         this.acciones.push({nombre,tiempo});
       }
      this.tratamientos.show(p);
      }
      else {
        this.tratamientos.show();
      }
  }


  showAddNewModal(img? : Paciente): void {
    if(img) {
      console.log(img.uid);
      this.addNewModalRef.show(img.uid);
    } else {
      this.addNewModalRef.show();
    }
  }

  dropScenes(victims: Paciente[]): void {

    for(let i=0; i<victims.length; i++){
      this.victimService.dropPatient(victims[i].uid).subscribe(
        data => {

          this.notifications.create('Escenas eliminadas', 'Se han eliminado las víctimas correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        },
        error => {

          this.notifications.create('Error', 'No se han podido eliminar las víctimas', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });
          this.loadScenes(this.itemsPerPage, this.currentPage, this.itemScene, this.search);
          return;
        }
      );
    }
  }


  dropScene(victim: Paciente): void {
    this.victimService.dropPatient(victim.uid).subscribe(
      data => {
        this.loadScenes(this.itemsPerPage, this.currentPage, this.itemScene, this.search);

        this.notifications.create('Victima eliminada', 'Se ha eliminado la víctima correctamente', NotificationType.Info, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });


      },
      error => {

        this.notifications.create('Error', 'No se ha podido eliminar la víctima', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );

}


  confirmDelete(imagen: Paciente): void {
    Swal.fire({
      title: 'Eliminar Escena',
      text: '¿Estás seguro de que quieres eliminar la víctima?',
      icon: 'warning',
      showDenyButton: true,
      iconColor: '#145388',
      confirmButtonColor: '#145388',
      denyButtonColor: '#145388',
      confirmButtonText: `Sí`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.dropScene(imagen);
      } else if (result.isDenied) {
        Swal.close();
      }
    });
  }
  // LIST PAGE HEADER METHODS
  isSelected(p: Paciente): boolean {
    return this.selected.findIndex(x => x.uid === p.uid) > -1;
  }
  onSelect(item: Paciente): void {
    if (this.isSelected(item)) {
      this.selected = this.selected.filter(x => x.uid !== item.uid);
    } else {
      this.selected.push(item);
    }
    this.setSelectAllState();
  }

  setSelectAllState(): void {
    if (this.selected.length === this.data.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event): void {
    if ($event.target.checked) {
      this.selected = [...this.data];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  pageChanged(event: any): void {
    this.loadScenes(this.itemsPerPage, event.page, this.itemScene, this.search);
  }

  itemsPerPageChange(perPage: number): void {
    this.loadScenes(perPage, 1, this.itemScene, this.search);
  }

  searchKeyUp(val: string): void {
    this.search = val;
    this.loadScenes(this.itemsPerPage, this.currentPage, this.itemScene, this.search);
  }

  // changeOrderBy(item: any): void {
  //   this.loadData(this.itemsPerPage, 1, this.search, item.value);
  // }

  modal(p){
    console.log('llego al modal sweettie');
    var myInput = document.getElementById('exampleModalPromo2');
    myInput.focus()
  }


}




