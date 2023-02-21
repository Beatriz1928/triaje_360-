import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataListComponent } from 'src/app/views/app/scenes/data-list/data-list.component';
import { ImagenService } from '../../../data/imagen.service';
import { Imagen } from '../../../models/imagen.model';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import equirectToCubemapFaces from 'equirect-cubemap-faces-js';
import { element } from 'protractor';
@Component({
  selector: 'app-add-new-scene-modal',
  templateUrl: './add-new-scene-modal.component.html',
  styles: [],
})
export class AddNewSceneModalComponent {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right',
  };

  scene: Imagen;
  ruta = 'vacio';
  imagenes: File[];
  uid: any;
  selectedFile = null;

  public foto: File = null;
  public foto2: File = null;
  //FORM
  private formSubmited = false;
  public formData = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    ruta: [''],
    archivo: ['',],
  });

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(
    private modalService: BsModalService,
    private sceneService: ImagenService,
    private fb: FormBuilder,
    private router: Router,
    private dataList: DataListComponent,
    private notifications: NotificationsService
  ) {}

  show(id?: number): void {
    this.ruta = 'vacio';
    this.formData.reset();
    this.scene = undefined;
    if (id) {
      this.getScene(id);
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  myCanvas() {
    var canvas =  document.getElementById('myCanvas') as  HTMLCanvasElement;
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    let imgSrc = '';
    if (this.selectedFile.target.files[0] !== '') {
      imgSrc = window.URL.createObjectURL(this.selectedFile.target.files[0]);
    }
    const img = new Image();
    img.onload = function() {
      context.drawImage(img, 0, 0);
    }
    img.src = imgSrc;
    var pic = document.getElementById('imagen') as HTMLImageElement ;
    pic.src = imgSrc;
  }

  async crearImagenesEscena() {
    console.log('llego master');
    console.log(this.ruta)

    let i = document.getElementById('myCanvas') ;
    var cs = equirectToCubemapFaces(i);
    cs.forEach(function(c) {
       console.log('llego master', cs);
       var imagen =c.toDataURL("image/png");
     });
    console.log(cs);
    for (let a = 0; a < cs.length; a++) {
      let name = this.ruta.split('/'); //this.ruta.split('/',1);
      console.log(this.ruta);
      let id = name[0];
      await cs[a].toBlob((blob) => {
        let file = new File([blob], `$().jpg`, { type: 'image/jpeg' });
        this.foto2 = file;
        console.log(this.foto2);
        this.sceneService.subirimgescenario( this.foto2,'tiles2',id + '/' + a + '.png' ,a + '.png')
          .subscribe(
            (res) => {
              console.log('se ha subido la imagen de escena');
            },
            (err) => {
              const errtext =
                err.error.msg || 'No se pudo subir la imagen de escena';
              Swal.fire({ icon: 'error', title: 'Oops...', text: errtext });
              return;
            }
          );
      }, 'image/jpeg');
    }
  }

  subirImage() {
    console.log(this.foto);
    console.log(this.ruta);
    if (this.foto != null) {
      this.sceneService.subirFoto(this.foto, 'tiles', this.ruta).subscribe(
        (res) => {
          console.log('se ha subido la imagen');

          // this.myCanvas();
          // this.crearImagenesEscena();
        },
        (err) => {
          const errtext = err.error.msg || 'No se pudo subir la imagen';
          Swal.fire({ icon: 'error', title: 'Oops...', text: errtext });
          return;
        }
      );
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se ha reconocido el archivo',
      });
    }
    // this.myCanvas();
  }



  loadSceneData() {
    console.log(this.scene);
    if (this.scene) {
      this.formData.get('nombre').setValue(this.scene.nombre);
      this.formData.get('descripcion').setValue(this.scene.descripcion);
      this.formData.get('ruta').setValue(this.scene.ruta);
      //console.log('la foto es '+this.foto);
      this.uid = this.scene.uid;
      this.ruta = this.scene.ruta;
    }
  }
  onFireSelected(event) {
    this.selectedFile = event;

    this.myCanvas();
  }

  cambioImagen() {
    //
    console.log('ESTOY EN CAMBIO IMAGEN');
    // var picture = document.getElementById('imagen');
    // var scene = picture.getAttribute('src');
    if (
      this.selectedFile.target.files &&
      this.selectedFile.target.files[0] &&
      this.selectedFile.files[0] != null
    ) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['jpeg', 'jpg', 'png'];
      const nombre: string = this.selectedFile.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        this.formData.get('archivo').markAsPristine();
        console.log(this.formData);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El archivo debe ser una imagen jpeg, jpg o png',
        });
        return;
      }

      let reader = new FileReader();
      // cargamos el archivo en la variable foto que servirá para enviarla al servidor
      this.foto = this.selectedFile.target.files[0];
      // leemos el archivo desde el dispositivo
      //console.log('url al archivo: '+evento.target.files[0])
      reader.readAsDataURL(this.selectedFile.target.files[0]);

      console.log(this.selectedFile.this.selectedFile.target.files[0]);
      this.formData
        .get('ruta')
        .setValue(this.selectedFile.target.files[0].name);
      this.ruta = this.selectedFile.target.files[0].name;
      // this.formData.get('ruta').setValue(this.foto.name);
      this.foto = this.selectedFile.target.files[0];
      //this.formData.get('archivo').setValue(reader.readAsDataURL(evento.target.files[0]));
      // y cargamos el archivo en la imagenUrl que es lo que se inserta en el src de la imagen
      var data = new FormData();
      data.append('archivo', this.selectedFile.target.files[0]);
      //req.send(formData);
      this.subirImage();
    } else {
      console.log('no llega target:', this.scene);
    }
  }

  loadImage(src) {
    return new Promise(function (resolve, reject) {
      var i = new Image();
      i.onload = function () {
        resolve(i);
      };
      i.onerror = reject;
      i.src = src;
    });
  }

  getScene(id: number): void {
    this.sceneService.getImage(id, 'tiles').subscribe(
      (data) => {
        this.scene = data['imagenes'];
         this.loadSceneData();
        // this.myCanvas();
      },
      (error) => {
        this.notifications.create(
          'Error',
          'No se ha podido obtener la escena',
          NotificationType.Error,
          {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false,
          }
        );

        return;
      }
    );
  }

  createUpdateScene(): void {
    if (this.selectedFile.target.files[0] != null){
    this.foto = this.selectedFile.target.files[0];
    if (this.foto != null) { // si hemos seleccionando una foto
      console.log('Envío formulario');
       //this.loadSceneData();
      this.formSubmited = true;
      if (this.formData.invalid) { // comprobamos que el formulario es valido
        console.log(this.formData)
        console.log('el form data es invalido');
        return;
      }
      console.log(this.formData)

      if (this.scene == null) { // si no tenemos escena, creamos una nueva imagen
        this.formData.value['archivo'] = this.foto;
        this.formData.value['ruta'] = this.foto['name'];
        console.log('CREACION IMAGEN');
        // si no tenemos id de escena, creamos una
        this.sceneService.createImage(this.formData.value, 'tiles')
        .subscribe(
          (res) => {
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
            this.ruta = res['imagen'].ruta;
            this.subirImage();
             this.crearImagenesEscena();
             this.closeModal();
          },
          (err) => {
            this.notifications.create(
              'Error',
              'No se ha podido crear la escena',
              NotificationType.Error,
              {
                theClass: 'outline primary',
                timeOut: 6000,
                showProgressBar: false,
              }
            );
            return;
          }
        );
      } else { // si no editamos la escena que tenemos
        this.formData.value['archivo'] = this.foto;
        console.log('Estoy editando');
        // si tenemos id de escena, la editamos
        let nombre = document.getElementById('nombre')as HTMLFormElement;
        let descripcion = document.getElementById('descripcion')as HTMLFormElement;
        this.formData.get('nombre').setValue(nombre.value);
        this.formData.get('descripcion').setValue(descripcion.value);
        this.formData.get('ruta').setValue(this.scene.ruta);
        console.log(this.ruta);
        this.formData.value
        this.sceneService.updateImage(this.ruta, this.formData.value, this.scene.uid, 'tiles')
          .subscribe(
            (res) => {
              // this.dataList.loadScenes(
              //   this.dataList.itemsPerPage,
              //   this.dataList.currentPage,
              //   this.dataList.itemScene
              // );
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
              this.subirImage();
              this.crearImagenesEscena();
              this.closeModal();

            },
            (err) => {
              this.notifications.create(
                'Error',
                'No se ha podido editar la escena',
                NotificationType.Error,
                {
                  theClass: 'outline primary',
                  timeOut: 6000,
                  showProgressBar: false,
                }
              );

              return;
            }
          );
      }
      // this.dataList.loadScenes(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemScene)
      // this.closeModal();
    }
    else{
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Es necesario seleccionar una imagen' });
              return;
    }

    }
    else{
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Es necesario seleccionar una imagen' });
      return;
    }
  }



  closeModal(): void {
    this.modalRef.hide();
  }
}
