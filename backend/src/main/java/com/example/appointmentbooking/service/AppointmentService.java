package com.example.appointmentbooking.service;

import com.example.appointmentbooking.entity.Appointment;
import com.example.appointmentbooking.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    // Create
    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    // Read All
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Read One
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    // Update
    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            Appointment existingAppointment = appointment.get();
            existingAppointment.setCustomerName(appointmentDetails.getCustomerName());
            existingAppointment.setCustomerEmail(appointmentDetails.getCustomerEmail());
            existingAppointment.setAppointmentDateTime(appointmentDetails.getAppointmentDateTime());
            existingAppointment.setDescription(appointmentDetails.getDescription());
            existingAppointment.setStatus(appointmentDetails.getStatus());
            return appointmentRepository.save(existingAppointment);
        }
        return null;
    }

    // Delete
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}
