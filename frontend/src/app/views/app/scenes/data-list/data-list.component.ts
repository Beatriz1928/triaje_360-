import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewSceneModalComponent } from '../../../../containers/pages/add-new-scene-modal/add-new-scene-modal.component';
import { Imagen } from './../../../../models/imagen.model';
import { ImagenService } from '../../../../../app/data/imagen.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { SenderService } from './../../../../data/sender.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
})
export class DataListComponent implements OnInit {
  displayMode = 'list';
  selectAllState = '';
  selected: Imagen[] = [];
  data: Imagen[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  search = '';
  orderBy = '';
  totalItem = 0;
  totalPage = 0;
  itemYear = 0;

  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewSceneModalComponent;


  constructor(private sceneService: ImagenService, private notifications: NotificationsService,
    public sender: SenderService) {
  }

  ngOnInit(): void {
    //this.sender.id = undefined;
    //this.sender.idSubjectExercise = undefined;
    //this.sender.idExercise = undefined;
    this.loadScenes(this.itemsPerPage, this.currentPage);
  }

  loadScenes(pageSize: number, currentPage: number): void {

    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.sceneService.getImages('tiles',pageSize, currentPage).subscribe(
      data => {
        this.data = data['imagenes'];
        this.totalItem = data['totalImagenes'];
        this.setSelectAllState();
      },
      error => {
        this.notifications.create('Error', 'No se han podido cargar las escenas', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });
      }
    );
  }

  showAddNewModal(img? : Imagen): void {
    if(img) {
      console.log(img.uid);
      this.addNewModalRef.show(img.uid);
    } else {
      this.addNewModalRef.show();
    }
  }

  dropScenes(imgs: Imagen[]): void {

    for(let i=0; i<imgs.length; i++){
      this.sceneService.dropImage(imgs[i].uid).subscribe(
        data => {
          this.loadScenes(this.itemsPerPage, this.currentPage);

          this.notifications.create('Cursos Académicos eliminados', 'Se han eliminado las escenas correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        },
        error => {

          this.notifications.create('Error', 'No se han podido eliminar las escenas', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
        }
      );
    }
  }


  // dropScene(imagen: Imagen): void {

  //   this.sceneService.dropImage(imagen.uid).subscribe(
  //     data => {
  //       this.loadScenes(this.itemsPerPage, this.currentPage);

  //       this.notifications.create('Escena eliminada', 'Se ha eliminado la escena correctamente', NotificationType.Info, {
  //         theClass: 'outline primary',
  //         timeOut: 6000,
  //         showProgressBar: false
  //       });
  //     },
  //     error => {

  //       this.notifications.create('Error', 'No se ha podido eliminar la escena', NotificationType.Error, {
  //         theClass: 'outline primary',
  //         timeOut: 6000,
  //         showProgressBar: false
  //       });

  //       return;
  //     }
  //   );
  // }

  // confirmDelete(imagen: Imagen): void {
  //   Swal.fire({
  //     title: 'Eliminar Escena',
  //     text: '¿Estás seguro de que quieres eliminar la escena?',
  //     icon: 'warning',
  //     showDenyButton: true,
  //     iconColor: '#145388',
  //     confirmButtonColor: '#145388',
  //     denyButtonColor: '#145388',
  //     confirmButtonText: `Sí`,
  //     denyButtonText: `No`,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.dropScene(imagen);
  //     } else if (result.isDenied) {
  //       Swal.close();
  //     }
  //   });
  // }

  // LIST PAGE HEADER METHODS
  isSelected(p: Imagen): boolean {
    return this.selected.findIndex(x => x.uid === p.uid) > -1;
  }
  onSelect(item: Imagen): void {
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
    this.loadScenes(this.itemsPerPage, event.page);
  }

  itemsPerPageChange(perPage: number): void {
    this.loadScenes(perPage, 1);
  }

  searchKeyUp(val: string): void {
    this.search = val;
    this.loadScenes(this.itemsPerPage, this.currentPage);
  }

  // changeOrderBy(item: any): void {
  //   this.loadData(this.itemsPerPage, 1, this.search, item.value);
  // }

}
