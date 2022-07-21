import { Component, TemplateRef,  ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataListComponent } from 'src/app/views/app/victims/data-list/data-list.component';
import { PacienteService } from '../../../data/paciente.service';
import { ImagenService } from '../../../data/imagen.service';
import { Paciente } from '../../../models/paciente.model';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-new-victim-modal',
  templateUrl: './add-new-victim-modal.component.html',
  styleUrls: ['./add-new-victim-modal.component.css']
})
export class AddNewVictimModalComponent  {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  paciente: Paciente;
  public foto: File = null;

  //FORM
  private formSubmited = false;
  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    camina: [''],
    acciones: [''],
    img: [''],
    empeora: [''],
    tiempoEmpeora: [''],
    color: ['']
  });
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private victimService: PacienteService,private imagenService: ImagenService, private fb: FormBuilder, private router: Router , private dataList: DataListComponent,
    private notifications: NotificationsService) { }


  show(id? : number): void {
    this.formData.reset();
    console.log(id);
    this.paciente = undefined;
    if(id){
      this.getVictim(id);
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  loadVictimData() {
    if(this.paciente ) {
      this.formData.get('nombre').setValue(this.paciente.nombre);
      this.formData.get('descripcion').setValue(this.paciente.descripcion);
      this.formData.get('acciones').setValue(this.paciente.acciones);
      this.formData.get('img').setValue(this.paciente.img);
      this.formData.get('empeora').setValue(this.paciente.empeora);
      this.formData.get('color').setValue(this.paciente.color);
      this.formData.get('tiempoEmpeora').setValue(this.paciente.tiempoEmpeora);
      this.formData.get('camina').setValue(this.paciente.camina);
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




    } else {
      console.log('no llega target:', evento);
    }
  }

  getVictim(id:number): void{
    console.log('estoy en get victim')
    this.victimService.getPatient(id).subscribe(
      data =>{
        this.paciente = data['pacientes'];
        this.loadVictimData();
      },
    error => {
      this.notifications.create('Error', 'No se ha podido obtener la víctima', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 6000,
        showProgressBar: false
      });

      return;
    }
  );

  }

  createUpdateScene(): void{
    if(this.foto.name!=''){
      console.log('Envío formulario');
     // this.loadSceneData();
      this.formSubmited = true;
      if (this.formData.invalid) {
        console.log('Estoy saliendo');
        return; }

      let escena: any;
      if(this.paciente){
        escena = this.paciente.uid;
      }else{
        escena = '';
      }
      console.log('La escena:'+ escena+"eso ");
      if(escena == ''){
        console.log('Estoy creando');
        // si no tenemos id de escena, creamos una
        this.victimService.createPatient(this.formData.value)
        .subscribe(res => {
          this.dataList.loadScenes(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemScene)
          this.closeModal();

          this.notifications.create('Escena creada', 'Se ha creado la víctima correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });
        }, (err) => {

          this.notifications.create('Error', 'No se ha podido crear la víctima', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
      }else{
        console.log('Estoy editando');
        // si tenemos id de escena, la editamos
        console.log('el id  es: '+ escena);
        this.victimService.updatePatient(this.formData.value)
        .subscribe(res => {
          this.dataList.loadScenes(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemScene)
          this.closeModal();

          this.notifications.create('Escena editada', 'Se ha editado la víctima correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });
        }, (err) => {

          this.notifications.create('Error', 'No se ha podido editar la víctima', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });

      }
      if (this.foto ) {
        this.imagenService.subirFoto( this.foto,'pacientes')
        .subscribe( res => {
          // cambiamos el DOM el objeto que contiene la fot
        }, (err) => {
          const errtext = err.error.msg || 'No se pudo cargar la víctima';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
      }

    this.dataList.loadScenes(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemScene)
    this.closeModal();
    }


  }


  closeModal(): void {
    this.modalRef.hide();
  }
}
