import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';

import { AppointmentService } from '../../services/appointment';
import { Appointment } from '../../models/appointment';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './appointment-form.html',
  styleUrls: ['./appointment-form.scss']
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode = false;
  appointmentId: number | null = null;  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    this.appointmentForm = this.fb.group({
      customerName: ['', [Validators.required]],
      customerEmail: ['', [Validators.required, Validators.email]],
      appointmentDate: [now, [Validators.required]],
      appointmentTime: [currentTime, [Validators.required]],
      description: [''],
      status: ['SCHEDULED']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.appointmentId = +id;
      this.loadAppointment(this.appointmentId);
    }
  }  loadAppointment(id: number): void {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment) => {
        const date = new Date(appointment.appointmentDateTime);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const timeStr = `${hours}:${minutes}`;
        
        this.appointmentForm.patchValue({
          ...appointment,
          appointmentDate: date,
          appointmentTime: timeStr
        });
      },
      error: (error) => this.showError('Error loading appointment')
    });
  }  onSubmit(): void {
    if (this.appointmentForm.valid) {      const formValue = this.appointmentForm.value;
      
      // Create a new date object from the selected date
      const date = new Date(formValue.appointmentDate);
      
      // Parse the time string (HH:mm format)
      const timeStr = formValue.appointmentTime || '00:00';
      const [hours, minutes] = timeStr.split(':').map((num: string): number => parseInt(num, 10));
      
      // Set the time components while preserving the date
      date.setHours(hours || 0);
      date.setMinutes(minutes || 0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      
      const appointment: Appointment = {
        ...formValue,
        appointmentDateTime: date.toISOString(),
      };
      
      if (this.isEditMode && this.appointmentId) {
        this.updateAppointment(this.appointmentId, appointment);
      } else {
        this.createAppointment(appointment);
      }
    }
  }

  private createAppointment(appointment: Appointment): void {
    this.appointmentService.createAppointment(appointment).subscribe({
      next: () => {
        this.showSuccess('Appointment created successfully');
        this.router.navigate(['/appointments']);
      },
      error: (error) => this.showError('Error creating appointment')
    });
  }

  private updateAppointment(id: number, appointment: Appointment): void {
    this.appointmentService.updateAppointment(id, appointment).subscribe({
      next: () => {
        this.showSuccess('Appointment updated successfully');
        this.router.navigate(['/appointments']);
      },
      error: (error) => this.showError('Error updating appointment')
    });
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}
