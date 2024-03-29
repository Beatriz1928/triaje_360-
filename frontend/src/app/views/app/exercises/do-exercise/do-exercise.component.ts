import { Component, OnInit, ElementRef, QueryList, Renderer2, ViewChild,ViewChildren, HostListener } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { EjercicioService } from 'src/app/data/ejercicio.service';
import { PacienteEjercicioService } from 'src/app/data/pacienteEjercicio.service';
import { SenderService } from 'src/app/data/sender.service';
import { Ejercicio } from 'src/app/models/ejercicio.model';
import { PacienteEjercicio } from 'src/app/models/pacienteEjercicio.model';
import { environment } from 'src/environments/environment';
import { TriarPatientComponent } from '../../../../containers/pages/triar-patient/triar-patient.component';
import { DatePipe } from '@angular/common';
import { ImagenService } from '../../../../data/imagen.service';
import { ActividadService } from 'src/app/data/actividad.service';
import { Paciente } from 'src/app/models/paciente.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SonidoService } from 'src/app/data/sonido.service';
import { Sonido } from 'src/app/models/sonido.model';
var Marzipano = require('marzipano');
import { Howl, Howler } from 'howler';

@Component({
  selector: 'app-do-exercise',
  templateUrl: './do-exercise.component.html',
  styleUrls: ['./do-exercise.component.scss'],
  providers: [DatePipe],


})

export class DoExerciseComponent implements OnInit {
  @ViewChild('triarModalRef', { static: true }) triarModalRef: TriarPatientComponent;
  @ViewChild('buttonInfo') buttonInfo: ElementRef;
  urlPrefixPacientes: string = environment.prefix_urlPacientes;
  ejercicio: Ejercicio;
  pacientesEjercicio: PacienteEjercicio[] = [];
  realizaEjercicio = true;
  data = {
    "scenes": [],
    "name": "",
    "ruta": "",
    "settings": {
      "mouseViewMode": "drag",
      "autorotateEnabled": false,
      "fullscreenButton": false,
      "viewControlButtons": false
    }
  };
  isFullScreen = false;
  posiciones: any[][] = [
    [{"yaw":-2.3,"pitch":-0.55}, {"yaw":-1.91,"pitch":-0.55}, {"yaw":-1.52,"pitch":-0.55}, {"yaw":-1.13,"pitch":-0.55}, {"yaw":-0.74,"pitch":-0.55}, {"yaw":-0.35,"pitch":-0.55}, {"yaw":0.04,"pitch":-0.55}, {"yaw":0.43,"pitch":-0.55}, {"yaw":0.82,"pitch":-0.55}, {"yaw":1.21,"pitch":-0.55}, {"yaw":1.6,"pitch":-0.55}, {"yaw":1.99,"pitch":-0.55}, {"yaw":2.38,"pitch":-0.55}, {"yaw":2.77,"pitch":-0.55}, {"yaw":3.16,"pitch":-0.55}, {"yaw":3.55,"pitch":-0.55}],
    [{"yaw":-2.3,"pitch":-0.25}, {"yaw":-1.91,"pitch":-0.25}, {"yaw":-1.52,"pitch":-0.25}, {"yaw":-1.13,"pitch":-0.25}, {"yaw":-0.74,"pitch":-0.25}, {"yaw":-0.35,"pitch":-0.25}, {"yaw":0.04,"pitch":-0.25}, {"yaw":0.43,"pitch":-0.25}, {"yaw":0.82,"pitch":-0.25}, {"yaw":1.21,"pitch":-0.25}, {"yaw":1.6,"pitch":-0.25}, {"yaw":1.99,"pitch":-0.25}, {"yaw":2.38,"pitch":-0.25}, {"yaw":2.77,"pitch":-0.25}, {"yaw":3.16,"pitch":-0.25}, {"yaw":3.55,"pitch":-0.25}],
    [{"yaw":-2.3,"pitch":0.05},  {"yaw":-1.91,"pitch":0.05},  {"yaw":-1.52,"pitch":0.05},  {"yaw":-1.13,"pitch":0.05},  {"yaw":-0.74,"pitch":0.05},  {"yaw":-0.35,"pitch":0.05},  {"yaw":0.04,"pitch":0.05},  {"yaw":0.43,"pitch":0.05},  {"yaw":0.82,"pitch":0.05},  {"yaw":1.21,"pitch":0.05},  {"yaw":1.6,"pitch":0.05},  {"yaw":1.99,"pitch":0.05},  {"yaw":2.38,"pitch":0.05},  {"yaw":2.77,"pitch":0.05},  {"yaw":3.16,"pitch":0.05},  {"yaw":3.55,"pitch":0.05}],
    [{"yaw":-2.3,"pitch":0.35},  {"yaw":-1.91,"pitch":0.35},  {"yaw":-1.52,"pitch":0.35},  {"yaw":-1.13,"pitch":0.35},  {"yaw":-0.74,"pitch":0.35},  {"yaw":-0.35,"pitch":0.35},  {"yaw":0.04,"pitch":0.35},  {"yaw":0.43,"pitch":0.35},  {"yaw":0.82,"pitch":0.35},  {"yaw":1.21,"pitch":0.35},  {"yaw":1.6,"pitch":0.35},  {"yaw":1.99,"pitch":0.35},  {"yaw":2.38,"pitch":0.35},  {"yaw":2.77,"pitch":0.35},  {"yaw":3.16,"pitch":0.35},  {"yaw":3.55,"pitch":0.35}]
  ];
  horas: number;
  minutos: number;
  segundos: number;
  time: string = undefined;
  actividad = {
    "nombre": undefined,
    "tiempo": undefined,
    "momento": undefined,
    "ejercicioUsuario": this.sender.ejercicioUsuario,
    "paciente": undefined,
    "color": undefined,
    "accion": undefined
  }
  sonido: Sonido;
  sound = undefined;


