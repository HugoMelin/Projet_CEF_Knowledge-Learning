const db = require('../database/database');

class Theme {
  constructor(name, idThemes = null) {
    this.idThemes = idThemes;
    this.name = name;
  }

  static async create(themeData) {
    try {
      const existingTheme = await this.findByName(themeData.name);
      if (existingTheme) {
        console.error('Ce thème existe déjà !');
        throw new Error('Ce thème existe déjà !');
      }
      const newTheme = new Theme(...Object.values(themeData));
      const [response] = await db.query(`
        INSERT 
        INTO themes (name)
        VALUES (?)
      `, [newTheme.name]);
      newTheme.idThemes = response.insertId;
      return newTheme;
    } catch (error) {
      console.error(`Erreur lors de la création du thème: ${error}`);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await db.query('SELECT name, id_themes FROM themes');
      const result = rows.map((row) => new Theme(...Object.values(row)));
      return result;
    } catch (error) {
      console.error(`Erreur lors de la récupération de tous les thèmes: ${error}`);
      throw error;
    }
  }

  static async findByName(name) {
    try {
      const [rows] = await db.query('SELECT name, id_themes FROM themes WHERE name = ?', [name]);
      const result = rows.map((row) => new Theme(...Object.values(row)));
      return result[0];
    } catch (error) {
      console.error(`Erreur lors de la recherche d'un thème par nom': ${error}`);
      throw error;
    }
  }
}

module.exports = Theme;
