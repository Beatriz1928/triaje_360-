import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewVictimImageModalComponent } from '../../../../containers/pages/add-new-victim-image-modal/add-new-victim-image-modal.component';
import { Imagen } from '../../../../models/imagen.model';
import { ImagenService } from '../../../../data/imagen.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
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
  selected: Imagen[] = [];
  data: Imagen[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  search = '';
  orderBy = '';
  totalItem = 0;
  totalPage = 0;
  itemScene = '';

  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewVictimImageModalComponent;


  constructor(private sceneService: ImagenService, private notifications: NotificationsService,
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
    this.sceneService.getImages('pacientes',pageSize, currentPage, search).subscribe(
      data => {
        this.data = data['imagenes'];
        this.totalItem = data['totalImagenes'];
        this.setSelectAllState();
      },
      error => {
        this.notifications.create('Error', 'No se han podido cargar las imagenes', NotificationType.Error, {
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
      this.sceneService.dropImage(imgs[i].uid,'pacientes').subscribe(
        data => {

          this.notifications.create('Escenas eliminadas', 'Se han eliminado las escenas correctamente', NotificationType.Info, {
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
          this.loadScenes(this.itemsPerPage, this.currentPage, this.itemScene, this.search);
          return;
        }
      );
    }
  }


  dropScene(imagen: Imagen): void {
    this.sceneService.dropImage(imagen.uid,'pacientes').subscribe(
      data => {
        this.loadScenes(this.itemsPerPage, this.currentPage, this.itemScene, this.search);

        this.notifications.create('Escena eliminada', 'Se ha eliminado la imagen correctamente', NotificationType.Info, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });


      },
      error => {

        this.notifications.create('Error', 'No se ha podido eliminar la imagen', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );

}


  confirmDelete(imagen: Imagen): void {
    Swal.fire({
      title: 'Eliminar Escena',
      text: '¿Estás seguro de que quieres eliminar la Escena?',
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
  imagenmodal(ruta){

    Swal.fire({
      html:
        `<img alt="Image" class="imagen" src="./../../../../../assets/img/pacientes/${ruta}" alt="Imagen escena"  width="100%" height="100%"> `,
      showCloseButton: true,
    })

  }
}
