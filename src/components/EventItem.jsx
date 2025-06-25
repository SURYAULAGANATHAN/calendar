import React from 'react'

const EventItem = ({ event, onEventClick }) => {
  return (
    <div
      className={`${event.color} text-white text-xs p-2 mb-1 rounded-md truncate cursor-pointer 
        hover:shadow-md transition-all duration-200 flex items-start`}
      onClick={() => onEventClick(event)}
    >
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{event.title}</div>
        <div className="text-xs opacity-90 truncate">
          {event.startTime} - {event.endTime}
        </div>
      </div>
      <div className="ml-2 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}

export default EventItem