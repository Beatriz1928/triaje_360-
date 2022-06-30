import { Component, TemplateRef,  ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataListComponent } from './../../../views/app/scenes/data-list/data-list.component';
import { ImagenService } from './../../../data/imagen.service';
import { Imagen } from '../../../models/imagen.model';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import Swal from 'sweetalert2';


@Component({
  selector: 'manage-scene-modal',
  templateUrl: './manage-scene-modal.component.html'
})
export class ManageSceneModalComponent {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  scene: Imagen;

  // FORM
  private formSubmited = false;
  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    ruta: ['']
  });


  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private sceneService: ImagenService, private fb: FormBuilder, private router: Router , private dataList: DataListComponent,
    private notifications: NotificationsService) { }

  show(id? : number): void {

    this.formData.reset();
    this.scene = undefined;

    if(id) {
      this.getScene(id);
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  CreateScene(): void {
    console.log('Envío formulario');

    this.formSubmited = true;
    if (this.formData.invalid) { return; }

    let scene: any;
    if(this.scene) {
      scene = this.scene.uid
    } else {
      scene = '';
    }

    this.sceneService.updateImage(this.formData.value, scene)
        .subscribe( res => {
          this.dataList.loadScenes(this.dataList.itemsPerPage, this.dataList.currentPage);
          this.closeModal();

          this.notifications.create('Escena editada', 'Se ha editado la escena correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

        }, (err) => {

          this.notifications.create('Error', 'No se ha podido editar la escena', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });

  }

  loadSceneData() {
    if(this.scene) {
      this.formData.get('nombre').setValue(this.scene.nombre);
      this.formData.get('descripcion').setValue(this.scene.descripcion);
      this.formData.get('ruta').setValue(this.scene.ruta);
    }
  }

  getScene(id: number): void {

    this.sceneService.getImage(id).subscribe(
      data => {
        this.scene = data['imagenes'];
        this.loadSceneData();
      },
      error => {
        this.notifications.create('Error', 'No se ha podido obtener el Curso Académico', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  closeModal(): void {
    this.modalRef.hide();
  }

}
