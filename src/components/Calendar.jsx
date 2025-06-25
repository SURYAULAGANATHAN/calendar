import React, { useState, useEffect } from 'react';
import MonthSelector from './MonthSelector';
import EventItem from './EventItem';
import EventForm from './EventForm';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const initialEvents = [
      {
        id: 1,
        title: "Campus Interview",
        description: "Placement drive interviews",
        startDate: "2025-06-25",
        endDate: "2025-06-25",
        startTime: "10:00",
        endTime: "11:50",
        color: "bg-blue-500"
      }
    ];
    setEvents(initialEvents);
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(clickedDate);
    setSelectedEvent({
      title: '',
      description: '',
      startDate: formatDate(clickedDate),
      endDate: formatDate(clickedDate),
      startTime: '09:00',
      endTime: '10:00',
      color: 'bg-blue-500'
    });
    setShowEventForm(true);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const addOrUpdateEvent = (event) => {
    if (event.id) {
      setEvents(events.map(e => e.id === event.id ? event : e));
    } else {
      setEvents([...events, { ...event, id: Date.now() }]);
    }
    setShowEventForm(false);
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    setShowEventForm(false);
  };

  const getEventsForDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dateStr = formatDate(date);

    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      return date >= eventStart && date <= eventEnd;
    });
  };

  const renderDays = () => {
    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 p-1 border border-gray-200"
        ></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateEvents = getEventsForDate(day);
      const isToday = isCurrentMonth && day === today.getDate();

      days.push(
        <div
          key={`day-${day}`}
          className={`h-24 p-1 border border-gray-200 relative group ${isToday ? 'bg-blue-50' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="text-right text-sm mb-1">
            <span className={`inline-block rounded-full w-6 h-6 flex items-center justify-center ${isToday ? 'bg-blue-600 text-white' : ''}`}>
              {day}
            </span>
          </div>
          <div className="overflow-hidden">
            {dateEvents.map(event => (
              <EventItem
                key={event.id}
                event={event}
                onEventClick={(e) => handleEventClick(event, e)}
              />
            ))}
          </div>
          
          {dateEvents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-70 pointer-events-none">
              <button 
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDateClick(day);
                }}
              >
                + Add Event
              </button>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
      <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Calender</h1>
          <button
            onClick={() => {
              setSelectedEvent(null);
              setSelectedDate(new Date());
              setShowEventForm(true);
            }}
            className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 
              transition-all duration-200 font-medium shadow-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Event
          </button>
        </div>

        <MonthSelector
          currentMonth={currentMonth}
          currentYear={currentYear}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
        />
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-0 text-center">
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div
              key={day}
              className="font-semibold p-2 text-gray-700 text-sm"
            >
              {day}
            </div>
          ))}
          {renderDays()}
        </div>
      </div>

      {showEventForm && (
        <EventForm
          onAddEvent={addOrUpdateEvent}
          onClose={() => {
            setShowEventForm(false);
            setSelectedEvent(null);
          }}
          onDelete={deleteEvent}
          eventToEdit={selectedEvent}
          defaultDate={selectedDate}
        />
      )}
    </div>
  );
};

export default Calendar;