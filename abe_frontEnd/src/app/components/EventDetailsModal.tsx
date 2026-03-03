import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle, Search, GraduationCap } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

export interface EventAttendee {
  id: number;
  name: string;
  email: string;
  classStanding: string;
  major: string;
  status: "Attending" | "Checked In" | "Not Attending";
  confirmationCode?: string;
}

export interface EventDetails {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  rsvps: number;
  capacity: number;
  attendees: EventAttendee[];
  eventType: "Member Exclusive" | "Open";
}

interface EventDetailsModalProps {
  event: EventDetails | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailsModal({ event, isOpen, onClose }: EventDetailsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [checkInCode, setCheckInCode] = useState("");
  const [checkInStatus, setCheckInStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  if (!event) return null;

  const filteredAttendees = event.attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckIn = () => {
    if (!checkInCode.trim()) {
      setCheckInStatus({ type: "error", message: "Please enter a confirmation code" });
      return;
    }

    // Find attendee with matching confirmation code
    const attendee = event.attendees.find(a => a.confirmationCode === checkInCode.trim());

    if (attendee) {
      if (attendee.status === "Checked In") {
        setCheckInStatus({ type: "error", message: `${attendee.name} has already checked in` });
      } else if (attendee.status === "Not Attending") {
        setCheckInStatus({ type: "error", message: `${attendee.name} is marked as not attending` });
      } else {
        setCheckInStatus({ type: "success", message: `✓ ${attendee.name} checked in successfully!` });
        setCheckInCode("");
        // In a real app, this would update the backend
      }
    } else {
      setCheckInStatus({ type: "error", message: "Invalid confirmation code" });
    }

    // Clear status after 3 seconds
    setTimeout(() => setCheckInStatus(null), 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {event.title}
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
              event.eventType === "Member Exclusive" 
                ? "bg-[#b7a57a] text-white border-[#b7a57a]" 
                : "bg-gray-100 text-gray-700 border-gray-300"
            )}>
              {event.eventType === "Member Exclusive" ? "🔒 Member Exclusive" : "🌐 Open Event"}
            </span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Manage event details and attendee check-ins.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Event Details */}
          <div className="bg-gradient-to-r from-[#4b2e83] to-[#3b2366] rounded-xl p-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Calendar size={20} />
                <div>
                  <div className="text-xs text-white/70">Date</div>
                  <div className="font-semibold">{event.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} />
                <div>
                  <div className="text-xs text-white/70">Time</div>
                  <div className="font-semibold">{event.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={20} />
                <div>
                  <div className="text-xs text-white/70">Location</div>
                  <div className="font-semibold">{event.location}</div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <Users size={20} />
                <span className="font-semibold">{event.rsvps} / {event.capacity} RSVPs</span>
              </div>
            </div>
          </div>

          {/* Event Description */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Summary</h3>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Check-In Card */}
          {event.eventType === "Member Exclusive" && (
            <div className="bg-white rounded-xl p-6 border-2 border-[#4b2e83]">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-[#4b2e83]" size={20} />
                Quick Check-In
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Confirmation Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={checkInCode}
                      onChange={(e) => setCheckInCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleCheckIn()}
                      placeholder="e.g., HSC-8842"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b2e83] focus:border-transparent font-mono"
                    />
                    <button
                      onClick={handleCheckIn}
                      className="px-6 py-2 bg-[#4b2e83] text-white rounded-lg hover:bg-[#3b2366] transition-colors font-semibold"
                    >
                      Check In
                    </button>
                  </div>
                </div>
                {checkInStatus && (
                  <div className={cn(
                    "flex items-center gap-2 p-3 rounded-lg text-sm font-medium",
                    checkInStatus.type === "success" 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  )}>
                    {checkInStatus.type === "success" ? (
                      <CheckCircle size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    {checkInStatus.message}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Attendees List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Users className="text-[#4b2e83]" size={20} />
                  Attendees ({event.attendees.length})
                </h3>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search attendees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b2e83]/20 focus:border-[#4b2e83]"
                />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Class Standing</th>
                    <th className="px-6 py-3">Major</th>
                    {event.eventType === "Member Exclusive" && (
                      <th className="px-6 py-3">Code</th>
                    )}
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAttendees.map((attendee) => (
                    <tr key={attendee.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{attendee.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600 text-xs">{attendee.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                          <GraduationCap size={12} />
                          {attendee.classStanding}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600 text-xs">{attendee.major}</div>
                      </td>
                      {event.eventType === "Member Exclusive" && (
                        <td className="px-6 py-4">
                          <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600 border border-gray-200">
                            {attendee.confirmationCode}
                          </code>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                          attendee.status === 'Checked In' && "bg-[#4b2e83]/10 text-[#4b2e83] border-[#4b2e83]/20",
                          attendee.status === 'Attending' && "bg-green-50 text-green-700 border-green-100",
                          attendee.status === 'Not Attending' && "bg-gray-100 text-gray-600 border-gray-200"
                        )}>
                          {attendee.status === 'Checked In' && <CheckCircle size={12} />}
                          {attendee.status === 'Attending' && <div className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                          {attendee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAttendees.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <Users className="mx-auto text-gray-300 mb-3" size={48} />
                <p>No attendees found</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