  constructor(
    private sender: SenderService,
    private ejercicioService: EjercicioService,
    private notifications: NotificationsService,
    private pacienteEjercicioService: PacienteEjercicioService,
    private datePipe: DatePipe,
    private actividadService: ActividadService,
    private router: Router,
    private sceneService: ImagenService,
    private renderer: Renderer2,
    private sonidoService: SonidoService
    ) {}

  async ngOnInit() {
   await this.getExercise();
    this.resetTimer();
    this.formatTime();
    this.createActivity("Empieza el Ejercicio", 0);
    setInterval(() => this.tick(), 1000);
    document.getElementById("navbar").style.display = "none";
  }

  @HostListener('document:fullscreenchange', ['$event'])
  handleFullscreen(event): void {
    if (document.fullscreenElement) {
      this.isFullScreen = true;
    } else {
      this.isFullScreen = false;
    }
  }

  fullScreenClick(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  cargarsonido(): void {
    console.log("Sonido: " ,this.sonido);
    this.sound = new Howl({
      src: ['././././assets/img/audio/' + this.sonido.ruta + ''],
      loop: true,
    });
    this.sound.play();
  }

  async setSound() {
    let result = await this.sonidoService.getSonido(this.ejercicio.sonido).toPromise();
    this.sonido = result['sonidos'];
    this.cargarsonido();
   }


  resetTimer() {
    this.horas = 0;
    this.minutos = 0;
    this.segundos = 0;
  }

  tick(): void {
    if(++this.segundos > 59) {
      this.segundos = 0;
      if(++this.minutos > 59) {
        this.minutos = 0;
        if(++this.horas > 23) {
          this.horas = 0;
        }
      }
    }
    this.formatTime();
  }

  formatTime() {
    let time = new Date(0, 0, 0, this.horas, this.minutos, this.segundos);
    this.time = this.datePipe.transform(time, 'HH:mm:ss');
    // console.log('TIME: ', this.time);
  }

  async getExercise() {
    let result = await this.ejercicioService.getExercise(this.sender.idExercise).toPromise();

     this.ejercicio = result['ejercicios'];
       console.log(this.ejercicio);
       this.setImagesScene();
       console.log("ANTES SET SOUND" );
       await this.setSound();
       console.log("DESPUES SET SOUND" );
  }

  getExercisePatients() {
    this.pacienteEjercicioService.getExercisePatients(this.sender.idExercise).subscribe(data => {
      this.pacientesEjercicio = data['pacientesEjercicio'];
      this.setPatientsScene();
    },
    error => {
      this.notifications.create('Error', 'No se han podido obtener los Pacientes del Ejercicio', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 6000,
        showProgressBar: false
      });

      return;
    });

  }

