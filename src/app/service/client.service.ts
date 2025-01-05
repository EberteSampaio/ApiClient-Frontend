import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../model/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private url:string = 'http://localhost:8080/client';

  constructor(private http:HttpClient) {}

  public findAll():Observable<Client[]>{
    return this.http.get<Client[]>(this.url);
  }
  
  public save(client:Client):Observable<Client>{
    return this.http.post<Client>(this.url, client);
  }

  public edit(client:Client):Observable<Client> {
    return this.http.put<Client>(this.url+"/"+client.id, client);
  }

  public delete(id: number):Observable<void> {
   return this.http.delete<void>(this.url +'/'+id); 
  }
}
