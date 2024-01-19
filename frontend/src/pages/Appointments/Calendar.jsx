import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid';
import { Modal } from 'antd';
import AppointmentForm from './AppointmentForm'; // Your previously created form component
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { appUrl } from '../../constants';

const Calendar = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [events, setEvents] = useState([{ title: 'Test', start: '2023-11-07', end: '2023-11-08' }]); // Your events state
    const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);
    const [appointmentList, setAppointmentList] = useState([]);
    const [isEvent, setIsEvent] = useState(false);

    const handleSlotClick = (selectionInfo) => {
        console.log(selectedSlotInfo);
        setSelectedSlotInfo({ appointment_date: selectionInfo.start, start: selectionInfo.start, end: selectionInfo.end });
        setModalVisible(true);
    };

    const fetchAppointment = (id) => {
        //setIsLoading(true);
        fetch(appUrl + `dashboard/get_appointment/${id}/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setSelectedSlotInfo({
                    id: data.values.id,
                    description: data.values.description,
                    start: `${data.values.appointment_date.slice(0,10)}T${data.values.start_time}`,
                    end: `${data.values.appointment_date.slice(0,10)}T${data.values.end_time}`,
                    customer: data.values.customer,
                    appointment_date: data.values.appointment_date,
                    doctor: data.values.doctor,
                    number_of_patients: data.values.number_of_patients,
                    status: data.values.status
                });
                //setIsLoading(false);
                setModalVisible(true);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
                //setIsLoading(false);
            });
    };

    const handleEventClick = (selectedEvent) => {
        const { event } = selectedEvent;
        setIsEvent(true);
        fetchAppointment(event.id);
    };


    const handleOk = (formData) => {
        /*const newEvent = {
            // Use the description as the title for the event
            title: formData.customerName + ' | ' + formData.description,
            start: formData.appointmentDate.format('YYYY-MM-DD') + 'T' + formData.startTime.format('HH:mm:ss'),
            end: formData.appointmentDate.format('YYYY-MM-DD') + 'T' + formData.endTime.format('HH:mm:ss'),
            // Add other event properties as needed
            // e.g., extendedProps for additional details
        };

        // Add the new event to the calendar's events state
        setEvents([...events, newEvent]);*/
        fetchAppointments();
        setModalVisible(false);
    };

    useEffect(() => {
        // Convert the appointmentList to FullCalendar events
        const calendarEvents = appointmentList.map((appointment) => ({
            title: `${appointment.customer__first_name} ${appointment.customer__last_name}\n${appointment.description}\n${appointment.status}`,
            start: `${appointment.appointment_date.slice(0,10)}T${appointment.start_time}`,
            end: `${appointment.appointment_date.slice(0,10)}T${appointment.end_time}`,
            id: appointment.id, // Optionally include the appointment ID
            // Other properties like resourceId can be included here if necessary
        }));

        // Set these events into the state to be displayed by FullCalendar
        setEvents(calendarEvents);
    }, [appointmentList]);


    const handleCancel = () => {
        setModalVisible(false);
    };

    const resources = [
        { id: 'room1', title: 'Conference Room A' },
        { id: 'room2', title: 'Conference Room B' },
        // Add more rooms as needed
    ];

    const fetchAppointments = () => {
        //setIsLoading(true);
        fetch(appUrl + 'dashboard/get_all_appointments')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setAppointmentList(data.values);
                //setIsLoading(false);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
                //setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <>
            <FullCalendar
                plugins={[interactionPlugin, timeGridPlugin, resourceTimelinePlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridDay,timeGridWeek'
                }}
                events={events}
                selectable={true}
                editable={false}
                select={handleSlotClick}
                eventClick={handleEventClick}
                resources={resources}
            />
            {modalVisible &&
                <Modal
                    title="Create Appointment"
                    width={1000}
                    open={modalVisible}
                    onOk={handleOk} // This needs to be called with form data
                    onCancel={handleCancel}
                    footer={null} // It's a good practice to handle the form submission within the form itself
                >
                    <AppointmentForm onSubmit={handleOk} slotInfo={selectedSlotInfo} isEvent={isEvent} />
                </Modal>
            }
        </>
    );
};

export default Calendar;
