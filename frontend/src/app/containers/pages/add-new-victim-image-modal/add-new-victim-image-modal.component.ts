import { Component, TemplateRef,  ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataListComponent } from '../../../views/app/victims-images/data-list/data-list.component';
import { ImagenService } from '../../../data/imagen.service';
import { Imagen } from '../../../models/imagen.model';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-new-victim-image-modal',
  templateUrl: './add-new-victim-image-modal.component.html',
  styles: []
})
export class AddNewVictimImageModalComponent  {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  scene: Imagen;
  public foto: File = null;
  ruta: string;
  //FORM
  private formSubmited = false;
  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    ruta: [''],
    archivo: ['']
  });


  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(
    private modalService: BsModalService,
    private imageService: ImagenService,
    private fb: FormBuilder,
    private router: Router ,
    private dataList: DataListComponent,
    private notifications: NotificationsService) { }


  show(id? : number): void {
    this.formData.reset();

    this.scene = undefined;
    if(id){
      this.getScene(id);
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  loadSceneData() {
    console.log(this.scene);
    if(this.scene ) {
      this.formData.get('nombre').setValue(this.scene.nombre);
      this.formData.get('descripcion').setValue(this.scene.descripcion);
      this.formData.get('ruta').setValue(this.scene.ruta);
      this.ruta = this.scene.ruta;
      //console.log('la foto es '+this.foto);
    }
  }

  cambioImagen( evento ): void {
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['jpeg','jpg','png'];
      const nombre: string = evento.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        this.formData.get('archivo').markAsPristine();
        console.log(this.formData);
        Swal.fire({icon: 'error', title: 'Oops...', text: 'El archivo debe ser una imagen jpeg, jpg o png'});
        return;
      }

      let reader = new FileReader();
      // cargamos el archivo en la variable foto que servirá para enviarla al servidor
      this.foto = evento.target.files[0];
      // leemos el archivo desde el dispositivo
      //console.log('url al archivo: '+evento.target.files[0])
      reader.readAsDataURL(evento.target.files[0]);

      console.log(evento.target.files[0]);
     this.formData.get('ruta').setValue(evento.target.files[0].name);

     // this.formData.get('ruta').setValue(this.foto.name);
      this.foto =evento.target.files[0];
      //this.formData.get('archivo').setValue(reader.readAsDataURL(evento.target.files[0]));
      // y cargamos el archivo en la imagenUrl que es lo que se inserta en el src de la imagen
      var data = new FormData();
      data.append("archivo", evento.target.files[0]);
      //req.send(formData);
      let imgSrc = '';
      imgSrc = window.URL.createObjectURL(evento.target.files[0]);
      var pic = document.getElementById('imagen') as HTMLImageElement ;
      pic.src = imgSrc;


    } else {
      console.log('no llega target:', evento);
    }
  }

  getScene(id:number): void{
    this.ruta = '';
    this.imageService.getImage(id,'pacientes').subscribe(
      data =>{
        this.scene = data['imagenes'];
        this.loadSceneData();
      },
    error => {
      this.notifications.create('Error', 'No se ha podido obtener la imagen', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 6000,
        showProgressBar: false
      });

      return;
    }
  );

  }

  createUpdateVictimImage(): void{

      console.log('Envío formulario');
     // this.loadSceneData();
      this.formSubmited = true;
      if (this.formData.invalid) {
        console.log('Estoy saliendo');
        return; }

      let escena: any;
      if(this.scene){
        escena = this.scene.uid;
      }else{
        escena = '';
      }
      if(escena == ''){
        // si no tenemos id de escena, creamos una
        this.imageService.createImage(this.formData.value,'pacientes')
        .subscribe(res => {
          this.notifications.create(
            'Escena creada',
            'Se ha creado la escena correctamente',
            NotificationType.Info,
            {
              theClass: 'outline primary',
              timeOut: 6000,
              showProgressBar: true,
            }
          );
          // this.dataList.loadScenes(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemScene)
          // this.closeModal();
          console.log(this.foto);
          if (this.foto ) {
            this.imageService.subirPaciente( this.foto,'pacientes')
            .subscribe( res => {
              // cambiamos el DOM el objeto que contiene la fot
            }, (err) => {
              const errtext = err.error.msg || 'No se pudo cargar la imagen';
              Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
              return;
            });
          }
          this.notifications.create('Imagen creada', 'Se ha creado la imagen correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });
        }, (err) => {

          this.notifications.create('Error', 'No se ha podido crear la imagen', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
      }else{
        console.log('Estoy editando');
        // si tenemos id de escena, la editamos

        this.imageService.updateImage(this.formData.value['ruta'],this.formData.value, escena,'pacientes')
        .subscribe(res => {
          this.notifications.create(
            'Escena creada',
            'Se ha modificado la escena correctamente',
            NotificationType.Info,
            {
              theClass: 'outline primary',
              timeOut: 6000,
              showProgressBar: true,
            }

          );
          if (this.foto ) {
            this.imageService.subirPaciente( this.foto,'pacientes')
            .subscribe( res => {
              // cambiamos el DOM el objeto que contiene la fot
            }, (err) => {
              const errtext = err.error.msg || 'No se pudo cargar la imagen';
              Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
              return;
            });
          }
          // this.dataList.loadScenes(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemScene)
          // this.closeModal();


        }, (err) => {

          this.notifications.create('Error', 'No se ha podido editar la imagen', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });

      }


    // this.dataList.loadScenes(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemScene)
    // this.closeModal();



  }


  closeModal(): void {
    this.modalRef.hide();
  }
}
