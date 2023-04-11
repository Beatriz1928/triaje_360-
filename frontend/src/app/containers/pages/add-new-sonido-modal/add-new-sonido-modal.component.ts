import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataListComponent } from '../../../views/app/sonido/data-list/data-list.component';
import { SonidoService } from '../../../data/sonido.service';
import { Sonido } from '../../../models/sonido.model';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';


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

  currentUrl = this.router.url;
  queryParams = this.route.snapshot.queryParams;

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
    private route: ActivatedRoute,
    private dataList: DataListComponent,
    private notifications: NotificationsService,
    private location: Location,
  ) { }


  show(id?: number): void {
    this.formData.reset();
    this.ruta = 'vacio';
    this.sonido = undefined;
    if (id) {
      this.getSonido(id);
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  loadSonidoData() {
    console.log(this.sonido);
    if (this.sonido) {
      this.formData.get('nombre').setValue(this.sonido.nombre);
      this.formData.get('descripcion').setValue(this.sonido.descripcion);
      this.formData.get('ruta').setValue(this.sonido.ruta);
      this.ruta = '/../../../../../assets/audio/' + this.sonido.ruta;
      //console.log('la foto es '+this.foto);
    }
  }

  onFireSelected(event) {
    this.selectedFile = event;
    console.log('La ruta: ' + this.selectedFile.target.files[0]);
    // if (this.selectedFile.target.files[0] !== '') {
    //   this.ruta = window.URL.createObjectURL(this.selectedFile.target.files[0]);
    // }

  }


  cambioSonido(evento): void {
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['mp3', 'wav'];
      const nombre: string = evento.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        this.formData.get('archivo').markAsPristine();
        console.log(this.formData);
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'El archivo debe ser una imagen jpeg, jpg o png' });
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
      this.audio = evento.target.files[0];
      //this.formData.get('archivo').setValue(reader.readAsDataURL(evento.target.files[0]));
      // y cargamos el archivo en la imagenUrl que es lo que se inserta en el src de la imagen
      var data = new FormData();
      data.append("archivo", evento.target.files[0]);
      //req.send(formData);
      let imgSrc = '';
      imgSrc = window.URL.createObjectURL(evento.target.files[0]);
      var pic = document.getElementById('sonido') as HTMLAudioElement;
      pic.src = imgSrc;
      this.ruta = window.URL.createObjectURL(this.audio);


    } else {
      console.log('no llega target:', evento);
    }
  }

  getSonido(id: number): void {
    this.ruta = '';
    this.sonidoService.getSonido(id).subscribe(
      data => {
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


  createUpdateSonido(): void {

    console.log('Envío formulario');
    //this.loadSceneData();


    if (this.sonido == null) { // si no tenemos escena, creamos una nueva imagen
      if (this.selectedFile != null) {

        // si no tenemos id de escena, creamos una
        this.audio = this.selectedFile.target.files[0];
        this.formData.value['archivo'] = this.audio;
        this.formData.value['ruta'] = this.audio['name'];
        this.formSubmited = true;
        if (this.formData.invalid) { // comprobamos que el formulario es valido
          console.log(this.formData)
          console.log('el form data es invalido');
          this.notifications.create(
            'Error',
            'Ha habido un error en el formulario',
            NotificationType.Error,
            {
              theClass: 'outline primary',
              timeOut: 6000,
              showProgressBar: false,
            }
          );
          return;
        }
        this.sonidoService.createSonido(this.formData.value)
          .subscribe(
            (res) => {
              if (this.audio != null)  {
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
              }
              else{
                this.router.navigate([this.currentUrl], { queryParams: this.queryParams });
              }

              if (this.audio != null) {
                this.sonidoService.subirAudio(this.audio).subscribe(
                  (res) => {
                    console.log('se ha subido el sonido');
                  },
                  (err) => {
                    const errtext = err.error.msg || 'No se pudo subir la imagen';
                    Swal.fire({ icon: 'error', title: 'Oops...', text: errtext });
                    return;
                  }
                );
              }
              else {
                this.dataList.loadSonidos(this.dataList.itemsPerPage, this.dataList.currentPage, '');
                this.closeModal();

              }

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
      }
      else {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'Es necesario seleccionar una archivo' });
        return;
      }

    } else { // si no editamos la escena que tenemos
      // this.formData.value['archivo'] = this.audio;
      console.log('Estoy editando');
      if (this.audio != null) {
        this.formData.value['ruta'] = this.audio['name'];
      }
      this.sonidoService.updateSonido(this.formData.value['ruta'], this.formData.value, this.sonido.uid)
        .subscribe(
          (res) => {
            this.notifications.create(
              'Sonido modificado',
              'Se ha modificado el sonido correctamente',
              NotificationType.Info,
              {
                theClass: 'outline primary',
                timeOut: 6000,
                showProgressBar: true,
              }
            );
            if (this.selectedFile != null) {
              this.audio = this.selectedFile.target.files[0];
              if (this.audio) {
                this.sonidoService.subirAudio(this.audio).subscribe(
                  (res) => {
                    console.log('se ha subido el sonido');
                  },
                  (err) => {
                    const errtext = err.error.msg || 'No se pudo subir la imagen';
                    Swal.fire({ icon: 'error', title: 'Oops...', text: errtext });
                    return;
                  }
                );
              }
            }
            this.dataList.loadSonidos(this.dataList.itemsPerPage, this.dataList.currentPage, '');
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
  }



  closeModal(): void {
    this.modalRef.hide();
  }
}
