import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  momentLocalizer,
  ToolbarProps,
  View,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { IoChevronBackOutline } from "react-icons/io5";
import { MdOutlineNavigateNext } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { fetchEvents, Event as EventType } from "../api"; // Import API function
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { FaEye } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";


const CalenderCustomComponent = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<EventType[]>([]);
  const [view, setView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [eventDetailsPosition, setEventDetailsPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [calenderMeeting, setCalenderMeeting] = useState<any[]>([]);
  const localizer = momentLocalizer(moment);

  useEffect(() => {
    const getEvents = async () => {
      const eventsFromAPI = await fetchEvents();
      setEvents(eventsFromAPI);
    };

    getEvents();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await fetch("http://localhost:5000/meetings");
      const meetings = await response.json();
      setCalenderMeeting(meetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  // Group events by start and end time using useMemo for optimization
  const groupEventsByTime = (events: EventType[]) => {
    const groupedEvents = new Map<string, EventType[]>();

    events.forEach((event) => {
      const timeKey = `${event.start.toString()}-${event.end.toString()}`;
      if (!groupedEvents.has(timeKey)) {
        groupedEvents.set(timeKey, []);
      }
      groupedEvents.get(timeKey)?.push(event);
    });

    return groupedEvents;
  };

  // Memoize grouped events to optimize performance
  const groupedEvents = useMemo(() => groupEventsByTime(events), [events]);

  // Get the first event for each time slot (i.e., an initial event view)
  const initialEvents = Array.from(groupedEvents.values()).map(
    (group) => group[0]
  );

  const handleEventClick = (
    event: EventType,
    eventPosition: { x: number; y: number }
  ) => {
    const timeKey = `${event.start.toString()}-${event.end.toString()}`;
    const allEventsAtSameTime = groupedEvents.get(timeKey);
    setExpandedEvents(allEventsAtSameTime || []);
    setEventDetailsPosition(eventPosition);
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
    setExpandedEvents([]); // Reset expanded events when view changes
  };

  const handleNavigate = (date: Date) => {
    setCurrentDate(date);
    setExpandedEvents([]); // Reset expanded events when navigating to a new date
  };

  const CustomToolbar: React.FC<ToolbarProps<EventType>> = (props) => {
    const { label, onNavigate, view } = props;

    const handleViewChange = (newView: View) => {
      props.onView(newView);
      setExpandedEvents([]); // Reset expanded events when view changes
    };

    const formatWeekLabel = () => {
      const startOfWeek = moment(props.date).startOf("week");
      const endOfWeek = moment(props.date).endOf("week");
      return `${startOfWeek.format("Do MMMM")} to ${endOfWeek.format(
        "Do MMMM YYYY"
      )}`;
    };

    const formattedLabel = view === "week" ? formatWeekLabel() : label;

    return (
      <div className="flex justify-between items-center p-4 rounded-t-lg">
        <div className="flex">
          <button
            className="px-2 py-2 border-2 border-blue-500 rounded-md"
            onClick={() => onNavigate("PREV")}
          >
            <IoChevronBackOutline className="border-blue-500 text-[#8B959F]" />
          </button>
          <button
            className="px-1 py-[4px] border-2 border-blue-500 rounded-md ml-2"
            onClick={() => onNavigate("NEXT")}
          >
            <MdOutlineNavigateNext className="text-2xl border-blue-500 text-[#8B959F]" />
          </button>
        </div>
        <span className="text-lg font-bold">{formattedLabel}</span>
        <div className="flex space-x-12">
          <button
            className={`text-[#646464] font-semibold ${
              view === "day" ? "border-b-4 border-[#3690BC]" : ""
            }`}
            onClick={() => handleViewChange("day")}
          >
            Day
          </button>
          <button
            className={`text-[#646464] font-semibold ${
              view === "week" ? "border-b-4 border-[#3690BC]" : ""
            }`}
            onClick={() => handleViewChange("week")}
          >
            Week
          </button>
          <button
            className={`text-[#646464] font-semibold ${
              view === "month" ? "border-b-4 border-[#3690BC]" : ""
            }`}
            onClick={() => handleViewChange("month")}
          >
            Month
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={initialEvents} // Show only the first event from each group
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        defaultView="month"
        components={{
          event: ({ event, ...props }) => {
            // Get the count of events for the same start time
            const eventCount =
              groupedEvents.get(
                `${event.start.toString()}-${event.end.toString()}`
              )?.length || 0;
            return (
              <div
                onClick={(e) => {
                  const position = { x: e.clientX, y: e.clientY };
                  handleEventClick(event, position);
                }}
                className="flex cursor-pointer z-10 rounded-md h-20 text-black border shadow-[0_4px_6px_0_rgba(0,0,0,0.5)] relative"
              >
                {/* Golden Circle with Count */}
                {eventCount > 1 && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {eventCount}
                  </div>
                )}

                <div className="w-[20px] h-20 bg-[#0063BE] rounded-l-md"></div>

                <div className="ml-2 mt-2 gap-x-2 capitalize text-xs text-[#707070] font-semibold">
                  {event?.job_id?.jobRequest_Title}
                  <p>Interviewer: {event?.user_det?.handled_by?.firstName}</p>
                  <p>
                    Time: {moment(event?.start).format("h:mm")}-{" "}
                    {moment(event?.end).format("h:mm A")}
                  </p>
                </div>
              </div>
            );
          },
          toolbar: CustomToolbar,
        }}
        onView={(newView) => handleViewChange(newView)}
        views={{ month: true, week: true, day: true }}
        view={view}
        formats={{
          dayFormat: "DD MMM dddd",
          dayHeaderFormat: "DD MMMM yyyy",
          weekdayFormat: "dddd",
          timeGutterFormat: "h A",
          eventTimeRangeFormat: ({
            start,
            end,
          }: {
            start: Date;
            end: Date;
          }) => {
            const startFormat = moment(start).format("h A");
            const endFormat = moment(end).format("h A");
            return `${startFormat} - ${endFormat}`;
          },
        }}
        onNavigate={(date) => handleNavigate(date)}
        date={currentDate}
      />

      {expandedEvents.length > 0 && (
        <div
          className="absolute z-10 bg-white cursor-pointer z-10 rounded-md h-16 w-[22%] border shadow-[0_4px_6px_0_rgba(0,0,0,0.5)]"
          style={{
            top: eventDetailsPosition.y + 50,
            left: eventDetailsPosition.x + 50,
          }}
        >
          <div className="flex justify-between items-center">
            <p className="text-xs text-[#122239] font-semibold p-3">Meetings</p>
            <IoIosCloseCircle
              className="text-green-500 text-2xl mr-2"
              onClick={() => setExpandedEvents([])}
            />
          </div>

          {expandedEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 border bg-white shadow-md gap-x-2 text-xs text-[#122239] font-semibold"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div className="flex gap-y-4">
                    <div className="w-[20px] h-16 bg-[#0063BE]"></div>
                    <div className="ml-4 gap-x-2 text-xs text-[#122239] font-semibold">
                      <div className="flex justify-between items-center">
                        <div>{event?.job_id?.jobRequest_Title}</div>
                        <div className="flex justify-between">
                          <RiEdit2Line className="mr-2 text-xl" />
                          <MdOutlineDelete className="mr-2 text-red-700 text-xl" />
                        </div>
                      </div>
                      <div className="flex mt-1 mb-1">
                        <p>{event?.title}</p>
                        <div className="ml-2 border-l-2 border-[#707070] h-4"></div>
                        <p className="ml-2">
                          Interviewer: {event?.user_det?.handled_by?.firstName}
                        </p>
                      </div>
                      <div className="flex mt-1 mb-1">
                        <p>
                          Date: {moment(event?.start).format("DD MMM YYYY")}
                        </p>
                        <div className="ml-2 border-l-2 border-[#707070] h-4"></div>
                        <p className="ml-2">
                          Time: {moment(event?.start).format("h:mm")}-{" "}
                          {moment(event?.end).format("h:mm A")}
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>

                <DialogTitle></DialogTitle>
                <DialogContent className="w-[90%] max-w-lg">
                  <div className="flex border items-center rounded-md">
                    <div className="text-xs text-[#122239] font-semibold space-y-4 p-2 w-[50%]">
                      <p>
                        Interview With:{" "}
                        {
                          calenderMeeting[0]?.user_det?.candidate
                            ?.candidate_firstName
                        }
                      </p>
                      <p>
                        Position: {calenderMeeting[0]?.job_id?.jobRequest_Title}
                      </p>
                      <p>
                        Created by:{" "}
                        {calenderMeeting[0]?.user_det?.handled_by?.firstName}
                      </p>
                      <p>
                        Interview Date:{" "}
                        {moment(calenderMeeting[0]?.start).format(
                          "DD MMM YYYY"
                        )}
                      </p>
                      <p>
                        Interview Time:{" "}
                        {moment(calenderMeeting[0]?.start).format("h:mm")}-{" "}
                        {moment(calenderMeeting[0]?.end).format("h:mm A")}
                      </p>
                      <p>Interview Via: Google Meet</p>
                      <div className="border p-2 rounded-md border-[#006DBF]">
                        <div className="flex justify-between">
                          <p className="text-[#006DBF]">Resume.docx</p>
                          <div className="flex">
                            <FaEye className="text-[#006DBF] text-xl" />
                            <MdOutlineFileDownload className="text-[#006DBF] text-xl" />
                          </div>
                        </div>
                      </div>
                      <div className="border p-2 rounded-md border-[#006DBF]">
                        <div className="flex justify-between">
                          <p className="text-[#006DBF]">Aadharcard</p>
                          <div className="flex">
                            <FaEye className="text-[#006DBF] text-xl" />
                            <MdOutlineFileDownload className="text-[#006DBF] text-xl" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 border-l-2 border-[#707070] h-full w-[5%]"></div>
                    <div className="ml-8 w-[45%]">
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/022/484/506/non_2x/google-meet-gmeet-icon-logo-symbol-free-png.png"
                        className="ml-4"
                        height={100}
                        width={100}
                        alt="gmeet"
                      />
                      <Button className="bg-[#006DBF] text-white mt-4 ml-8">
                        <a
                          href={calenderMeeting[0]?.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          JOIN
                        </a>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalenderCustomComponent;
