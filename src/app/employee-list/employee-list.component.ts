import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EmployeeAddComponent } from '../employee-add/employee-add.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})

export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'emailId', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public employeeservice: EmployeeService, private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getEmployees();
  }
 
  getEmployees(){
    
    this.employeeservice.getEmployeeList().subscribe({
      next: (res) => {
        console.log(res);
        this.employees = res;
        //this.dataSource = new MatTableDataSource(this.employees);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
      },
        error: (err) => {
          alert(err);
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToEmployeeDetail(){
    this.router.navigate(['/create-employee']);
  }

  updateEmployee(row: any){

    this.dialog.open(EmployeeAddComponent, {
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if (val=== 'Updated'){
        console.log('Coming After Update dialog close');
        this.getEmployees();
      }
    })
    
  }

  deleteEmployee(id: number){
    this.employeeservice.deleteEmployee(id).subscribe({
      next: (res) => {
        alert("Employee Deleted");
        this.getEmployees();
      },
        error: (err) => {
          alert(err);
        }
      });
  }

}
