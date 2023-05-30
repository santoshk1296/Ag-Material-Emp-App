import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Employee } from './employee';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private errorMsg: string = "";

  //private baseUrl = 'http://localhost:8091/emp-api/v1/employees';
  //private baseUrl = 'http://192.168.0.165:5000/emp-api/v1/employees'; //Kubernetes cluster url on Macbook CentOs VMware
  private baseUrl ='http://20.237.100.142:5000/emp-api/v1/employees'; //Kubernetes cluster url on Macbook CentOs VMware 

  constructor(private httpclient: HttpClient) { }

  getEmployeeList(): Observable<Employee[]>{
    return this.httpclient.get<Employee[]>(`${this.baseUrl}`)
    .pipe(
      catchError(error => {
          //let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
              this.errorMsg = `Error: ${error.error.message}`;
          } else {
              this.errorMsg = this.getServerErrorMessage(error);
          }

          return throwError(this.errorMsg);
      })
    );
  }

  createEmployee(employee: Employee): Observable<Object>{

    return this.httpclient.post(`${this.baseUrl}`, employee) //.pipe(catchError(this.errorHandler));
    .pipe(
      catchError(error => {
          let errorMsg: string = "";
          if (error.error instanceof ErrorEvent) {
              this.errorMsg = `Error: ${error.error.message}`;
          } else {
              this.errorMsg = this.getServerErrorMessage(error);
          }

          return throwError(this.errorMsg);
      })
    );
  }

  getEmployeeById(id: Number): Observable<Employee> {
    return this.httpclient.get<Employee>(`${this.baseUrl}/${id}`);
  }

  updateEmployee(id: number, employee: Employee): Observable<object> {
    return this.httpclient.put(`${this.baseUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<Object> {
    return this.httpclient.delete(`${this.baseUrl}/${id}`);
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
        case 404: {
            return `Not Found: ${error.message}`;
        }
        case 403: {
            return `Access Denied: ${error.message}`;
        }
        case 500: {
            return `Internal Server Error: ${error.message}`;
        }
        case 400: {
          return `Bad Request\nmessage: ${error.error.message}\nDetails: ${error.error.details}`;
        }
        default: {
            return `Unknown Server Error: ${error.message}`;
        }

    }
  }
}
