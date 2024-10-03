const db = require('../database/database');

/**
 * Represents a CompletedLesson.
 * @class
 */
class CompletedLesson {
  /**
   * Create a CompletedLesson.
   * @param {number} idUser - The user ID.
   * @param {number} idLessons - The lesson ID.
   * @param {Date} [completedDate=null] - The date the lesson was completed.
   */
  constructor(idUser, idLessons, completedDate = null) {
    this.idUser = idUser;
    this.idLessons = idLessons;
    this.completedDate = completedDate;
  }

  /**
   * Create a new completed lesson record.
   * @async
   * @param {Object} lessonData - The lesson data.
   * @returns {Promise<CompletedLesson>} The created completed lesson.
   */
  static async create(lessonData) {
    try {
      const newLesson = new CompletedLesson(...Object.values(lessonData));
      await db.query(`
        INSERT 
        INTO completed_lessons (id_user, id_lessons)
        VALUES (?, ?)
      `, [newLesson.idUser, newLesson.idLessons]);
      return newLesson;
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de la leçon complétée: ${error}`);
      throw error;
    }
  }

  /**
   * Find all completed lessons.
   * @async
   * @returns {Promise<CompletedLesson[]>} Array of all completed lessons.
   */
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id_user, id_lessons, completed_date FROM completed_lessons');
      return rows.map((row) => new CompletedLesson(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la récupération de toutes les leçons complétées: ${error}`);
      throw error;
    }
  }

  /**
   * Find completed lessons by user ID.
   * @async
   * @param {number} userId - The user ID.
   * @returns {Promise<CompletedLesson[]>} Array of completed lessons for the user.
   */
  static async findByUserId(userId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_lessons, completed_date FROM completed_lessons WHERE id_user = ?', [userId]);
      return rows.map((row) => new CompletedLesson(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la recherche des leçons complétées par l'utilisateur: ${error}`);
      throw error;
    }
  }

  /**
   * Find a completed lesson by user ID and lesson ID.
   * @async
   * @param {number} userId - The user ID.
   * @param {number} lessonId - The lesson ID.
   * @returns {Promise<CompletedLesson|null>} The found completed lesson or null.
   */
  static async findByUserAndLessonsId(userId, lessonId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_lessons, completed_date FROM completed_lessons WHERE id_lessons = ? and id_user = ?', [lessonId, userId]);
      return rows.length > 0 ? new CompletedLesson(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche de la leçon complétée par l'utilisateur: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a completed lesson.
   * @async
   * @param {Object} data - The completed lesson data to delete.
   * @returns {Promise<Object>} The delete operation response.
   * @throws {Error} If no completed lesson was deleted.
   */
  static async delete(data) {
    try {
      const [response] = await db.query(`
        DELETE 
        FROM completed_lessons
        WHERE id_user = ? AND id_lessons = ?
      `, [data.idUser, data.idLessons]);

      if (response.affectedRows === 0) {
        throw new Error('Aucune leçon complétée n\'a été supprimée');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la leçon complétée: ${error}`);
      throw error;
    }
  }

  /**
   * Update a completed lesson.
   * @async
   * @param {CompletedLesson} completedLesson - The completed lesson to update.
   * @param {Object} dataToUpdate - The data to update.
   * @returns {Promise<Object>} The update operation response.
   * @throws {Error} If no completed lesson was updated.
   */
  static async update(completedLesson, dataToUpdate) {
    try {
      const { completedDate } = dataToUpdate;

      const [response] = await db.query(`
        UPDATE completed_lessons
        SET completed_date = COALESCE(?, completed_date)
        WHERE id_user = ? AND id_lessons = ?;
      `, [completedDate, completedLesson.idUser, completedLesson.idLessons]);

      if (response.affectedRows === 0) {
        throw new Error('Aucune leçon complétée n\'a été mise à jour');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la leçon complétée: ${error}`);
      throw error;
    }
  }
}

module.exports = CompletedLesson;
