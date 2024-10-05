const db = require('../database/database');

/**
 * Represents a Course.
 * @class
 */
class Course {
  /**
   * Create a Course.
   * @param {string} title - The course title.
   * @param {string} description - The course description.
   * @param {number} price - The course price.
   * @param {number} idThemes - The theme ID.
   * @param {number} [idCourses=null] - The course ID.
   */
  constructor(title, description, price, idThemes, idCourses = null) {
    this.idCourses = idCourses;
    this.title = title;
    this.description = description;
    this.price = price;
    this.idThemes = idThemes;
  }

  /**
   * Create a new course.
   * @async
   * @param {Object} courseData - The course data.
   * @returns {Promise<Course>} The created course.
   * @throws {Error} If the course already exists.
   */
  static async create(courseData) {
    try {
      const existingCourse = await this.findByName(courseData.title);
      if (existingCourse) {
        throw new Error('Ce cours existe déjà !');
      }
      const newCourse = new Course(...Object.values(courseData));
      const [response] = await db.query(`
        INSERT 
        INTO courses (title, description, price, id_themes)
        VALUES (?, ?, ?, ?)
      `, [newCourse.title, newCourse.description, newCourse.price, newCourse.idThemes]);
      newCourse.idCourses = response.insertId;
      return newCourse;
    } catch (error) {
      console.error(`Erreur lors de la création du cours: ${error}`);
      throw error;
    }
  }

  /**
   * Find all courses.
   * @async
   * @returns {Promise<Course[]>} Array of all courses.
   */
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT title, description, price, id_themes, id_courses FROM courses');
      return rows.map((row) => new Course(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la récupération de tous les cours: ${error}`);
      throw error;
    }
  }

  /**
   * Find a course by ID.
   * @async
   * @param {number} id - The course ID.
   * @returns {Promise<Course|null>} The found course or null.
   */
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT title, description, price, id_themes, id_courses FROM courses WHERE id_courses = ?', [id]);
      return rows.length > 0 ? new Course(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche d'un cours par ID: ${error}`);
      throw error;
    }
  }

  /**
   * Find a course by name.
   * @async
   * @param {string} name - The course name.
   * @returns {Promise<Course|null>} The found course or null.
   */
  static async findByName(name) {
    try {
      const [rows] = await db.query('SELECT title, description, price, id_themes, id_courses FROM courses WHERE title = ?', [name]);
      return rows.length > 0 ? new Course(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche d'un cours par nom: ${error}`);
      throw error;
    }
  }

/**
 * Find all courses by theme ID.
 * @async
 * @param {number} themeId - The theme ID.
 * @returns {Promise<Course[]>} Array of courses for the given theme.
 */
static async findByThemeId(themeId) {
  try {
    const [rows] = await db.query(`
      SELECT title, description, price, id_themes, id_courses 
      FROM courses 
      WHERE id_themes = ?
    `, [themeId]);
    
    return rows.map((row) => new Course(...Object.values(row)));
  } catch (error) {
    console.error(`Erreur lors de la récupération des cours pour le thème ${themeId}: ${error}`);
    throw error;
  }
}

  /**
   * Delete a course.
   * @async
   * @param {Object} data - The course data to delete.
   * @returns {Promise<Object>} The delete operation response.
   * @throws {Error} If no course was deleted.
   */
  static async delete(data) {
    try {
      const [response] = await db.query(`
        DELETE 
        FROM courses 
        WHERE id_courses = ?
      `, [data.idCourses]);

      if (response.affectedRows === 0) {
        throw new Error('Aucun cours n\'a été supprimé');
      }
      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression du cours: ${error}`);
      throw error;
    }
  }

  /**
   * Update a course.
   * @async
   * @param {Course} course - The course to update.
   * @param {Object} dataToUpdate - The data to update.
   * @returns {Promise<Object>} The update operation response.
   * @throws {Error} If no course was updated.
   */
  static async update(course, dataToUpdate) {
    try {
      const {
        title,
        description,
        price,
        idThemes,
      } = dataToUpdate;
      const [response] = await db.query(`
        UPDATE courses 
        SET 
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          price = COALESCE(?, price),
          id_themes = COALESCE(?, id_themes)
        WHERE id_courses = ?;
      `, [title, description, price, idThemes, course.idCourses]);

      if (response.affectedRows === 0) {
        throw new Error('Aucun cours n\'a été mis à jour');
      }
      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du cours: ${error}`);
      throw error;
    }
  }
}

module.exports = Course;
