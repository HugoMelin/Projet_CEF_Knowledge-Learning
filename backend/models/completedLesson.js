const db = require('../database/database');

class CompletedLesson {
  constructor(idUser, idCourses, completedDate = null) {
    this.idUser = idUser;
    this.idLessons = idCourses;
    this.completedDate = completedDate;
  }

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

  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id_user, id_lessons, completed_date FROM completed_lessons');
      const result = rows.map((row) => new CompletedLesson(...Object.values(row)));
      return result;
    } catch (error) {
      console.error(`Erreur lors de la récupération de toutes les leçons complétées: ${error}`);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_lessons, completed_date FROM completed_lessons WHERE id_user = ?', [userId]);
      const result = rows.map((row) => new CompletedLesson(...Object.values(row)));
      return result;
    } catch (error) {
      console.error(`Erreur lors de la recherche des leçons complétées par l'utilisateur: ${error}`);
      throw error;
    }
  }

  static async findByUserAndLessonsId(userId, lessonId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_lessons, completed_date FROM completed_lessons WHERE id_lessons = ? and id_user = ?', [lessonId, userId]);
      const result = rows.map((row) => new CompletedLesson(...Object.values(row)));
      return result[0];
    } catch (error) {
      console.error(`Erreur lors de la recherche de la leçon complétée par l'utilisateur: ${error}`);
      throw error;
    }
  }

  static async delete(data) {
    try {
      const [response] = await db.query(`
        DELETE 
        FROM completed_lessons
        WHERE id_user = ? AND id_lessons = ?
      `, [data.idUser, data.idLessons]);

      if (response.affectedRows === 0) {
        console.error('Aucune leçon complétée n\'a été supprimée');
        throw new Error('Aucune leçon complétée n\'a été supprimée');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la leçon complétée: ${error}`);
      throw error;
    }
  }

  static async update(completedLesson, dataToUpdate) {
    try {
      const { completedDate } = dataToUpdate;

      const [response] = await db.query(`
        UPDATE completed_lessons
        SET completed_date = COALESCE(?, completed_date)
        WHERE id_user = ? AND id_lessons = ?;
      `, [completedDate, completedLesson.idUser, completedLesson.idLessons]);

      if (response.affectedRows === 0) {
        console.error('Aucune leçon complétée n\'a été mise à jour');
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
