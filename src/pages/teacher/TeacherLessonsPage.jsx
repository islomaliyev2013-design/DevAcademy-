import React, { useState, useEffect } from 'react';
import { dataService } from '../../services/dataService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { Plus, BookOpen, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

export function TeacherLessonsPage() {
  const { addToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New lesson form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [codeExample, setCodeExample] = useState('');
  const [starterCode, setStarterCode] = useState('');
  const [xpReward, setXpReward] = useState(25);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const cs = await dataService.getCourses();
        setCourses(cs);
        if (cs.length > 0) {
          setSelectedCourseId(cs[0].id);
          const ls = await dataService.getLessonsByCourseId(cs[0].id);
          setLessons(ls);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSelectCourse = async (id) => {
    setSelectedCourseId(id);
    const ls = await dataService.getLessonsByCourseId(id);
    setLessons(ls);
  };

  const handleCreateLesson = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newLesson = {
      id: 'lesson-' + Date.now(),
      course_id: selectedCourseId,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      order_index: lessons.length + 1,
      content_markdown: content,
      code_example: codeExample,
      starter_code: starterCode,
      xp_reward: parseInt(xpReward, 10),
    };

    setLessons((prev) => [...prev, newLesson]);
    addToast(`Lesson "${title}" added to course!`, 'success');
    setTitle('');
    setContent('');
    setCodeExample('');
    setStarterCode('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lesson Content & Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Write structured interactive lessons, set code examples, and define XP rewards.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)} icon={Plus}>
          Add Lesson
        </Button>
      </div>

      {/* Course Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 pr-2">
          Select Course:
        </span>
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => handleSelectCourse(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              selectedCourseId === c.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        {lessons.length === 0 ? (
          <Card className="p-8 text-center text-slate-500">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs">No lessons added to this course yet.</p>
          </Card>
        ) : (
          lessons.map((lesson, idx) => (
            <Card key={lesson.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{lesson.title}</h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1 text-brand-600 font-semibold">
                      <Sparkles className="w-3 h-3" />
                      <span>+{lesson.xp_reward || 20} XP</span>
                    </span>
                    <span>•</span>
                    <span>Slug: {lesson.slug}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Edit Content
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Lesson Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Lesson to Curriculum"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateLesson} className="space-y-4">
          <Input
            label="Lesson Title"
            placeholder="e.g. Asynchronous Control Flow with Async/Await"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
              Lesson Content (Markdown format supported)
            </label>
            <textarea
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Explain the concepts, architectural decisions, and mechanics..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-sans focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
              Code Architecture Example
            </label>
            <textarea
              rows="3"
              value={codeExample}
              onChange={(e) => setCodeExample(e.target.value)}
              placeholder="// Clean code example..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono bg-slate-950 text-emerald-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                XP Reward
              </label>
              <input
                type="number"
                min="10"
                max="100"
                value={xpReward}
                onChange={(e) => setXpReward(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save & Publish Lesson
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
