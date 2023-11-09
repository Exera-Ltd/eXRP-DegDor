import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid';
import { Modal } from 'antd';
import AppointmentForm from './AppointmentForm'; // Your previously created form component

const Calendar = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [events, setEvents] = useState([{ title: 'Test', start: '2023-11-07', end: '2023-11-08' }]); // Your events state
    const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);

    const handleSlotClick = (selectionInfo) => {
        setSelectedSlotInfo({ start: selectionInfo.start, end: selectionInfo.end });
        setModalVisible(true);
    };


    const handleOk = (formData) => {
        const newEvent = {
            // Use the description as the title for the event
            title: formData.customerName + ' | ' + formData.description,
            start: formData.appointmentDate.format('YYYY-MM-DD') + 'T' + formData.startTime.format('HH:mm:ss'),
            end: formData.appointmentDate.format('YYYY-MM-DD') + 'T' + formData.endTime.format('HH:mm:ss'),
            // Add other event properties as needed
            // e.g., extendedProps for additional details
        };

        // Add the new event to the calendar's events state
        setEvents([...events, newEvent]);
        setModalVisible(false);
    };


    const handleCancel = () => {
        setModalVisible(false);
    };

    return (
        <>
            <FullCalendar
                plugins={[interactionPlugin, timeGridPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridDay,timeGridWeek'
                }}
                events={events}
                selectable={true}
                editable={true}
                select={handleSlotClick}
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
                    <AppointmentForm onSubmit={handleOk} slotInfo={selectedSlotInfo} />
                </Modal>
            }
        </>
    );
};

export default Calendar;