  setPatientsScene() {
    for(let i=0; i<this.pacientesEjercicio.length; i++) {
      for(let j=0; j<this.data.scenes.length; j++) {
        if(this.pacientesEjercicio[i].idImagen['nombre'] == this.data.scenes[j].id) {
            this.data.scenes[j].infoHotspots.push({
            "yaw": this.posiciones[this.pacientesEjercicio[i].x][this.pacientesEjercicio[i].y].yaw,
            "pitch": this.posiciones[this.pacientesEjercicio[i].x][this.pacientesEjercicio[i].y].pitch,
            "src": this.urlPrefixPacientes + this.pacientesEjercicio[i].idPaciente['img'],
            "paciente": this.pacientesEjercicio[i].idPaciente,
            "index": i,
            "color": '',
            "acciones": []
          });
        }
      }
    }
    this.marzipanoScene();
  }

  setImagesScene() {
    // console.log(this.data);
    this.data.name = this.ejercicio.nombre;
    for(let i=0; i<this.ejercicio.imgs.length; i++) {
      let targetLeft, targetRight;
      if (this.ejercicio.imgs.length == 1) {
        targetRight = this.ejercicio.imgs[0].img.ruta;
        targetLeft = targetRight;
      } else {
        if(i == 0) {
        targetLeft = this.ejercicio.imgs[this.ejercicio.imgs.length-1].img.nombre;
        targetRight = this.ejercicio.imgs[i+1].img.nombre;
      } else if (i == this.ejercicio.imgs.length-1) {
        targetLeft = this.ejercicio.imgs[i-1].img.nombre;
        targetRight = this.ejercicio.imgs[0].img.nombre;
      } else {
        targetLeft = this.ejercicio.imgs[i-1].img.nombre;
        targetRight = this.ejercicio.imgs[i+1].img.nombre;
      }
    }
      this.data.scenes.push({
        "id": this.ejercicio.imgs[i].img.nombre,
        "name": this.ejercicio.imgs[i].img.descripcion,
        "ruta": this.ejercicio.imgs[i].img.ruta,
        "levels": [
          {
            "tileSize": 256,
            "size": 256,
            "fallbackOnly": true
          },
          {
            "tileSize": 512,
            "size": 512
          }
        ],
        "faceSize": 896,
        "initialViewParameters": {
          "yaw": -1.0006674819595993,
          "pitch": -0.25
        },
        "linkHotspots": [
          {
            "yaw": -2.05,
            "pitch": -0.37,
            "rotation": 4.71238898038469,
            "target": targetLeft
          },
          {
            "yaw": 0,
            "pitch": -0.42,
            "rotation": -4.71238898038469,
            "target": targetRight
          },
        ],
        "infoHotspots": []
      });
    }

    this.getExercisePatients();
  }

