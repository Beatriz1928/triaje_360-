import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataListComponent } from '../../../views/app/sonido/data-list/data-list.component';
import { SonidoService } from '../../../data/sonido.service';
import { Sonido} from '../../../models/sonido.model';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-new-sonido-modal',
  templateUrl: './add-new-sonido-modal.component.html',
  styles: [],
})
export class AddNewSonidoModalComponent {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right',
  };

  sonido: Sonido;
  ruta = 'vacio';
  sonidos: File[];
  uid: any;
  selectedFile = null;

  public audio: File = null;
  public audio2: File = null;

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
    private sonidoService: SonidoService,
    private fb: FormBuilder,
    private router: Router,
    private dataList: DataListComponent,
    private notifications: NotificationsService
  ) {}


  show(id? : number): void {
    this.formData.reset();
    this.ruta = 'vacio';
    this.sonido = undefined;
    if(id){
      this.getSonido(id);
    }
    this.modalRef = this.modalService.show(this.template, this.config);
   }

  loadSonidoData() {
    console.log(this.sonido);
    if(this.sonido ) {
      this.formData.get('nombre').setValue(this.sonido.nombre);
      this.formData.get('descripcion').setValue(this.sonido.descripcion);
      this.formData.get('ruta').setValue(this.sonido.ruta);
      this.ruta = '/../../../../../assets/audio/' + this.sonido.ruta;
      //console.log('la foto es '+this.foto);
    }
  }

  onFireSelected(event) {
    this.selectedFile = event;
    if (this.selectedFile.target.files[0] !== '') {
      this.ruta = window.URL.createObjectURL(this.selectedFile.target.files[0]);
    }
  }


  cambioSonido( evento ): void {
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['mp3','wav'];
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
      this.audio = evento.target.files[0];
      // leemos el archivo desde el dispositivo
      //console.log('url al archivo: '+evento.target.files[0])
      reader.readAsDataURL(evento.target.files[0]);

      console.log(evento.target.files[0]);
     this.formData.get('ruta').setValue(evento.target.files[0].name);

     // this.formData.get('ruta').setValue(this.foto.name);
      this.audio =evento.target.files[0];
      //this.formData.get('archivo').setValue(reader.readAsDataURL(evento.target.files[0]));
      // y cargamos el archivo en la imagenUrl que es lo que se inserta en el src de la imagen
      var data = new FormData();
      data.append("archivo", evento.target.files[0]);
      //req.send(formData);
      let imgSrc = '';
      imgSrc = window.URL.createObjectURL(evento.target.files[0]);
      var pic = document.getElementById('sonido') as HTMLAudioElement ;
      pic.src = imgSrc;
      this.ruta = window.URL.createObjectURL(this.audio);


    } else {
      console.log('no llega target:', evento);
    }
  }

  getSonido(id:number): void{
    this.ruta = '';
    this.sonidoService.getSonido(id).subscribe(
      data =>{
        this.sonido = data['sonidos'];
        this.loadSonidoData();
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


 subirSonido() {
  console.log(this.audio);
  console.log(this.ruta);
  if (this.audio != null) {
    this.sonidoService.subirAudio(this.audio, this.ruta).subscribe(
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

 createUpdateSonido(): void {
  if (this.selectedFile.target.files[0] != null){
  this.audio = this.selectedFile.target.files[0];
  if (this.audio != null) { // si hemos seleccionando una foto
    console.log('Envío formulario');
     //this.loadSceneData();
    this.formSubmited = true;
    if (this.formData.invalid) { // comprobamos que el formulario es valido
      console.log(this.formData)
      console.log('el form data es invalido');
      return;
    }
    console.log(this.formData)

    if (this.sonido == null) { // si no tenemos escena, creamos una nueva imagen
      this.formData.value['archivo'] = this.audio;
      this.formData.value['ruta'] = this.audio['name'];
      console.log('CREACION IMAGEN');
      // si no tenemos id de escena, creamos una
      this.sonidoService.createSonido(this.formData.value)
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
          this.ruta = res['sonidos'].ruta;
          this.subirSonido();
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
      this.formData.value['archivo'] = this.audio;
      console.log('Estoy editando');
      // si tenemos id de escena, la editamos
      let nombre = document.getElementById('nombre')as HTMLFormElement;
      let descripcion = document.getElementById('descripcion')as HTMLFormElement;
      this.formData.get('nombre').setValue(nombre.value);
      this.formData.get('descripcion').setValue(descripcion.value);
      this.formData.get('ruta').setValue(this.sonido.ruta);
      console.log(this.ruta);
      this.formData.value
      this.sonidoService.updateSonido(this.ruta, this.formData.value, this.sonido.uid)
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
            this.subirSonido();
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
