import { Component, TemplateRef,  ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataListComponent } from 'src/app/views/app/scenes/data-list/data-list.component';
import { ImagenService } from '../../../data/imagen.service';
import { Imagen } from '../../../models/imagen.model';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import equirectToCubemapFaces from 'equirect-cubemap-faces-js';
import {Canvas} from 'canvas';
@Component({
  selector: 'app-add-new-scene-modal',
  templateUrl: './add-new-scene-modal.component.html',
  styles: []
})
export class AddNewSceneModalComponent  {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  scene: Imagen;
  ruta="vacio";
  imagenes: File[];

  public foto: File = null;
  public foto2: File = null;
  //FORM
  private formSubmited = false;
  public formData=this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    ruta: [''],
    archivo: ['']
  });


  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private sceneService: ImagenService, private fb: FormBuilder, private router: Router , private dataList: DataListComponent,
    private notifications: NotificationsService) { }


  show(id? : number): void {
    this.ruta = "vacio";
    this.formData.reset();

    this.scene = undefined;
    if(id){
      this.getScene(id);
    }
    this.modalRef = this.modalService.show(this.template, this.config);
    this.myCanvas();

  }

   myCanvas() {
    // cargamos en el canvas la imagen de la que tenemos que guardar los datos
    var c = document.getElementById("myCanvas") as HTMLCanvasElement;
    var ctx = c.getContext("2d");
    var img = new Image();
    img.src = "http://localhost:4200/assets/img/tiles/I-0014/preview.png";
    ctx.drawImage(img,0,0 ,1600,800);
  }

  async crear_images(){
    console.log('llego master');
    let i =  document.getElementById('myCanvas');
    var cs = equirectToCubemapFaces(i);
    // cs.forEach(function(c) {
    //   console.log('llego master');

    // });
    console.log(cs);
    for(let a =0; a < cs.length; a++){
      // this.imagenes.push(cs[a].toDataURL("image/png"));

    // var canvas = document.getElementById('canvas');
    // var ctx = canvas.getContext('2d');
    // let inCtx = i.getContext("2d");
    // let imageData = inCtx.getImageData(0, 0, i.width, i.height);
    // let imagen;
    // var cs = equirectToCubemapFaces.transformSingleFace(i,0,imagen);
    // let imagen2 = imagen.toDataURL("image/png")
    //      this.sceneService.subirimgescenario(imagen2,'tiles2', 'I-0014')
    //     .subscribe( res => {
    //       console.log('se ha subido la imagen de escena');
    //     }, (err) => {
    //       const errtext = err.error.msg || 'No se pudo subir la imagen de escena';
    //       Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
    //       return });

        let name = 'I-0014'; //this.ruta.split('/',1);
      // const blob = await file.blob();
       // var img = cs[a].toDataURL("image/png").replace("image/png");
       // console.log(img);
       await cs[a].toBlob((blob) => {
        let file = new File([blob], "fileName.jpg", { type: "image/jpeg" })
        this.foto2 = file;
        console.log(this.foto2)
        this.sceneService.subirimgescenario(this.foto2, 'tiles2', 'I-0014.'+a+'.png')
        .subscribe( res => {
          console.log('se ha subido la imagen de escena');
        }, (err) => {
          const errtext = err.error.msg || 'No se pudo subir la imagen de escena';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
      }, 'image/jpeg');



      }
  }

  updateImage(){

    if (this.foto ) {
      this.sceneService.subirFoto( this.foto,'tiles')
      .subscribe( res => {
        console.log('se ha subido la imagen');
      }, (err) => {
        const errtext = err.error.msg || 'No se pudo subir la imagen';
        Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
        return;
      });
    }
  }

  loadSceneData() {

    if(this.scene ) {
      this.formData.get('nombre').setValue(this.scene.nombre);
      this.formData.get('descripcion').setValue(this.scene.descripcion);
      this.formData.get('ruta').setValue(this.scene.ruta);
      //console.log('la foto es '+this.foto);
      this.ruta = this.scene.ruta;
    }

  }


  cambioImagen( evento ): void {

    if (evento.target.files && evento.target.files[0] &&  evento.target.files[0] != null) {
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
      this.updateImage();
    } else {
      console.log('no llega target:', evento);
    }
  }


  loadImage(src) {
    return new Promise(function(resolve, reject) {
        var i = new Image();
        i.onload = function() { resolve(i); }
        i.onerror = reject;
        i.src = src;
    });
}



  getScene(id:number): void{
    this.sceneService.getImage(id,'tiles').subscribe(
      data =>{
        this.scene = data['imagenes'];
        this.loadSceneData();
      },
    error => {
      this.notifications.create('Error', 'No se ha podido obtener la escena', NotificationType.Error, {
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
      if(this.scene){
        escena = this.scene.uid;
      }else{
        escena = '';
      }
      console.log('La escena:'+ escena+"eso ");
      if(escena == ''){
        console.log('Estoy creando');
        // si no tenemos id de escena, creamos una
        this.sceneService.createImage(this.formData.value,'tiles')
        .subscribe(res => {
          this.dataList.loadScenes(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemScene)
          this.closeModal();

          this.notifications.create('Escena creada', 'Se ha creado la escena correctamente', NotificationType.Info, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });
        }, (err) => {

          this.notifications.create('Error', 'No se ha podido crear la escena', NotificationType.Error, {
            theClass: 'outline primary',
            timeOut: 6000,
            showProgressBar: false
          });

          return;
      });
      }else{
        console.log('Estoy editando');
        // si tenemos id de escena, la editamos
        this.sceneService.updateImage(this.formData.value, escena,'tiles')
        .subscribe(res => {
          this.dataList.loadScenes(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemScene)
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
      this.updateImage();

    this.dataList.loadScenes(this.dataList.itemsPerPage, this.dataList.currentPage, this.dataList.itemScene)
    this.closeModal();
    }
  }


  closeModal(): void {
    this.modalRef.hide();
  }
}
