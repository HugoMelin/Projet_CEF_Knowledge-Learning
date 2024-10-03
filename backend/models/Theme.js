const db = require('../database/database');

/**
 * Represents a Theme.
 * @class
 */
class Theme {
  /**
   * Create a Theme.
   * @param {string} name - The theme name.
   * @param {number} [idThemes=null] - The theme ID.
   */
  constructor(name, idThemes = null) {
    this.idThemes = idThemes;
    this.name = name;
  }

  /**
   * Create a new theme.
   * @async
   * @param {Object} themeData - The theme data.
   * @returns {Promise<Theme>} The created theme.
   * @throws {Error} If the theme already exists or if there's an error during creation.
   */
  static async create(themeData) {
    try {
      const existingTheme = await this.findByName(themeData.name);
      if (existingTheme) {
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

  /**
   * Find all themes.
   * @async
   * @returns {Promise<Theme[]>} Array of all themes.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT name, id_themes FROM themes');
      return rows.map((row) => new Theme(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la récupération de tous les thèmes: ${error}`);
      throw error;
    }
  }

  /**
   * Find a theme by ID.
   * @async
   * @param {number} id - The theme ID.
   * @returns {Promise<Theme|null>} The found theme or null.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT name, id_themes FROM themes WHERE id_themes = ?', [id]);
      return rows.length > 0 ? new Theme(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche d'un thème par ID: ${error}`);
      throw error;
    }
  }

  /**
   * Find a theme by name.
   * @async
   * @param {string} name - The theme name.
   * @returns {Promise<Theme|null>} The found theme or null.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findByName(name) {
    try {
      const [rows] = await db.query('SELECT name, id_themes FROM themes WHERE name = ?', [name]);
      return rows.length > 0 ? new Theme(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche d'un thème par nom: ${error}`);
      throw error;
    }
  }

  /**
   * Delete a theme.
   * @async
   * @param {Object} data - The theme data to delete.
   * @returns {Promise<Object>} The delete operation response.
   * @throws {Error} If no theme was deleted or if there's an error during deletion.
   */
  static async delete(data) {
    try {
      const [response] = await db.query(`
        DELETE 
        FROM themes 
        WHERE id_themes = ?
      `, [data.idThemes]);

      if (response.affectedRows === 0) {
        throw new Error('Aucun thème n\'a été supprimé');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression du thème: ${error}`);
      throw error;
    }
  }

  /**
   * Update a theme.
   * @async
   * @param {Theme} theme - The theme to update.
   * @param {Object} dataToUpdate - The data to update.
   * @returns {Promise<Object>} The update operation response.
   * @throws {Error} If no theme was updated or if there's an error during update.
   */
  static async update(theme, dataToUpdate) {
    try {
      const { name } = dataToUpdate;

      const [response] = await db.query(`
        UPDATE themes 
        SET 
          name = COALESCE(?, name)
        WHERE id_themes = ?;
        `, [name, theme.idThemes]);

      if (response.affectedRows === 0) {
        throw new Error('Aucun thème n\'a été mis à jour');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du thème: ${error}`);
      throw error;
    }
  }
}

module.exports = Theme;
