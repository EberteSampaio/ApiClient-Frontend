import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Client } from '../../model/Client';
import { ClientService } from '../../service/client.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Utils } from '../../helpers/Utils';


@Component({
  selector: 'app-main',
  imports: [CommonModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  btnRegistration:boolean = true;
  btnCancel:boolean = false;
  btnAlter:boolean  = false;
  btnRemove:boolean = false;
  table:boolean = true;

  client = new Client();

  clients:Client[] = [];

  constructor(private service:ClientService){}

  all():void{
    this.service.findAll()
    .subscribe(response => this.clients = response);
  }

  create():void{
    try{
      
      Utils.validateCNPJ(this.client.identificationNumber);

      this.service.save(this.client)
      .subscribe(response => {
        this.clients.push(response)
        this.client = new Client();
      });

      alert('Empresa Cadastrada com sucesso!')

    }catch(e){
      if(e instanceof Error) alert(e.message);
    }
  }

  selectClient(rowPosition:number):void{
    this.client = this.clients[rowPosition];
    
    this.btnRegistration = false;
    this.btnAlter  = true;
    this.btnRemove = true;
    this.btnCancel = true;

    this.table = false;
  }

  alterClient():void{
    this.service.edit(this.client)
    .subscribe(response =>{
      let position = this.clients.findIndex(object =>{
        return object.id == response.id;
      });

      this.clients[position] = response;
    });

    this.client = new Client();
    this.btnRegistration = true;
    this.table = true;

    alert("Empresa editado com sucesso!");
  }

  remove():void{
    this.service.delete(this.client.id).subscribe(response =>{
      
      let position = this.clients.findIndex(object =>{
        return object.id = this.client.id;
      });

      this.clients.splice(position, 1);

      this.client = new Client();
      
      this.btnRegistration = true;
      this.table = true;

      this.btnAlter  = false;
      this.btnRemove = false;
      this.btnCancel = false;

      alert("Empresa excluida com sucesso!");
    });
  }

  ngOnInit(){
    this.all()
  }
}
