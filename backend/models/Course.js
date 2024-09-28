const db = require('../database/database');

class Course {
  constructor(title, description, price, idThemes, idCourses = null) {
    this.idCourses = idCourses;
    this.title = title;
    this.description = description;
    this.price = price;
    this.idThemes = idThemes;
  }

  static async create(courseData) {
    try {
      const existingCourse = await this.findByName(courseData.title);
      if (existingCourse) {
        console.error('Ce cours existe déjà !');
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

  static async findAll() {
    try {
      const [rows] = await db.query('SELECT title, description, price, id_themes, id_courses FROM courses');
      const result = rows.map((row) => new Course(...Object.values(row)));
      return result;
    } catch (error) {
      console.error(`Erreur lors de la récupération de tous les cours: ${error}`);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT title, description, price, id_themes, id_courses FROM courses WHERE id_courses = ?', [id]);
      const result = rows.map((row) => new Course(...Object.values(row)));
      return result[0];
    } catch (error) {
      console.error(`Erreur lors de la recherche d'un cours par ID: ${error}`);
      throw error;
    }
  }

  static async findByName(name) {
    try {
      const [rows] = await db.query('SELECT title, description, price, id_themes, id_courses FROM courses WHERE title = ?', [name]);
      const result = rows.map((row) => new Course(...Object.values(row)));
      return result[0];
    } catch (error) {
      console.error(`Erreur lors de la recherche d'un cours par nom: ${error}`);
      throw error;
    }
  }

  static async delete(data) {
    try {
      const [response] = await db.query(`
        DELETE 
        FROM courses 
        WHERE id_courses = ?
      `, [data.idCourses]);

      if (response.affectedRows === 0) {
        console.error('Aucun cours n\'a été supprimé');
        throw new Error('Aucun cours n\'a été supprimé');
      }
      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression du cours: ${error}`);
      throw error;
    }
  }

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
        console.error('Aucun cours n\'a été mis à jour');
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