  setColour(event): void {

    var icon, encontrado = false;
    for(let i=0; i<this.pacientesEjercicio.length; i++) {
      if(event.paciente['_id'] == this.pacientesEjercicio[i].idPaciente['_id'] && !encontrado) {
        encontrado = true;
        icon = document.getElementById('paciente'+i);
        // recorrido para cargar el color de un paciente clasificado
        for(let j=0; j<this.data.scenes.length; j++) {
          for(let k=0; k<this.data.scenes[j].infoHotspots.length; k++) {
            if(this.data.scenes[j].infoHotspots[k].paciente['_id'] == event.paciente['_id']) {
              this.data.scenes[j].infoHotspots[k].color = event.color;
            }
          }

        }
      }
    }

    switch (event.color) {
      case 'Verde':
        icon.classList.remove('amarillo');
        icon.classList.remove('rojo');
        icon.classList.remove('negro');
        icon.classList.remove('no_triado');
        icon.classList.add('verde');
        break;
      case 'Amarillo':
        icon.classList.remove('verde');
        icon.classList.remove('rojo');
        icon.classList.remove('negro');
        icon.classList.remove('no_triado');
        icon.classList.add('amarillo');
        break;
      case 'Rojo':
        icon.classList.remove('verde');
        icon.classList.remove('amarillo');
        icon.classList.remove('negro');
        icon.classList.remove('no_triado');
        icon.classList.add('rojo');
        break;
      case 'Negro':
        icon.classList.remove('verde');
        icon.classList.remove('amarillo');
        icon.classList.remove('rojo');
        icon.classList.remove('no_triado');
        icon.classList.add('negro');
        break;
      default:
        icon.classList.remove('verde');
        icon.classList.remove('amarillo');
        icon.classList.remove('rojo');
        icon.classList.remove('negro');
        icon.classList.add('no_triado');
        break;
    }

    // let nombre = "Asignación de color '" + event.color + "' a Paciente " + this.searchPatient(event.paciente['_id']);
    let nombre = "Asignación de color '" + event.color + "' a";
    this.createActivity(nombre, 10, event.paciente, event.color);
  }

  setAction(event) {
    let accionAsiganda = false;
    for(let j=0; j<this.data.scenes.length && !accionAsiganda; j++) {
      for(let k=0; k<this.data.scenes[j].infoHotspots.length; k++) {
        if(this.data.scenes[j].infoHotspots[k].paciente['_id'] == event.paciente['_id']) {
          accionAsiganda = true;
          this.data.scenes[j].infoHotspots[k].acciones.push(event.accion);
        }
      }
    }
    // this.setPenalizacion(event.accion.tiempo);
    let nombre = "Realización de Acción '" + event.accion.nombre + "' a";
    this.createActivity(nombre, event.accion.tiempo, event.paciente, undefined, event.accion.uid);
  }

  backScene() {
    this.createActivity('Volver a la escena', 10);
  }

  setPenalizacion(tiempo) {
    this.segundos += tiempo;
    // console.log('aumento el crono: ', tiempo);
    if(this.segundos > 59) {
      this.minutos += Math.trunc(this.segundos/60);
      if(this.minutos > 59) {
        this.horas += Math.trunc(this.minutos/60);
        this.minutos = this.minutos%60;
      }
      this.segundos = this.segundos%60;
    }
  }

  searchPatient(uid: number): number {
    for(let i=0; i<this.ejercicio.pacientes.length; i++) {
      if(this.ejercicio.pacientes[i].paciente['_id'] == uid) {
        return i+1;
      }
    }
    return -1;
  }

  createActivity(nombre: string, tiempo: number, paciente?: Paciente, color?: string, accion?: number) {
    this.actividad.nombre = nombre;
    this.actividad.tiempo = tiempo;
    this.actividad.momento = this.time;
    this.actividad.ejercicioUsuario = this.sender.ejercicioUsuario;
    if(paciente) {
      this.actividad.paciente = paciente['_id'];
      if(color) {
        switch(color) {
          case 'Verde':
            this.actividad.color = 'verde';
            break;
          case 'Amarillo':
            this.actividad.color = 'amarillo';
            break;
          case 'Rojo':
            this.actividad.color = 'rojo';
            break;
          case 'Negro':
            this.actividad.color = 'negro';
            break;
        }
      } else if(accion) {
        this.actividad.accion = accion;
      }
    }

    this.actividadService.createActivity(this.actividad).subscribe(data => {
      if(data['actividad'].nombre == "Terminar Ejercicio") {
        this.sender.ejercicioUsuario = undefined;
        this.sound.pause();
        this.router.navigate(['app/dashboards/all/exercises/data-list']);
      }
      this.setPenalizacion(this.actividad.tiempo);
      this.resetActividad();
    }, (err) => {
      this.notifications.create('Error', 'No se ha podido crear la Actividad', NotificationType.Error, {
        theClass: 'outline primary',
        timeOut: 6000,
        showProgressBar: false
      });

      return;
    });
  }

