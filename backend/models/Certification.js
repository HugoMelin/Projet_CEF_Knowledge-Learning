const db = require('../database/database');

/**
 * Represents a Certification.
 * @class
 */
class Certification {
  /**
   * Create a Certification.
   * @param {number} idUser - The user ID.
   * @param {number} idThemes - The theme ID.
   * @param {number} [idCertifications=null] - The certification ID.
   * @param {Date} [obtainedDate=null] - The date the certification was obtained.
   */
  constructor(idUser, idThemes, idCertifications = null, obtainedDate = null) {
    this.idUser = idUser;
    this.idThemes = idThemes;
    this.idCertifications = idCertifications;
    this.obtainedDate = obtainedDate;
  }

  /**
   * Create a new certification.
   * @async
   * @param {Object} certificationData - The certification data.
   * @returns {Promise<Certification>} The created certification.
   * @throws {Error} If all courses in the theme are not completed.
   */
  static async create(certificationData) {
    try {
      const allCoursesCompleted = await this
        .checkAllCoursesCompleted(certificationData.idUser, certificationData.idThemes);
      if (!allCoursesCompleted) {
        throw new Error('Toutes les cours du thème doivent être complétés avant de marquer le thème comme terminé.');
      }

      const newCertification = new Certification(...Object.values(certificationData));
      const [response] = await db.query(`
        INSERT INTO certifications (id_user, id_themes)
        VALUES (?, ?)
      `, [newCertification.idUser, newCertification.idThemes]);
      newCertification.idCertifications = response.insertId;
      return newCertification;
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de la certification: ${error}`);
      throw error;
    }
  }

  /**
   * Find all certifications.
   * @async
   * @returns {Promise<Certification[]>} Array of all certifications.
   */
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id_user, id_themes, id_certifications, obtained_date FROM certifications');
      return rows.map((row) => new Certification(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la récupération de toutes les certifications: ${error}`);
      throw error;
    }
  }

  /**
   * Find certifications by user ID.
   * @async
   * @param {number} userId - The user ID.
   * @returns {Promise<Certification[]>} Array of certifications for the user.
   */
  static async findByUserId(userId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_themes, id_certifications, obtained_date FROM certifications WHERE id_user = ?', [userId]);
      return rows.map((row) => new Certification(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la recherche des certifications de l'utilisateur: ${error}`);
      throw error;
    }
  }

  /**
   * Find a certification by user ID and theme ID.
   * @async
   * @param {number} userId - The user ID.
   * @param {number} themeId - The theme ID.
   * @returns {Promise<Certification|null>} The found certification or null.
   */
  static async findByUserAndThemeId(userId, themeId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_themes, id_certifications, obtained_date FROM certifications WHERE id_themes = ? AND id_user = ?', [themeId, userId]);
      return rows.length > 0 ? new Certification(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche de la certification: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a certification.
   * @async
   * @param {Object} data - The certification data to delete.
   * @returns {Promise<Object>} The delete operation response.
   * @throws {Error} If no certification was deleted.
   */
  static async delete(data) {
    try {
      const [response] = await db.query(`
        DELETE 
        FROM certifications 
        WHERE id_user = ? AND id_themes = ?
      `, [data.idUser, data.idThemes]);

      if (response.affectedRows === 0) {
        throw new Error('Aucune certification n\'a été supprimée');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la certification: ${error}`);
      throw error;
    }
  }

  /**
   * Update a certification.
   * @async
   * @param {Certification} certification - The certification to update.
   * @param {Object} dataToUpdate - The data to update.
   * @returns {Promise<Object>} The update operation response.
   * @throws {Error} If no certification was updated.
   */
  static async update(certification, dataToUpdate) {
    try {
      const { obtainedDate } = dataToUpdate;

      const [response] = await db.query(`
        UPDATE certifications
        SET obtained_date = COALESCE(?, obtained_date)
        WHERE id_user = ? AND id_themes = ?;
      `, [obtainedDate, certification.idUser, certification.idThemes]);

      if (response.affectedRows === 0) {
        throw new Error('Aucune certification n\'a été mise à jour');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la certification: ${error}`);
      throw error;
    }
  }

  /**
   * Check if all courses in a theme are completed by a user.
   * @async
   * @param {number} userId - The user ID.
   * @param {number} themesId - The theme ID.
   * @returns {Promise<boolean>} True if all courses are completed, false otherwise.
   */
  static async checkAllCoursesCompleted(userId, themesId) {
    try {
      // This query checks if the number of courses completed for the theme is equal
      // to the total number of courses in the theme.
      const [response] = await db.query(`
        SELECT
          (SELECT COUNT(*)
          FROM completed_courses
          JOIN courses ON completed_courses.id_courses = courses.id_courses
          WHERE completed_courses.id_user = ?
          AND courses.id_themes = ?) = 
          (SELECT COUNT(*)
          FROM courses 
          WHERE courses.id_themes = ?) AS all_completed;
      `, [userId, themesId, themesId]);

      return response[0].all_completed === 1;
    } catch (error) {
      console.error(`Erreur lors de la vérification des cours complétés: ${error}`);
      throw error;
    }
  }
}

module.exports = Certification;
