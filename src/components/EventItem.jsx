import React from 'react'

const EventItem = ({ event, onEventClick }) => {
  return (
    <div
      className="text-xs mb-1 cursor-pointer"
      onClick={() => onEventClick(event)}
    >
      <div className="font-bold truncate">{event.title}</div>
      <div className="text-gray-600 truncate">
        {event.startTime} - {event.endTime}
      </div>
    </div>
  )
}

export default EventItem