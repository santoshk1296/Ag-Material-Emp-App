import { Component } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { EmployeeAddComponent } from './employee-add/employee-add.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'Ag-Material-Emp-App';
  //emplist!: EmployeeListComponent;
  
  constructor(private dialog: MatDialog) {}

  openDialog() {
    
    console.log(`Came in openDialog`);

    this.dialog.open(EmployeeAddComponent, {
      width: '30%'
    }).afterClosed().subscribe(val => {
      if (val === 'Save'){
        console.log(`Came close Add Dialog`);
        window.location.reload();
      }
    });

  }
}
