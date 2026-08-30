import { useNavigate } from 'react-router';
import { User, LogOut, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth, roleProfilePath } from '../context/AuthContext';
import type { Role } from '../data/seed';

interface ProfileMenuProps {
  role: Role;
  onLogout: () => void;
}

export function ProfileMenu({ role, onLogout }: ProfileMenuProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3 border-l border-gray-200 hover:bg-gray-50 rounded-md py-1 pr-1 transition-colors">
          <div className="w-8 h-8 bg-[#EEEDFB] rounded-full flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-[#312DC4]" />
          </div>
          <div className="hidden sm:block text-left max-w-[120px]">
            <p className="text-sm font-medium text-gray-700 truncate">{user?.name ?? `${role} User`}</p>
            <p className="text-[10px] text-gray-400 capitalize">{role}</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="font-medium text-sm">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(roleProfilePath(role))} className="cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
