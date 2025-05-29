package com.example.appointmentbooking.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    private String customerName;
    
    @NotNull
    private String customerEmail;
      @NotNull
    private LocalDateTime appointmentDateTime;
    
    private String description;
    
    private String status = "SCHEDULED";
    
    // Helper methods for time handling
    public void setAppointmentDateTime(LocalDateTime dateTime) {
        this.appointmentDateTime = dateTime;
    }

    public LocalDateTime getAppointmentDateTime() {
        return this.appointmentDateTime;
    }
}
