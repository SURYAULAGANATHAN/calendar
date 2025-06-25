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
    // Load events from JSON file (in a real app, this would be an API call)
    const loadEvents = async () => {
      try {
        const response = await fetch('/data/events.json');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };
    loadEvents();
  }, []);

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
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const addOrUpdateEvent = (event) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(events.map(e => e.id === event.id ? event : e));
    } else {
      // Add new event
      setEvents([...events, event]);
    }
  };

  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
    setShowEventForm(false);
  };

  const getEventsForDate = (day) => {
    const dateStr = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const current = new Date(currentYear, currentMonth, day);
      
      return current >= eventStart && current <= eventEnd;
    });
  };

  const checkForEventConflicts = (events) => {
    // This is a simplified conflict check
    // In a real app, you'd want to compare times as well
    return events.length > 3; // If more than 3 events on the same day, consider it a conflict
  };

  const renderDays = () => {
    const days = [];
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className="h-32 p-2 border border-gray-200 bg-gray-50"
        ></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateEvents = getEventsForDate(day);
      const hasConflict = checkForEventConflicts(dateEvents);
      const isToday = isCurrentMonth && day === today.getDate();

      days.push(
        <div
          key={`day-${day}`}
          className={`h-32 p-2 border border-gray-200 transition-all duration-200 
            ${isToday ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'} 
            cursor-pointer relative`}
          onClick={() => handleDateClick(day)}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm ${
              isToday 
                ? 'font-bold bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' 
                : 'text-gray-700'
            }`}>
              {day}
            </span>
            {hasConflict && (
              <span className="text-xs px-1 py-0.5 bg-red-100 text-red-800 rounded">
                Conflict
              </span>
            )}
          </div>
          <div className="overflow-y-auto max-h-24 scrollbar-thin">
            {dateEvents.map(event => (
              <EventItem
                key={event.id}
                event={event}
                onEventClick={handleEventClick}
              />
            ))}
            {dateEvents.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-xs text-blue-600">Add event</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold">Calendar</h1>
            <button
              onClick={() => {
                setSelectedEvent(null);
                setShowEventForm(true);
              }}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 
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
          <div className="grid grid-cols-7 gap-0">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <div 
                key={day} 
                className="text-center font-semibold p-3 bg-gray-100 text-gray-700 uppercase text-sm"
              >
                {day.substring(0, 3)}
              </div>
            ))}
            {renderDays()}
          </div>
        </div>
      </div>

      {showEventForm && (
        <EventForm
          onAddEvent={addOrUpdateEvent}
          onClose={() => {
            setShowEventForm(false);
            setSelectedEvent(null);
          }}
          eventToEdit={selectedEvent}
        />
      )}
    </div>
  );
};

export default Calendar;