import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid';
import { Modal } from 'antd';
import AppointmentForm from './AppointmentForm'; // Your previously created form component
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { useUser } from '../../contexts/UserContext';
import { appUrl } from '../../constants';

const Calendar = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [events, setEvents] = useState([{ title: 'Test', start: '2023-11-07', end: '2023-11-08' }]); // Your events state
    const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);
    const [appointmentList, setAppointmentList] = useState([]);
    const [isEvent, setIsEvent] = useState(false);
    const { user } = useUser();

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
                setModalVisible(true);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
            });
    };

    const handleEventClick = (selectedEvent) => {
        const { event } = selectedEvent;
        setIsEvent(true);
        fetchAppointment(event.id);
    };


    const handleOk = (formData) => {
        fetchAppointments();
        setModalVisible(false);
    };

    useEffect(() => {
        const calendarEvents = appointmentList.map((appointment) => ({
            title: `[${appointment.doctor__first_name} ${appointment.doctor__last_name}] | ${appointment.customer__first_name} ${appointment.customer__last_name}\n${appointment.description}\n${appointment.status}`,
            start: `${appointment.appointment_date.slice(0,10)}T${appointment.start_time}`,
            end: `${appointment.appointment_date.slice(0,10)}T${appointment.end_time}`,
            id: appointment.id,
        }));

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

    /* const fetchAppointments = () => {
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
    }; */

    const fetchAppointments = () => {
        const seeAllAppointments = (user.profile.role === "Administrator" || user.profile.role === "Staff");
    
        // Set the URL based on the user's role
        const url = seeAllAppointments ? appUrl + 'dashboard/get_all_appointments' : appUrl + `dashboard/get_appointment_by_doctor/${user.id}`;
    
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.values);
                setAppointmentList(data.values);
            })
            .catch(error => {
                console.error('Failed to fetch:', error);
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
