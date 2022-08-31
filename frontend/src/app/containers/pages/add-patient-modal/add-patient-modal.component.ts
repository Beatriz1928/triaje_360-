import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { SenderService } from 'src/app/data/sender.service';
import { ImagenPacienteService } from 'src/app/data/imagenPaciente.service';
import { ImagenPaciente } from 'src/app/models/imagenPaciente.model';
import { PacienteService } from 'src/app/data/paciente.service';
import { AuthService } from 'src/app/shared/auth.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { environment } from 'src/environments/environment';
import { Paciente } from '../../../models/paciente.model';

@Component({
  selector: 'app-add-patient-modal',
  templateUrl: './add-patient-modal.component.html',
  styleUrls: ['./add-patient-modal.component.scss']
})
export class AddPatientModalComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  userRole: number;
  ejercicio: number;
  pacientes: Paciente[] =[];
  idAnyadidos: string[] =[];
  @Input() parentImg: string;
  imagenSeleccionada: string;
  urlPrefixPacientes: string = environment.prefix_urlPacientes;

  @Output() seleccionarImg = new EventEmitter<String>();
  @Output() resetParentImg = new EventEmitter();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(
    private modalService: BsModalService,
    private auth: AuthService,
    private sender: SenderService,
    private imagenPacienteService: ImagenPacienteService,
    private notifications: NotificationsService,
    private pacienteService: PacienteService) { }


  ngOnInit(): void {
    this.userRole = this.auth.rol;
    this.ejercicio = this.sender.idExercise;
    this.getPacientes();
  }

  getPacientes(): void {
    this.pacienteService.getPatients().subscribe(
      data => {
        if (data['ok']) {
          this.pacientes = data['pacientes'];
        }
      },
      error => {
        this.notifications.create('Error', 'No se han podido obtener las victimas', NotificationType.Error, {
          theClass: 'outline primary',
          timeOut: 6000,
          showProgressBar: false
        });

        return;
      }
    );
  }

  selectpacientes(id: string ) {
    console.log(id);
    // si anyadir es true se anyade si no se elimina de array de victimas seleccionadas
    if(this.idAnyadidos.length == 0 || !this.idAnyadidos.includes(id)) {
      var element = document.getElementById(id);
      element.parentElement.className = 'selected';
      this.idAnyadidos.push(id);
    }else{
      console.log(this.idAnyadidos.indexOf(id));
      this.idAnyadidos.splice(this.idAnyadidos.indexOf(id),1);
      var unSelect = document.getElementById(id);
      unSelect.parentElement.className = 'noSelected';
    }
    console.log(this.idAnyadidos);
  }

  show() {
    // if(this.parentImg) {
      this.imagenSeleccionada = this.parentImg;
      this.resetParentImg.emit();
    // }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  closeModal(): void {
    this.seleccionarImg.emit(this.imagenSeleccionada);
    this.modalRef.hide();
  }

}
