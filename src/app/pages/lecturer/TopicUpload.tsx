import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Breadcrumb } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { DEPARTMENTS, RESEARCH_AREAS } from '../../data/seed';

export function TopicUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { uploadTopic, saveTopicDraft } = useAppData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [researchArea, setResearchArea] = useState(RESEARCH_AREAS[0]);
  const [maxStudents, setMaxStudents] = useState(5);

  const buildTopic = () => ({
    title,
    description,
    department,
    researchArea,
    maxStudents,
    lecturerId: user?.id ?? 'lec-1',
    lecturerName: user?.name ?? 'Dr. Lecturer',
    status: 'approved' as const,
  });

  const handleUpload = () => {
    if (!title.trim()) { toast.error('Please enter a topic title'); return; }
    uploadTopic(buildTopic());
    toast.success('Topic uploaded successfully');
    navigate('/lecturer/dashboard');
  };

  const handleSaveDraft = () => {
    if (!title.trim()) { toast.error('Please enter a topic title'); return; }
    saveTopicDraft({ ...buildTopic(), status: 'draft' });
    toast.success('Draft saved');
    navigate('/lecturer/dashboard');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/lecturer/dashboard' }, { label: 'Upload Topic' }]} />
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Upload Project Topic</h1>

      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]" placeholder="Enter topic title" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]" placeholder="Enter detailed description" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Research Area</label>
            <select value={researchArea} onChange={(e) => setResearchArea(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
              {RESEARCH_AREAS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Number of Students</label>
          <input type="number" value={maxStudents} onChange={(e) => setMaxStudents(Number(e.target.value))} className="w-full md:w-1/3 border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none" min={1} />
        </div>
        <div className="pt-4 flex gap-3 border-t border-gray-200 flex-wrap">
          <button onClick={handleUpload} className="px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">Upload Topic</button>
          <button onClick={handleSaveDraft} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">Save Draft</button>
          <button onClick={() => navigate('/lecturer/dashboard')} className="px-4 py-2 text-gray-600 rounded-md text-sm font-medium hover:underline">Cancel</button>
        </div>
      </div>
    </div>
  );
}
