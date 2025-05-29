import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AppointmentService } from '../../services/appointment';
import { Appointment } from '../../models/appointment';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.html',
  styleUrls: ['./appointment-list.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class AppointmentListComponent implements OnInit {
  appointments: Appointment[] = [];
  displayedColumns: string[] = ['customerName', 'customerEmail', 'appointmentDateTime', 'status', 'actions'];
  error: string | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.error = null;
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        console.log('Appointments loaded:', data);
        this.appointments = data;
      },
      error: (error) => {
        console.error('Error loading appointments:', error);
        this.error = 'Error loading appointments';
        this.showError('Error loading appointments: ' + (error.message || 'Unknown error'));
      }
    });
  }

  deleteAppointment(id: number): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => {
          this.loadAppointments();
          this.showSuccess('Appointment deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting appointment:', error);
          this.showError('Error deleting appointment');
        }
      });
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
