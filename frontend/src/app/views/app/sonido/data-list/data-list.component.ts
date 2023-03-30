import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewSonidoModalComponent } from '../../../../containers/pages/add-new-sonido-modal/add-new-sonido-modal.component';
import { Sonido } from '../../../../models/sonido.model';
import { SonidoService } from '../../../../data/sonido.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { CommonModule } from '@angular/common';
import { SenderService } from '../../../../data/sender.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
})
export class DataListComponent implements OnInit {
  displayMode = 'list';
  selectAllState = '';
  selected: Sonido[] = [];
  data: Sonido[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  search = '';
  orderBy = '';
  totalItem = 0;
  totalPage = 0;
  itemAudio = '';

  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewSonidoModalComponent;


  constructor(private sonidoService: SonidoService, private notifications: NotificationsService,
    public sender: SenderService) {
  }

  ngOnInit(): void {

    this.loadSonidos(this.itemsPerPage, this.currentPage, '');
  }


  loadSonidos(pageSize: number, currentPage: number, search?: string): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.sonidoService.getSonidos(pageSize, currentPage, search).subscribe(
      data => {
        this.data = data['sonidos'];
        this.totalItem = data['totalSonidos'];

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


  showAddNewModal(sound? : Sonido): void {
    console.log(sound);
    if(sound) {
      console.log(sound.uid);
      this.addNewModalRef.show(sound.uid);
    } else {
      this.addNewModalRef.show();
    }
  }

  dropSonidos(aounds: Sonido[]): void {

    for(let i=0; i<aounds.length; i++){
      this.sonidoService.dropSonido(aounds[i].uid).subscribe(
        data => {

          this.notifications.create('Escenas eliminadas', 'Se han eliminado los sonidos correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        },
        error => {

          this.notifications.create('Error', 'No se han podido eliminar los sonidos', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });
          this.loadSonidos(this.itemsPerPage, this.currentPage, this.search);
          return;
        }
      );
    }
  }


  dropSonido(sonido: Sonido): void {
    this.sonidoService.dropSonido(sonido.uid).subscribe(
      data => {
        this.loadSonidos(this.itemsPerPage, this.currentPage, this.search);

        this.notifications.create('Audio eliminado', 'Se ha eliminado el audio correctamente', NotificationType.Info, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });
      },
      error => {

        this.notifications.create('Error', 'No se ha podido eliminar el audio', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );

}


  confirmDelete(sonido: Sonido): void {
    Swal.fire({
      title: 'Eliminar Audio',
      text: '¿Estás seguro de que quieres eliminar el audio?',
      icon: 'warning',
      showDenyButton: true,
      iconColor: '#145388',
      confirmButtonColor: '#145388',
      denyButtonColor: '#145388',
      confirmButtonText: `Sí`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.dropSonido(sonido);
      } else if (result.isDenied) {
        Swal.close();
      }
    });
  }
  // LIST PAGE HEADER METHODS
  isSelected(p: Sonido): boolean {
    return this.selected.findIndex(x => x.uid === p.uid) > -1;
  }
  onSelect(item: Sonido): void {
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
    this.loadSonidos(this.itemsPerPage, event.page, this.search);
  }

  itemsPerPageChange(perPage: number): void {
    this.loadSonidos(perPage, 1,this.search);
  }

  searchKeyUp(val: string): void {
    this.search = val;
    this.loadSonidos(this.itemsPerPage, this.currentPage,  this.search);
  }

  // changeOrderBy(item: any): void {
  //   this.loadData(this.itemsPerPage, 1, this.search, item.value);
  // }

  modal(p){
    var myInput = document.getElementById('exampleModalPromo2');
    myInput.focus()
  }


}

