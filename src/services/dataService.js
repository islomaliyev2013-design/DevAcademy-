import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  MOCK_COURSES,
  MOCK_LESSONS,
  MOCK_ASSIGNMENTS,
  MOCK_SUBMISSIONS,
  MOCK_QUIZZES,
  MOCK_ENROLLMENTS,
  MOCK_LESSON_PROGRESS,
  MOCK_ACHIEVEMENTS,
  MOCK_STUDENT_ACHIEVEMENTS,
  MOCK_USERS,
} from '../lib/mockData';

// Helper for local mock persistence
function getStored(key, defaultVal) {
  try {
    const item = localStorage.getItem(`devacademy_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(`devacademy_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

export const dataService = {
  // COURSES
  async getCourses() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('courses').select('*, profiles:instructor_id(full_name)');
      if (error) throw error;
      return data;
    }
    return getStored('courses', MOCK_COURSES);
  },

  async getCourseByIdOrSlug(idOrSlug) {
    if (isSupabaseConfigured) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      const query = supabase.from('courses').select('*, profiles:instructor_id(full_name)');
      const { data, error } = isUUID
        ? await query.eq('id', idOrSlug).single()
        : await query.eq('slug', idOrSlug).single();
      if (error) throw error;
      return data;
    }
    const courses = getStored('courses', MOCK_COURSES);
    return courses.find((c) => c.id === idOrSlug || c.slug === idOrSlug) || null;
  },

  async createCourse(courseData, instructorId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('courses')
        .insert([{ ...courseData, instructor_id: instructorId }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const courses = getStored('courses', MOCK_COURSES);
    const newCourse = {
      id: 'course-' + Date.now(),
      slug: courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      instructor_id: instructorId,
      instructor_name: 'Dr. Sarah Jenkins',
      enrolled_count: 0,
      rating: 5.0,
      is_published: true,
      featured: false,
      learning_objectives: courseData.learning_objectives || [
        'Understand modern architecture principles',
        'Write production ready code',
      ],
      prerequisites: courseData.prerequisites || ['Basic JavaScript'],
      ...courseData,
    };
    courses.unshift(newCourse);
    setStored('courses', courses);
    return newCourse;
  },

  // ENROLLMENTS
  async getEnrollments(studentId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('enrollments')
        .select('*, courses(*)')
        .eq('student_id', studentId);
      if (error) throw error;
      return data;
    }
    const enrollments = getStored('enrollments', MOCK_ENROLLMENTS);
    const courses = getStored('courses', MOCK_COURSES);
    return enrollments
      .filter((e) => e.student_id === studentId)
      .map((e) => ({
        ...e,
        courses: courses.find((c) => c.id === e.course_id) || null,
      }));
  },

  async enrollInCourse(studentId, courseId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('enrollments')
        .insert([{ student_id: studentId, course_id: courseId, progress_percent: 0 }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const enrollments = getStored('enrollments', MOCK_ENROLLMENTS);
    const exists = enrollments.find((e) => e.student_id === studentId && e.course_id === courseId);
    if (exists) return exists;

    const newEnr = {
      id: 'enr-' + Date.now(),
      student_id: studentId,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      progress_percent: 0,
      completed_at: null,
    };
    enrollments.push(newEnr);
    setStored('enrollments', enrollments);
    return newEnr;
  },

  // LESSONS
  async getLessonsByCourseId(courseId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data;
    }
    const lessons = getStored('lessons', MOCK_LESSONS);
    return lessons
      .filter((l) => l.course_id === courseId)
      .sort((a, b) => a.order_index - b.order_index);
  },

  async getLessonById(lessonId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('lessons').select('*').eq('id', lessonId).single();
      if (error) throw error;
      return data;
    }
    const lessons = getStored('lessons', MOCK_LESSONS);
    return lessons.find((l) => l.id === lessonId) || null;
  },

  // LESSON PROGRESS
  async getLessonProgress(studentId, courseId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('student_id', studentId)
        .eq('course_id', courseId);
      if (error) throw error;
      return data;
    }
    const progress = getStored('lesson_progress', MOCK_LESSON_PROGRESS);
    return progress.filter((p) => p.student_id === studentId && p.course_id === courseId);
  },

  async markLessonComplete(studentId, lessonId, courseId, xpReward = 25) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('lesson_progress').upsert({
        student_id: studentId,
        lesson_id: lessonId,
        course_id: courseId,
        completed: true,
        completed_at: new Date().toISOString(),
      });
      if (error) throw error;
      return data;
    }
    const progress = getStored('lesson_progress', MOCK_LESSON_PROGRESS);
    const existingIndex = progress.findIndex(
      (p) => p.student_id === studentId && p.lesson_id === lessonId
    );
    if (existingIndex >= 0) {
      progress[existingIndex].completed = true;
      progress[existingIndex].completed_at = new Date().toISOString();
    } else {
      progress.push({
        id: 'prog-' + Date.now(),
        student_id: studentId,
        lesson_id: lessonId,
        course_id: courseId,
        completed: true,
        completed_at: new Date().toISOString(),
      });
    }
    setStored('lesson_progress', progress);

    // Update enrollment percentage
    const allCourseLessons = (getStored('lessons', MOCK_LESSONS)).filter((l) => l.course_id === courseId);
    const completedCount = progress.filter((p) => p.student_id === studentId && p.course_id === courseId && p.completed).length;
    const percent = Math.min(100, Math.round((completedCount / (allCourseLessons.length || 1)) * 100));

    const enrollments = getStored('enrollments', MOCK_ENROLLMENTS);
    const enr = enrollments.find((e) => e.student_id === studentId && e.course_id === courseId);
    if (enr) {
      enr.progress_percent = percent;
      if (percent === 100) enr.completed_at = new Date().toISOString();
      setStored('enrollments', enrollments);
    }

    return { completed: true, percent };
  },

  // ASSIGNMENTS & SUBMISSIONS
  async getAssignments(courseId = null) {
    if (isSupabaseConfigured) {
      let query = supabase.from('assignments').select('*, courses(title)');
      if (courseId) query = query.eq('course_id', courseId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
    const assignments = getStored('assignments', MOCK_ASSIGNMENTS);
    const courses = getStored('courses', MOCK_COURSES);
    return assignments
      .filter((a) => (courseId ? a.course_id === courseId : true))
      .map((a) => ({
        ...a,
        courses: courses.find((c) => c.id === a.course_id) || { title: 'General Course' },
      }));
  },

  async createAssignment(assignmentData, teacherId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('assignments')
        .insert([{ ...assignmentData, created_by: teacherId }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const assignments = getStored('assignments', MOCK_ASSIGNMENTS);
    const newAssign = {
      id: 'assign-' + Date.now(),
      created_by: teacherId,
      ...assignmentData,
    };
    assignments.unshift(newAssign);
    setStored('assignments', assignments);
    return newAssign;
  },

  async getSubmissions(assignmentId = null) {
    if (isSupabaseConfigured) {
      let query = supabase.from('submissions').select('*, assignments(title), profiles:student_id(full_name)');
      if (assignmentId) query = query.eq('assignment_id', assignmentId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
    const submissions = getStored('submissions', MOCK_SUBMISSIONS);
    const assignments = getStored('assignments', MOCK_ASSIGNMENTS);
    return submissions
      .filter((s) => (assignmentId ? s.assignment_id === assignmentId : true))
      .map((s) => ({
        ...s,
        assignments: assignments.find((a) => a.id === s.assignment_id) || { title: 'Coding Task' },
      }));
  },

  async submitAssignment(assignmentId, studentId, studentName, codeContent) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('submissions')
        .upsert({
          assignment_id: assignmentId,
          student_id: studentId,
          code_content: codeContent,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const submissions = getStored('submissions', MOCK_SUBMISSIONS);
    const existingIndex = submissions.findIndex(
      (s) => s.assignment_id === assignmentId && s.student_id === studentId
    );
    const subData = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : 'sub-' + Date.now(),
      assignment_id: assignmentId,
      student_id: studentId,
      student_name: studentName,
      code_content: codeContent,
      status: 'submitted',
      score: null,
      feedback: null,
      submitted_at: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      submissions[existingIndex] = subData;
    } else {
      submissions.push(subData);
    }
    setStored('submissions', submissions);
    return subData;
  },

  async gradeSubmission(submissionId, score, feedback, teacherId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('submissions')
        .update({
          score,
          feedback,
          status: 'graded',
          graded_by: teacherId,
          graded_at: new Date().toISOString(),
        })
        .eq('id', submissionId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const submissions = getStored('submissions', MOCK_SUBMISSIONS);
    const sub = submissions.find((s) => s.id === submissionId);
    if (sub) {
      sub.score = score;
      sub.feedback = feedback;
      sub.status = 'graded';
      sub.graded_by = teacherId;
      sub.graded_at = new Date().toISOString();
      setStored('submissions', submissions);
    }
    return sub;
  },

  // QUIZZES
  async getQuizzes(courseId = null) {
    if (isSupabaseConfigured) {
      let query = supabase.from('quizzes').select('*, quiz_questions(*)');
      if (courseId) query = query.eq('course_id', courseId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
    const quizzes = getStored('quizzes', MOCK_QUIZZES);
    return quizzes.filter((q) => (courseId ? q.course_id === courseId : true));
  },

  async getQuizById(quizId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*, quiz_questions(*)')
        .eq('id', quizId)
        .single();
      if (error) throw error;
      return data;
    }
    const quizzes = getStored('quizzes', MOCK_QUIZZES);
    return quizzes.find((q) => q.id === quizId) || null;
  },

  async submitQuizAttempt(quizId, studentId, answers, scorePercent, passed, xpReward) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .insert([{ quiz_id: quizId, student_id: studentId, score_percent: scorePercent, passed, answers }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    const attempts = getStored('quiz_attempts', []);
    const attempt = {
      id: 'att-' + Date.now(),
      quiz_id: quizId,
      student_id: studentId,
      score_percent: scorePercent,
      passed,
      answers,
      created_at: new Date().toISOString(),
    };
    attempts.unshift(attempt);
    setStored('quiz_attempts', attempts);
    return attempt;
  },

  // ACHIEVEMENTS
  async getAchievements() {
    return getStored('achievements', MOCK_ACHIEVEMENTS);
  },

  async getStudentAchievements(studentId) {
    const list = getStored('student_achievements', MOCK_STUDENT_ACHIEVEMENTS);
    return list.filter((a) => a.student_id === studentId);
  },

  // ADMIN ANALYTICS & USERS
  async getAdminStats() {
    const users = getStored('users', MOCK_USERS);
    const courses = getStored('courses', MOCK_COURSES);
    const enrollments = getStored('enrollments', MOCK_ENROLLMENTS);
    const submissions = getStored('submissions', MOCK_SUBMISSIONS);

    const studentsCount = users.filter((u) => u.role === 'student').length;
    const teachersCount = users.filter((u) => u.role === 'teacher').length;

    return {
      totalUsers: users.length + 120, // include scaled demo metrics
      studentsCount: studentsCount + 105,
      teachersCount: teachersCount + 15,
      totalCourses: courses.length,
      publishedCourses: courses.filter((c) => c.is_published).length,
      totalEnrollments: enrollments.length + 840,
      totalSubmissions: submissions.length + 320,
    };
  },

  async getAllUsers() {
    return getStored('users', MOCK_USERS);
  },

  async updateUserRole(userId, newRole) {
    const users = getStored('users', MOCK_USERS);
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.role = newRole;
      setStored('users', users);
    }
    return user;
  },
};
