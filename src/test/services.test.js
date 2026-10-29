import { describe, it, expect, beforeEach } from 'vitest';
import { dataService } from '../services/dataService';

describe('Data Service Business Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should fetch course catalog', async () => {
    const courses = await dataService.getCourses();
    expect(Array.isArray(courses)).toBe(true);
    expect(courses.length).toBeGreaterThan(0);
    expect(courses[0]).toHaveProperty('title');
    expect(courses[0]).toHaveProperty('level');
  });

  it('should enroll a student in a course and calculate initial progress', async () => {
    const studentId = 'test-student-1';
    const courseId = 'course-react-arch';

    const enrollment = await dataService.enrollInCourse(studentId, courseId);
    expect(enrollment.student_id).toBe(studentId);
    expect(enrollment.course_id).toBe(courseId);
    expect(enrollment.progress_percent).toBe(0);

    const userEnrollments = await dataService.getEnrollments(studentId);
    expect(userEnrollments.some((e) => e.course_id === courseId)).toBe(true);
  });

  it('should mark a lesson complete and update course completion percentage', async () => {
    const studentId = 'test-student-2';
    const courseId = 'course-react-arch';
    const lessonId = 'lesson-react-1';

    await dataService.enrollInCourse(studentId, courseId);
    const progressResult = await dataService.markLessonComplete(studentId, lessonId, courseId, 25);

    expect(progressResult.completed).toBe(true);
    expect(progressResult.percent).toBeGreaterThan(0);

    const lessonProgress = await dataService.getLessonProgress(studentId, courseId);
    expect(lessonProgress.some((p) => p.lesson_id === lessonId && p.completed)).toBe(true);
  });

  it('should submit student code and allow teacher grading with score and feedback', async () => {
    const assignmentId = 'assign-1';
    const studentId = 'test-student-3';
    const studentCode = 'const app = () => { console.log("Done"); };';

    // Submit
    const submission = await dataService.submitAssignment(
      assignmentId,
      studentId,
      'Test Student',
      studentCode
    );
    expect(submission.status).toBe('submitted');
    expect(submission.code_content).toBe(studentCode);

    // Grade
    const graded = await dataService.gradeSubmission(
      submission.id,
      98,
      'Exceptional architectural elegance.',
      'teacher-1'
    );
    expect(graded.status).toBe('graded');
    expect(graded.score).toBe(98);
    expect(graded.feedback).toBe('Exceptional architectural elegance.');
  });

  it('should record quiz attempt results correctly', async () => {
    const quizId = 'quiz-react-1';
    const studentId = 'test-student-4';
    const answers = { q1: 0, q2: 1 };

    const attempt = await dataService.submitQuizAttempt(
      quizId,
      studentId,
      answers,
      100,
      true,
      60
    );

    expect(attempt.passed).toBe(true);
    expect(attempt.score_percent).toBe(100);
  });
});
