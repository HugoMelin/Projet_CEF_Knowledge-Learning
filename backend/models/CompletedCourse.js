const db = require('../database/database');

class CompletedCourse {
  constructor(idUser, idCourses, completedDate = null) {
    this.idUser = idUser;
    this.idCourses = idCourses;
    this.completedDate = completedDate;
  }

  static async create(courseData) {
    try {
      // Check if all lessons in the course are completed
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

  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id_user, id_courses, completed_date FROM completed_courses');
      const result = rows.map((row) => new CompletedCourse(...Object.values(row)));
      return result;
    } catch (error) {
      console.error(`Erreur lors de la récupération de tous les cours complétés: ${error}`);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_courses, completed_date FROM completed_courses WHERE id_user = ?', [userId]);
      const result = rows.map((row) => new CompletedCourse(...Object.values(row)));
      return result;
    } catch (error) {
      console.error(`Erreur lors de la recherche des cours complétés par l'utilisateur: ${error}`);
      throw error;
    }
  }

  static async findByUserAndCoursesId(userId, coursesId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_courses, completed_date FROM completed_courses WHERE id_courses = ? and id_user = ?', [coursesId, userId]);
      const result = rows.map((row) => new CompletedCourse(...Object.values(row)));
      return result[0];
    } catch (error) {
      console.error(`Erreur lors de la recherche du cours complété par l'utilisateur: ${error}`);
      throw error;
    }
  }

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

  static async update(completedCourse, dataToUpdate) {
    try {
      const { completedDate } = dataToUpdate;

      const [response] = await db.query(`
        UPDATE completed_courses
        SET completed_date = COALESCE(?, completed_date)
        WHERE id_user = ? AND id_courses = ?;
      `, [completedDate, completedCourse.idUser, completedCourse.idCourses]);

      if (response.affectedRows === 0) {
        console.error('Aucun cours complété n\'a été mise à jour');
        throw new Error('Aucun cours complété n\'a été mise à jour');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du cours complété: ${error}`);
      throw error;
    }
  }

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
