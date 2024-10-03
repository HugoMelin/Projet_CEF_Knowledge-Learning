const db = require('../database/database');

/**
 * Represents a CompletedCourse.
 * @class
 */
class CompletedCourse {
  /**
   * Create a CompletedCourse.
   * @param {number} idUser - The user ID.
   * @param {number} idCourses - The course ID.
   * @param {Date} [completedDate=null] - The date the course was completed.
   */
  constructor(idUser, idCourses, completedDate = null) {
    this.idUser = idUser;
    this.idCourses = idCourses;
    this.completedDate = completedDate;
  }

  /**
   * Create a new completed course record.
   * @async
   * @param {Object} courseData - The course data.
   * @returns {Promise<CompletedCourse>} The created completed course.
   * @throws {Error} If all lessons in the course are not completed.
   */
  static async create(courseData) {
    try {
      const allLessonsCompleted = await this
        .checkAllLessonsCompleted(courseData.idUser, courseData.idCourses);
      if (!allLessonsCompleted) {
        throw new Error('Toutes les leçons du cours doivent être complétées avant de marquer le cours comme terminé.');
      }

      const newCourse = new CompletedCourse(...Object.values(courseData));
      await db.query(`
        INSERT INTO completed_courses (id_user, id_courses)
        VALUES (?, ?)
      `, [newCourse.idUser, newCourse.idCourses]);
      return newCourse;
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement du cours complété: ${error}`);
      throw error;
    }
  }

  /**
   * Find all completed courses.
   * @async
   * @returns {Promise<CompletedCourse[]>} Array of all completed courses.
   */
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id_user, id_courses, completed_date FROM completed_courses');
      return rows.map((row) => new CompletedCourse(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la récupération de tous les cours complétés: ${error}`);
      throw error;
    }
  }

  /**
   * Find completed courses by user ID.
   * @async
   * @param {number} userId - The user ID.
   * @returns {Promise<CompletedCourse[]>} Array of completed courses for the user.
   */
  static async findByUserId(userId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_courses, completed_date FROM completed_courses WHERE id_user = ?', [userId]);
      return rows.map((row) => new CompletedCourse(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la recherche des cours complétés par l'utilisateur: ${error}`);
      throw error;
    }
  }

  /**
   * Find a completed course by user ID and course ID.
   * @async
   * @param {number} userId - The user ID.
   * @param {number} coursesId - The course ID.
   * @returns {Promise<CompletedCourse|null>} The found completed course or null.
   */
  static async findByUserAndCoursesId(userId, coursesId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_courses, completed_date FROM completed_courses WHERE id_courses = ? and id_user = ?', [coursesId, userId]);
      return rows.length > 0 ? new CompletedCourse(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche du cours complété par l'utilisateur: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a completed course.
   * @async
   * @param {Object} data - The completed course data to delete.
   * @returns {Promise<Object>} The delete operation response.
   * @throws {Error} If no completed course was deleted.
   */
  static async delete(data) {
    try {
      const [response] = await db.query(`
        DELETE 
        FROM completed_courses 
        WHERE id_user = ? AND id_courses = ?
      `, [data.idUser, data.idCourses]);

      if (response.affectedRows === 0) {
        throw new Error('Aucun cours complété n\'a été supprimé');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression du cours complété: ${error}`);
      throw error;
    }
  }

  /**
   * Update a completed course.
   * @async
   * @param {CompletedCourse} completedCourse - The completed course to update.
   * @param {Object} dataToUpdate - The data to update.
   * @returns {Promise<Object>} The update operation response.
   * @throws {Error} If no completed course was updated.
   */
  static async update(completedCourse, dataToUpdate) {
    try {
      const { completedDate } = dataToUpdate;

      const [response] = await db.query(`
        UPDATE completed_courses
        SET completed_date = COALESCE(?, completed_date)
        WHERE id_user = ? AND id_courses = ?;
      `, [completedDate, completedCourse.idUser, completedCourse.idCourses]);

      if (response.affectedRows === 0) {
        throw new Error('Aucun cours complété n\'a été mise à jour');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du cours complété: ${error}`);
      throw error;
    }
  }

  /**
   * Check if all lessons in a course are completed by a user.
   * @async
   * @param {number} userId - The user ID.
   * @param {number} coursesId - The course ID.
   * @returns {Promise<boolean>} True if all lessons are completed, false otherwise.
   */
  static async checkAllLessonsCompleted(userId, coursesId) {
    try {
      // This query checks if the number of lessons completed for the course is equal
      // to the total number of lessons in the course.
      const [response] = await db.query(`
        SELECT
          (SELECT COUNT(*)
          FROM completed_lessons 
          JOIN lessons ON completed_lessons.id_lessons = lessons.id_lessons
          WHERE completed_lessons.id_user = ?
          AND lessons.id_courses = ?) = 
          (SELECT COUNT(*)
          FROM lessons 
          WHERE lessons.id_courses = ?) AS all_completed;
      `, [userId, coursesId, coursesId]);

      return response[0].all_completed === 1;
    } catch (error) {
      console.error(`Erreur lors de la vérification des leçons complétées: ${error}`);
      throw error;
    }
  }
}

module.exports = CompletedCourse;
