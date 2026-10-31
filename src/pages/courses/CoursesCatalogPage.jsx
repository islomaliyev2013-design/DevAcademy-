import React, { useState, useEffect } from 'react';
import { CourseCard } from '../../features/courses/CourseCard';
import { CourseCardSkeleton } from '../../components/ui/Skeleton';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../features/auth/AuthContext';
import { useLanguage } from '../../lib/i18n/LanguageContext';
import { Search, Filter, BookOpen } from 'lucide-react';

export function CoursesCatalogPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [allCourses, allEnr] = await Promise.all([
          dataService.getCourses(),
          user ? dataService.getEnrollments(user.id) : Promise.resolve([]),
        ]);
        setCourses(allCourses);
        setEnrollments(allEnr);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const levels = [
    { value: 'All', label: t('courses.allLevels', 'All Levels') },
    { value: 'Beginner', label: t('courses.beginner', 'Beginner') },
    { value: 'Intermediate', label: t('courses.intermediate', 'Intermediate') },
    { value: 'Advanced', label: t('courses.advanced', 'Advanced') },
  ];
  const categories = ['All', 'Web Development', 'React & Frontend', 'CSS & Design', 'Computer Science'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title banner */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('courses.catalogTitle', 'Explore Programming Courses')}
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          {t('courses.catalogSubtitle', 'Learn real-world software engineering with interactive curriculum, live coding sandboxes, and personalized AI mentor feedback.')}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('courses.searchPlaceholder', 'Search by course title, keywords, or technology...')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition"
          />
        </div>

        {/* Level & Category Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold hidden sm:inline">Filters:</span>
          </div>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-500"
          >
            {levels.map((lvl) => (
              <option key={lvl.value} value={lvl.value}>
                {lvl.label}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CourseCardSkeleton />
          <CourseCardSkeleton />
          <CourseCardSkeleton />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">
            {t('courses.noCoursesFound', 'No courses match your criteria')}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t('courses.clearFilters', 'Try resetting your search query or adjusting your level filters.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const enr = enrollments.find((e) => e.course_id === course.id);
            return (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={Boolean(enr)}
                progressPercent={enr?.progress_percent || 0}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
