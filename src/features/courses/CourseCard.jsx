import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Clock, Star, Users, ArrowRight, Sparkles } from 'lucide-react';

export function CourseCard({ course, isEnrolled = false, progressPercent = 0 }) {
  const levelVariants = {
    Beginner: 'emerald',
    Intermediate: 'violet',
    Advanced: 'rose',
  };

  return (
    <Card hover className="flex flex-col h-full overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516116211227-bbc13c726cb7?w=800'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={levelVariants[course.level] || 'violet'} size="sm">
            {course.level}
          </Badge>
          <Badge variant="navy" size="sm" className="uppercase text-[10px]">
            {course.category}
          </Badge>
        </div>
        {course.featured && (
          <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{course.duration_hours || 10} hours</span>
            </span>
            <span className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{course.rating || '4.9'}</span>
              <span className="text-slate-400 font-normal">({course.enrolled_count || 120})</span>
            </span>
          </div>

          <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {course.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Progress bar if enrolled */}
        {isEnrolled && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-brand-700">Course Progress</span>
              <span className="font-bold text-slate-800">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Instructor & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
              {course.instructor_name ? course.instructor_name[0] : 'S'}
            </div>
            <span className="text-xs text-slate-500 font-medium truncate max-w-[110px]">
              {course.instructor_name || 'Dr. Sarah Jenkins'}
            </span>
          </div>

          <Link
            to={`/courses/${course.slug || course.id}`}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            <span>{isEnrolled ? 'Continue' : 'View Course'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
