const CompletedLessons = require('../models/CompletedLesson');
const CompletedCourse = require('../models/CompletedCourse');
const Certification = require('../models/Certification');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

/**
 * Service for handling lesson, course, and theme completion.
 * @class
 */
class CompletionService {
  /**
   * Handle the completion of a lesson, potentially triggering course and theme completion.
   * @async
   * @param {number} userId - The ID of the user completing the lesson.
   * @param {number} lessonId - The ID of the completed lesson.
   * @returns {Promise<Object>} An object containing the completed lesson, course, and certification (if applicable).
   * @throws {Error} If there's an error during the completion process.
   */
  async handleLessonCompletion(userId, lessonId) {
    try {
      // Mark lesson as completed
      const completedLesson = await CompletedLessons.create({ idUser: userId, idLesson: lessonId });

      // Get lesson and course information
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }
      const course = await Course.findById(lesson.idCourses);
      if (!course) {
        throw new Error('Course not found');
      }

      // Check if course is completed
      const isCourseCompleted = await CompletedCourse
        .checkAllLessonsCompleted(userId, lesson.idCourses);

      let completedCourse = null;
      let certification = null;

      if (isCourseCompleted) {
        // Mark course as completed
        completedCourse = await CompletedCourse
          .create({ idUser: userId, idCourses: lesson.idCourses });

        // Check if theme is completed
        const isThemeCompleted = await Certification
          .checkAllCoursesCompleted(userId, course.idThemes);

        if (isThemeCompleted) {
          // Create certification
          certification = await Certification.create({ idUser: userId, idThemes: course.idThemes });
        }
      }

      const result = { completedLesson };
      if (completedCourse) result.completedCourse = completedCourse;
      if (certification) result.certification = certification;

      return result;
    } catch (error) {
      console.error('Error in handleLessonCompletion:', error);
      throw error;
    }
  }
}

module.exports = new CompletionService();
