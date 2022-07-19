import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css']
})

export class EmployeeAddComponent implements OnInit {

  employeeForm !: FormGroup;

  employee: Employee = new Employee();

  actionBtn: String = "Save";
  empFormTitle: String = "Add Employee Form";

  constructor(private formBuilder: FormBuilder, private emplyeeservice: EmployeeService, 
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialRef: MatDialogRef<EmployeeAddComponent>) { }

  ngOnInit(): void {

    this.employeeForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', Validators.required]
    });

    if (this.editData) {

      console.log('Inside onInit editData');
      this.actionBtn = "Update";
      this.empFormTitle = "Update Employee Form";
      this.employeeForm.controls["firstName"].setValue(this.editData.firstName);
      this.employeeForm.controls["lastName"].setValue(this.editData.lastName);
      this.employeeForm.controls["emailId"].setValue(this.editData.emailId);
      console.log('After editData');

    }
  }

  //This is with Error validation
  saveEmployee() {

    this.emplyeeservice.createEmployee(this.employee).subscribe(data => {

      console.log(data);
      alert("Employee Saved");
      this.employeeForm.reset();

    }, error => {
      
      console.log('Error=>' + error);
      if (error) {
        console.log('Error=>' + error);
        alert(error);
      }
    });

  }

  //This is with Angular 13 handling
  saveEmployeeA13() {

    this.emplyeeservice.createEmployee(this.employee).subscribe({
      next: (res) => {
        alert("Employee Added");
        this.employeeForm.reset();
        this.dialRef.close('Save');
      },
        error: (err) => {
          alert(err);
        }
      });

  }

  updateEmployee(id: number, data: any){

    this.emplyeeservice.updateEmployee(id, data)
    .subscribe({
      next: (res) => {
        alert("Employee Updated");
        this.employeeForm.reset();
        this.dialRef.close('Updated');
      },
        error: (err) => {
          alert(err);
        }
      });
  }

  onSubmit() {

    if (!this.editData) {
      if (this.employeeForm.valid) {
        this.employee = this.employeeForm.value;
        console.log("New Employee=>"+this.employeeForm.value);
        console.log(this.employee);
        //this.saveEmployee();
        this.saveEmployeeA13();
      }
    }
    else {

      console.log('Inside OnSubmit else');
      console.log("Update Form value=>"+this.employeeForm.value );
      console.log("Id to Update>"+this.editData.id);
    
      this.updateEmployee(this.editData.id, this.employeeForm.value);
      
    }
  }
  

}