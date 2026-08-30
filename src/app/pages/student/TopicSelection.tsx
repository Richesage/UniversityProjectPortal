import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumb } from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { DEPARTMENTS, RESEARCH_AREAS } from '../../data/seed';

export function TopicSelection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { topics, selectTopic, submitProposal } = useAppData();

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [researchArea, setResearchArea] = useState('All Research Areas');
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDesc, setProposalDesc] = useState('');
  const [proposalFile, setProposalFile] = useState('');

  const filtered = topics.filter((t) => {
    if (t.status !== 'approved') return false;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === 'All Departments' || t.department === department;
    const matchArea = researchArea === 'All Research Areas' || t.researchArea === researchArea;
    return matchSearch && matchDept && matchArea;
  });

  const handleSelect = (topicId: string) => {
    if (!user) return;
    selectTopic(user.id, topicId);
    toast.success('Topic selected successfully');
    navigate('/student/dashboard');
  };

  const handleSubmitProposal = () => {
    if (!user || !proposalTitle.trim()) {
      toast.error('Please enter a topic title');
      return;
    }
    submitProposal({
      studentId: user.id,
      studentName: user.name,
      title: proposalTitle,
      description: proposalDesc,
    });
    toast.success('Proposal submitted successfully');
    setProposalTitle('');
    setProposalDesc('');
    setProposalFile('');
    navigate('/student/dashboard');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/student/dashboard' }, { label: 'Project Topics' }]} />
      <h1 className="text-2xl font-bold text-gray-800">Project Topic Selection</h1>

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#312DC4] focus:ring-1 focus:ring-[#312DC4]"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500" />
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
            <option>All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={researchArea} onChange={(e) => setResearchArea(e.target.value)} className="border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none">
            <option>All Research Areas</option>
            {RESEARCH_AREAS.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[640px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-700">Title & Description</th>
              <th className="px-4 py-3 font-medium text-gray-700">Lecturer</th>
              <th className="px-4 py-3 font-medium text-gray-700">Research Area</th>
              <th className="px-4 py-3 font-medium text-gray-700">Slots</th>
              <th className="px-4 py-3 font-medium text-gray-700 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                </td>
                <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{item.lecturerName}</td>
                <td className="px-4 py-4">
                  <span className="inline-block px-2 py-1 text-xs bg-[#EEEDFB] text-[#312DC4] rounded-full border border-[#C5C3EC] whitespace-nowrap">{item.researchArea}</span>
                </td>
                <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{item.maxStudents - item.enrolled} / {item.maxStudents}</td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => handleSelect(item.id)}
                    disabled={item.enrolled >= item.maxStudents}
                    className="px-3 py-1.5 bg-[#312DC4] text-white rounded-md text-sm hover:bg-[#2724b0] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No topics match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Propose Your Own Topic</h2>
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title</label>
            <input type="text" value={proposalTitle} onChange={(e) => setProposalTitle(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]" placeholder="Enter your proposed topic" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={4} value={proposalDesc} onChange={(e) => setProposalDesc(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]" placeholder="Explain your proposal..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Proposal (PDF)</label>
            <label className="border-2 border-dashed border-[#C5C3EC] rounded-md p-6 flex flex-col items-center justify-center bg-[#EEEDFB]/30 cursor-pointer hover:bg-[#EEEDFB]/50">
              <Upload className="w-6 h-6 text-[#312DC4] mb-2" />
              <p className="text-sm text-gray-500">{proposalFile || 'Click to browse or drag and drop'}</p>
              <input type="file" accept=".pdf" className="hidden" onChange={(e) => setProposalFile(e.target.files?.[0]?.name ?? '')} />
            </label>
          </div>
          <div className="flex gap-3 pt-2 flex-wrap">
            <button onClick={handleSubmitProposal} className="px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0]">Submit Proposal</button>
            <button onClick={() => { setProposalTitle(''); setProposalDesc(''); setProposalFile(''); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
