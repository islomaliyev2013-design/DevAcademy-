import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Users, BookOpen, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

export function TeacherStudentsPage() {
  const students = [
    {
      id: 's1',
      name: 'Alex Rivera',
      email: 'alex.student@devacademy.pro',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      enrolledTrack: 'Modern React & Component Architecture',
      progress: 66,
      xp: 480,
      streak: 5,
      lastActive: 'Today',
    },
    {
      id: 's2',
      name: 'Marcus Chen',
      email: 'marcus.chen@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      enrolledTrack: 'Full-Stack JavaScript: Zero to Hero',
      progress: 40,
      xp: 410,
      streak: 4,
      lastActive: 'Yesterday',
    },
    {
      id: 's3',
      name: 'Sophia Patel',
      email: 'sophia.patel@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      enrolledTrack: 'Modern React & Component Architecture',
      progress: 85,
      xp: 350,
      streak: 3,
      lastActive: '2 days ago',
    },
    {
      id: 's4',
      name: 'David Kim',
      email: 'david.kim@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      enrolledTrack: 'Interactive Web UI with Tailwind',
      progress: 100,
      xp: 620,
      streak: 12,
      lastActive: 'Today',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Enrolled Students Roster
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your students' course progress, learning streaks, and XP points.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Enrolled Track</th>
                <th className="px-6 py-3.5">Course Progress</th>
                <th className="px-6 py-3.5">XP Earned</th>
                <th className="px-6 py-3.5">Study Streak</th>
                <th className="px-6 py-3.5 text-right">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover border border-brand-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{student.name}</p>
                        <p className="text-[11px] text-slate-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {student.enrolledTrack}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-36 space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span>{student.progress}%</span>
                        {student.progress === 100 && (
                          <span className="text-emerald-600 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            student.progress === 100 ? 'bg-emerald-500' : 'bg-brand-600'
                          }`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-brand-600">
                    {student.xp} XP
                  </td>
                  <td className="px-6 py-4 text-amber-600 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{student.streak}d</span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">
                    {student.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
