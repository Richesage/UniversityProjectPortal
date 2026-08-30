import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Calendar as CalendarIcon, Clock, Play, MapPin } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { toast } from 'sonner';
import { Breadcrumb } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';

export function Meetings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getStudentMeetings, getStudentAssignment, requestMeeting } = useAppData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingVenue, setMeetingVenue] = useState('');

  const meetings = user ? getStudentMeetings(user.id) : [];
  const assignment = user ? getStudentAssignment(user.id) : undefined;

  const handleRequestMeeting = () => {
    if (!user || !meetingTitle.trim() || !meetingTime) {
      toast.error('Please fill in all meeting details');
      return;
    }
    requestMeeting({
      studentId: user.id,
      supervisorId: assignment?.supervisorId ?? 'lec-1',
      title: meetingTitle,
      date: selectedDate?.toISOString().split('T')[0] ?? new Date().toISOString().split('T')[0],
      time: meetingTime,
      venue: meetingVenue || 'Online (Teams)',
      type: meetingVenue ? 'in_person' : 'online',
    });
    toast.success('Meeting request submitted');
    setDialogOpen(false);
    setMeetingTitle('');
    setMeetingTime('');
    setMeetingVenue('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/student/dashboard' }, { label: 'Meeting Schedule' }]} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Meetings</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">
              Request Meeting
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request a Meeting</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
                <input value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm" placeholder="e.g. Chapter Review" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Time</label>
                <input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue (optional)</label>
                <input value={meetingVenue} onChange={(e) => setMeetingVenue(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm" placeholder="Online (Teams) or room number" />
              </div>
              <button onClick={handleRequestMeeting} className="w-full py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">
                Submit Request
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Calendar View</h2>
          <div className="flex justify-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border border-gray-200 p-4"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Meetings</h2>
            <div className="space-y-4">
              {meetings.length > 0 ? meetings.map((m) => (
                <div key={m.id} className="p-4 border border-[#C5C3EC] rounded-md bg-[#EEEDFB]/30">
                  <h3 className="font-medium text-sm text-gray-900 mb-2">{m.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-gray-600 gap-2">
                      <Clock className="w-4 h-4 text-[#312DC4]" /> {m.time}
                    </div>
                    <div className="flex items-center text-xs text-gray-600 gap-2">
                      <CalendarIcon className="w-4 h-4 text-[#312DC4]" /> {m.date}
                    </div>
                    <div className="flex items-center text-xs text-gray-600 gap-2">
                      <MapPin className="w-4 h-4 text-[#312DC4]" /> {m.venue}
                    </div>
                  </div>
                  <button onClick={() => toast.info('Opening meeting link...')} className="w-full py-2 bg-[#312DC4] text-white rounded-md text-xs font-medium hover:bg-[#2724b0] flex items-center justify-center gap-2">
                    <Play className="w-3 h-3 fill-current" /> Join Meeting
                  </button>
                </div>
              )) : (
                <p className="text-sm text-gray-500">No upcoming meetings scheduled.</p>
              )}
            </div>

            <button onClick={() => navigate('/student/dashboard')} className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
