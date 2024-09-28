const db = require('../database/database');

class Lesson {
  constructor(title, content, videoUrl, price, idCourses, idLessons = null) {
    this.idLessons = idLessons;
    this.title = title;
    this.content = content;
    this.videoUrl = videoUrl;
    this.price = price;
    this.idCourses = idCourses;
  }

  static async create(lessonData) {
    try {
      const existingLesson = await this.findByTitle(lessonData.title);
      if (existingLesson) {
        console.error('Cette leçon existe déjà !');
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

  static async findAll() {
    try {
      const [rows] = await db.query('SELECT title, content, video_url, price, id_courses, id_lessons FROM lessons');
      const result = rows.map((row) => new Lesson(...Object.values(row)));
      return result;
    } catch (error) {
      console.error(`Erreur lors de la récupération de toutes les leçons: ${error}`);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT title, content, video_url, price, id_courses, id_lessons FROM lessons WHERE id_lessons = ?', [id]);
      const result = rows.map((row) => new Lesson(...Object.values(row)));
      return result[0];
    } catch (error) {
      console.error(`Erreur lors de la recherche d'une leçon par ID: ${error}`);
      throw error;
    }
  }

  static async findByTitle(title) {
    try {
      const [rows] = await db.query('SELECT title, content, video_url, price, id_courses, id_lessons FROM lessons WHERE title = ?', [title]);
      const result = rows.map((row) => new Lesson(...Object.values(row)));
      return result[0];
    } catch (error) {
      console.error(`Erreur lors de la recherche d'une leçon par titre: ${error}`);
      throw error;
    }
  }

  static async delete(data) {
    try {
      const [response] = await db.query(`
        DELETE FROM lessons 
        WHERE id_lessons = ?
        `, [data.idLessons]);
      if (response.affectedRows === 0) {
        console.error('Aucune leçon n\'a été supprimée');
        throw new Error('Aucune leçon n\'a été supprimée');
      }
      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la leçon: ${error}`);
      throw error;
    }
  }

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
        console.error('Aucune leçon n\'a été mise à jour');
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
