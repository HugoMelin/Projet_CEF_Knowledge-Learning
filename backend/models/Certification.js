const db = require('../database/database');

class Certification {
  constructor(idUser, idThemes, idCertifications = null, obtainedDate = null) {
    this.idUser = idUser;
    this.idThemes = idThemes;
    this.idCertifications = idCertifications;
    this.obtainedDate = obtainedDate;
  }

  static async create(certificationData) {
    try {
      // Check if all courses in the theme are completed
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

  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id_user, id_themes, id_certifications, obtained_date FROM certifications');
      const result = rows.map((row) => new Certification(...Object.values(row)));
      return result;
    } catch (error) {
      console.error(`Erreur lors de la récupération de toutes les certifications: ${error}`);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_themes, id_certifications, obtained_date FROM certifications WHERE id_user = ?', [userId]);
      const result = rows.map((row) => new Certification(...Object.values(row)));
      return result;
    } catch (error) {
      console.error(`Erreur lors de la recherche des certifications de l'utilisateur: ${error}`);
      throw error;
    }
  }

  static async findByUserAndThemeId(userId, themeId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_themes, id_certifications, obtained_date FROM certifications WHERE id_themes = ? AND id_user = ?', [themeId, userId]);
      const result = rows.map((row) => new Certification(...Object.values(row)));
      return result[0];
    } catch (error) {
      console.error(`Erreur lors de la recherche de la certification: ${error}`);
      throw error;
    }
  }

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

  static async update(certification, dataToUpdate) {
    try {
      const { obtainedDate } = dataToUpdate;

      const [response] = await db.query(`
        UPDATE certifications
        SET obtained_date = COALESCE(?, obtained_date)
        WHERE id_user = ? AND id_themes = ?;
      `, [obtainedDate, certification.idUser, certification.idThemes]);

      if (response.affectedRows === 0) {
        console.error('Aucune certification n\'a été mise à jour');
        throw new Error('Aucune certification n\'a été mise à jour');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la certification: ${error}`);
      throw error;
    }
  }

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
