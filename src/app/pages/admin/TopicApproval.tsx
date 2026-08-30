import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Breadcrumb } from '../../components/Layout';
import { useAppData } from '../../context/AppDataContext';

export function TopicApproval() {
  const navigate = useNavigate();
  const { proposals, approveProposal, rejectProposal, requestModification } = useAppData();
  const [comments, setComments] = useState('');

  const pending = proposals.find((p) => p.status === 'pending') ?? proposals[0];

  if (!pending) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Breadcrumb items={[{ label: 'Home', href: '/admin/dashboard' }, { label: 'Topic Approval' }]} />
        <p className="text-gray-500">No proposals awaiting approval.</p>
      </div>
    );
  }

  const handleApprove = () => {
    approveProposal(pending.id, comments);
    toast.success('Proposal approved');
    navigate('/admin/dashboard');
  };

  const handleReject = () => {
    rejectProposal(pending.id, comments);
    toast.success('Proposal rejected');
    navigate('/admin/dashboard');
  };

  const handleModification = () => {
    if (!comments.trim()) { toast.error('Please enter modification comments'); return; }
    requestModification(pending.id, comments);
    toast.success('Modification requested');
    navigate('/admin/dashboard');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: 'Home', href: '/admin/dashboard' }, { label: 'Topic Approval' }]} />
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Review Student Proposal</h1>

      <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-500 mb-1">Student Information</p>
            <p className="font-medium text-gray-900">{pending.studentName}</p>
            <p className="text-sm text-gray-600">Computer Science Dept.</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Duplicate Topic Detection Status</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-[#EEEDFB] text-[#312DC4] border border-[#C5C3EC] text-xs rounded-full capitalize">{pending.duplicateRisk} Risk</span>
              <span className="text-xs text-gray-500">{pending.similarityPercent}% similarity</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Project Topic</p>
          <h2 className="text-lg font-medium text-gray-900">{pending.title}</h2>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Topic Description</p>
          <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded border border-gray-200">{pending.description}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recommendation / Comments</label>
          <textarea rows={3} value={comments} onChange={(e) => setComments(e.target.value)} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#312DC4] focus:border-[#312DC4]" placeholder="Enter comments for the student..." />
        </div>

        <div className="pt-4 flex gap-3 flex-wrap">
          <button onClick={handleApprove} className="px-4 py-2 bg-[#312DC4] text-white rounded-md text-sm font-medium hover:bg-[#2724b0] flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Approve
          </button>
          <button onClick={handleModification} className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-50">
            Request Modification
          </button>
          <button onClick={handleReject} className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}