  resetActividad() {
    this.actividad.nombre = undefined;
    this.actividad.tiempo = undefined;
    this.actividad.momento = undefined;
    this.actividad.paciente = undefined;
    this.actividad.color = undefined;
    this.actividad.accion = undefined;
  }

  terminarEjercicio() {
    Swal.fire({
      title: 'Terminar Ejercicio',
      text: '¿Estás seguro de que quieres terminar el Ejercicio?',
      icon: 'warning',
      showDenyButton: true,
      iconColor: '#145388',
      confirmButtonColor: '#145388',
      denyButtonColor: '#145388',
      confirmButtonText: `Sí`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.createActivity("Terminar Ejercicio", 0);
      document.getElementById("navbar").style.display = "flex";
      } else if (result.isDenied) {
        Swal.close();
      }
    });
  }

  marzipanoScene(): void {
    // copia de THIS para poder acceder a las funciones en los callbacks
    var that = this;
    // Grab elements from DOM.
    var panoElement = document.querySelector('#pano');
    var sceneNameElement = document.querySelector('#titleBar .sceneName');

    // Viewer options.
    var viewerOpts = {
      controls: {
        mouseViewMode: this.data.settings.mouseViewMode
      }
    };

    // Initialize viewer.
    var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

    // Create scenes.
    var scenes = this.data.scenes.map(function(data) {
      var urlPrefix = "././././assets/img/tiles";
      var source = Marzipano.ImageUrlSource.fromString(
      //  urlPrefix + "/" + data.id + "/preview.png");
      urlPrefix + "/" +data.ruta);


        var geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);

        var limiter = Marzipano.RectilinearView.limit.traditional(1024, 100*Math.PI/180);
        var view = new Marzipano.RectilinearView({ yaw: Math.PI }, limiter);

      var scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
        pinFirstLevel: true
      });

      // Create link hotspots.
      data.linkHotspots.forEach(function(hotspot) {
        var element = createLinkHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
      });

      // Create info hotspots.
      data.infoHotspots.forEach(function(hotspot) {
        var element = createInfoHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
      });

      return {
        data: data,
        scene: scene,
        view: view
      };
    });

    // DOM elements for view controls.
    var viewUpElement = document.querySelector('#viewUp');
    var viewDownElement = document.querySelector('#viewDown');
    var viewLeftElement = document.querySelector('#viewLeft');
    var viewRightElement = document.querySelector('#viewRight');
    var viewInElement = document.querySelector('#viewIn');
    var viewOutElement = document.querySelector('#viewOut');

    // Dynamic parameters for controls.
    var velocity = 0.7;
    var friction = 3;

    // Associate view controls with elements.
    var controls = viewer.controls();
    controls.registerMethod('upElement',    new Marzipano.ElementPressControlMethod(viewUpElement,     'y', -velocity, friction), true);
    controls.registerMethod('downElement',  new Marzipano.ElementPressControlMethod(viewDownElement,   'y',  velocity, friction), true);
    controls.registerMethod('leftElement',  new Marzipano.ElementPressControlMethod(viewLeftElement,   'x', -velocity, friction), true);
    controls.registerMethod('rightElement', new Marzipano.ElementPressControlMethod(viewRightElement,  'x',  velocity, friction), true);
    controls.registerMethod('inElement',    new Marzipano.ElementPressControlMethod(viewInElement,  'zoom', -velocity, friction), true);
    controls.registerMethod('outElement',   new Marzipano.ElementPressControlMethod(viewOutElement, 'zoom',  velocity, friction), true);

    function sanitize(s) {
      return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
    }

    function switchScene(scene): void {
      scene.view.setParameters(scene.data.initialViewParameters);
      scene.scene.switchTo();
      updateSceneName(scene);
    }

    function updateSceneName(scene) {
      sceneNameElement.innerHTML = sanitize(scene.data.name);
    }

    function createLinkHotspotElement(hotspot: any) {
      // Create wrapper element to hold icon and tooltip.
      var wrapper = document.createElement('div');
      wrapper.classList.add('hotspot');
      wrapper.classList.add('link-hotspot');
      wrapper.style['width'] = '90px';
      wrapper.style['height'] = '90px';

      // Create image element.
      var icon = document.createElement('img');
      icon.src = '././././assets/img/marzipano/link.png';
      icon.classList.add('link-hotspot-icon');
      icon.style['cursor'] = 'pointer';
      icon.style['width'] = '100%';
      icon.style['height'] = '100%';

      // Set rotation transform.
      var transformProperties = [ '-ms-transform', '-webkit-transform', 'transform' ];
      for (var i = 0; i < transformProperties.length; i++) {
        var property = transformProperties[i];
        icon.style[property] = 'rotate(' + hotspot.rotation + 'rad)';
      }

      // Add click event handler.
      wrapper.addEventListener('click', function() {
        switchScene(findSceneById(hotspot.target));
        that.createActivity("Desplazamiento por la escena", 15);
      });

      // Prevent touch and scroll events from reaching the parent element.
      // This prevents the view control logic from interfering with the hotspot.
      stopTouchAndScrollEventPropagation(wrapper);

      // Create tooltip element.
      var tooltip = document.createElement('div');
      tooltip.classList.add('hotspot-tooltip');
      tooltip.classList.add('link-hotspot-tooltip');

      wrapper.appendChild(icon);
      wrapper.appendChild(tooltip);

      return wrapper;
    }

    function createInfoHotspotElement(hotspot) {
      // Create wrapper element to hold icon and tooltip.
      var wrapper = document.createElement('div');
      wrapper.classList.add('hotspot');
      wrapper.classList.add('info-hotspot');
      wrapper.style['width'] = '120px';
      wrapper.style['height'] = '120px';

      // Add click event handler.
      wrapper.addEventListener('click', function() {
        var i = that.searchPatient(hotspot.paciente['_id']);
        if(i > -1) {
          that.triarModalRef.show(hotspot.paciente, hotspot.color, hotspot.acciones);
          // that.createActivity("Entra a atender a Paciente " + i, 10, hotspot.paciente);
          that.createActivity("Entra a atender a", 10, hotspot.paciente);
        }

      });

      var icon = document.createElement('img');
      // icon.src = '././././assets/img/marzipano/info.png';
      icon.src = hotspot.src;
      icon.classList.add('info-hotspot-icon');
      icon.style['width'] = '100%';
      icon.style['height'] = '100%';
      icon.style['cursor'] = 'pointer';
      icon.style['border-radius'] = '10px';
      // iconWrapper.appendChild(icon);

      var color = document.createElement('i');
      color.classList.add('simple-icon-check');
      color.classList.add('no_triado');
      color.setAttribute('id', 'paciente' + hotspot.index);

      stopTouchAndScrollEventPropagation(wrapper);

      wrapper.appendChild(icon);
      wrapper.appendChild(color);

      return wrapper;
    }

    // Prevent touch and scroll events from reaching the parent element.
    function stopTouchAndScrollEventPropagation(element): void {
      var eventList = [ 'touchstart', 'touchmove', 'touchend', 'touchcancel',
                        'wheel', 'mousewheel' ];
      for (var i = 0; i < eventList.length; i++) {
        element.addEventListener(eventList[i], function(event) {
          event.stopPropagation();
        });
      }
    }

    function findSceneById(id) {
      for (var i = 0; i < scenes.length; i++) {
        if (scenes[i].data.id === id) {
          return scenes[i];
        }
      }
      return null;
    }

    // Display the initial scene.
    switchScene(scenes[0]);

  }

}
