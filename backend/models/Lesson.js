const db = require('../database/database');

/**
 * Represents a Lesson.
 * @class
 */
class Lesson {
  /**
   * Create a Lesson.
   * @param {string} title - The lesson title.
   * @param {string} content - The lesson content.
   * @param {string} videoUrl - The URL of the lesson video.
   * @param {number} price - The lesson price.
   * @param {number} idCourses - The ID of the course this lesson belongs to.
   * @param {number} [idLessons=null] - The lesson ID.
   */
  constructor(title, content, videoUrl, price, idCourses, idLessons = null) {
    this.idLessons = idLessons;
    this.title = title;
    this.content = content;
    this.videoUrl = videoUrl;
    this.price = price;
    this.idCourses = idCourses;
  }

  /**
   * Create a new lesson.
   * @async
   * @param {Object} lessonData - The lesson data.
   * @returns {Promise<Lesson>} The created lesson.
   * @throws {Error} If the lesson already exists or if there's an error during creation.
   */
  static async create(lessonData) {
    try {
      const existingLesson = await this.findByTitle(lessonData.title);
      if (existingLesson) {
        throw new Error('Cette leçon existe déjà !');
      }
      const newLesson = new Lesson(...Object.values(lessonData));
      const [response] = await db.query(`
        INSERT 
        INTO lessons (title, content, video_url, price, id_courses)
        VALUES (?, ?, ?, ?, ?)
      `, [newLesson.title, newLesson.content, newLesson.videoUrl, newLesson.price, newLesson.idCourses]);
      newLesson.idLessons = response.insertId;
      return newLesson;
    } catch (error) {
      console.error(`Erreur lors de la création de la leçon: ${error}`);
      throw error;
    }
  }

  /**
   * Find all lessons.
   * @async
   * @returns {Promise<Lesson[]>} Array of all lessons.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT title, content, video_url, price, id_courses, id_lessons FROM lessons');
      return rows.map((row) => new Lesson(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la récupération de toutes les leçons: ${error}`);
      throw error;
    }
  }

  /**
   * Find a lesson by ID.
   * @async
   * @param {number} id - The lesson ID.
   * @returns {Promise<Lesson|null>} The found lesson or null.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT title, content, video_url, price, id_courses, id_lessons FROM lessons WHERE id_lessons = ?', [id]);
      return rows.length > 0 ? new Lesson(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche d'une leçon par ID: ${error}`);
      throw error;
    }
  }

  /**
   * Find a lesson by title.
   * @async
   * @param {string} title - The lesson title.
   * @returns {Promise<Lesson|null>} The found lesson or null.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findByTitle(title) {
    try {
      const [rows] = await db.query('SELECT title, content, video_url, price, id_courses, id_lessons FROM lessons WHERE title = ?', [title]);
      return rows.length > 0 ? new Lesson(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche d'une leçon par titre: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a lesson.
   * @async
   * @param {Object} data - The lesson data to delete.
   * @returns {Promise<Object>} The delete operation response.
   * @throws {Error} If no lesson was deleted or if there's an error during deletion.
   */
  static async delete(data) {
    try {
      const [response] = await db.query(`
        DELETE FROM lessons 
        WHERE id_lessons = ?
        `, [data.idLessons]);
      if (response.affectedRows === 0) {
        throw new Error('Aucune leçon n\'a été supprimée');
      }
      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la leçon: ${error}`);
      throw error;
    }
  }

  /**
   * Update a lesson.
   * @async
   * @param {Lesson} lesson - The lesson to update.
   * @param {Object} dataToUpdate - The data to update.
   * @returns {Promise<Object>} The update operation response.
   * @throws {Error} If no lesson was updated or if there's an error during update.
   */
  static async update(lesson, dataToUpdate) {
    try {
      const {
        title,
        content,
        videoUrl,
        price,
        idCourses,
      } = dataToUpdate;

      const [response] = await db.query(`
        UPDATE lessons 
        SET 
          title = COALESCE(?, title),
          content = COALESCE(?, content),
          video_url = COALESCE(?, video_url),
          price = COALESCE(?, price),
          id_courses = COALESCE(?, id_courses)
        WHERE id_lessons = ?;
      `, [title, content, videoUrl, price, idCourses, lesson.idLessons]);

      if (response.affectedRows === 0) {
        throw new Error('Aucune leçon n\'a été mise à jour');
      }
      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la leçon: ${error}`);
      throw error;
    }
  }
}

module.exports = Lesson;
