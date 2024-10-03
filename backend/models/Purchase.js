const db = require('../database/database');

/**
 * Represents a Purchase.
 * @class
 */
class Purchase {
  /**
   * Create a Purchase.
   * @param {number} idUser - The user ID.
   * @param {number} idInvoice - The invoice ID.
   * @param {number|null} [idCourses=null] - The course ID (if applicable).
   * @param {number|null} [idLessons=null] - The lesson ID (if applicable).
   * @param {number|null} [idPurchases=null] - The purchase ID.
   */
  constructor(idUser, idInvoice, idCourses = null, idLessons = null, idPurchases = null) {
    this.idPurchases = idPurchases;
    this.idUser = idUser;
    this.idCourses = idCourses;
    this.idLessons = idLessons;
    this.idInvoice = idInvoice;
  }

  /**
   * Create a new purchase.
   * @async
   * @param {Object} purchaseData - The purchase data.
   * @returns {Promise<Purchase>} The created purchase.
   * @throws {Error} If the purchase data is invalid or if there's an error during creation.
   */
  static async create(purchaseData) {
    try {
      const {
        idUser,
        idCourses,
        idLessons,
        idInvoice,
      } = purchaseData;

      if ((idCourses && idLessons) || (!idCourses && !idLessons)) {
        throw new Error('Un achat doit concerner soit un cours, soit une leçon, mais pas les deux ou aucun des deux.');
      }

      const [response] = await db.query(`
        INSERT INTO purchases (id_user, id_courses, id_lessons, id_invoice)
        VALUES (?, ?, ?, ?)
      `, [idUser, idCourses || null, idLessons || null, idInvoice]);

      return new Purchase(idUser, idInvoice, idCourses, idLessons, response.insertId);
    } catch (error) {
      console.error(`Erreur lors de la création de l'achat : ${error}`);
      throw error;
    }
  }

  /**
   * Find all purchases.
   * @async
   * @returns {Promise<Purchase[]>} Array of all purchases.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id_user, id_invoice, id_courses, id_lessons, id_purchases FROM purchases');
      return rows.map((row) => new Purchase(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la récupération de tous les achats : ${error}`);
      throw error;
    }
  }

  /**
   * Find a purchase by ID.
   * @async
   * @param {number} purchaseId - The purchase ID.
   * @returns {Promise<Purchase|null>} The found purchase or null.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findById(purchaseId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_invoice, id_courses, id_lessons, id_purchases FROM purchases WHERE id_purchases = ?', [purchaseId]);
      return rows.length ? new Purchase(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche de l'achat : ${error}`);
      throw error;
    }
  }

  /**
   * Find purchases by user ID.
   * @async
   * @param {number} userId - The user ID.
   * @returns {Promise<Purchase[]>} Array of purchases for the user.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findByUserId(userId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_invoice, id_courses, id_lessons, id_purchases FROM purchases WHERE id_user = ?', [userId]);
      return rows.map((row) => new Purchase(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la recherche des achats de l'utilisateur : ${error}`);
      throw error;
    }
  }

  /**
   * Find a purchase by user ID and course ID.
   * @async
   * @param {number} userId - The user ID.
   * @param {number} courseId - The course ID.
   * @returns {Promise<Purchase|null>} The found purchase or null.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findByUserAndCourseId(userId, courseId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_invoice, id_courses, id_lessons, id_purchases FROM purchases WHERE id_courses = ? and id_user = ?', [courseId, userId]);
      return rows.length ? new Purchase(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche de l'achat du cours par l'utilisateur: ${error}`);
      throw error;
    }
  }

  /**
   * Find a purchase by user ID and lesson ID.
   * @async
   * @param {number} userId - The user ID.
   * @param {number} lessonId - The lesson ID.
   * @returns {Promise<Purchase|null>} The found purchase or null.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findByUserAndLessonId(userId, lessonId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_invoice, id_courses, id_lessons, id_purchases FROM purchases WHERE id_lessons = ? and id_user = ?', [lessonId, userId]);
      return rows.length ? new Purchase(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche de l'achat de la leçon par l'utilisateur: ${error}`);
      throw error;
    }
  }

  /**
   * Update a purchase.
   * @async
   * @param {Purchase} purchase - The purchase to update.
   * @returns {Promise<Object>} The update operation response.
   * @throws {Error} If no purchase was updated or if there's an error during update.
   */
  static async update(purchase) {
    try {
      const [response] = await db.query(`
        UPDATE purchases
        SET 
          id_user = COALESCE(?, id_user),
          id_courses = COALESCE(?, id_courses),
          id_lessons = COALESCE(?, id_lessons),
          id_invoice = COALESCE(?, id_invoice)
        WHERE id_purchases = ?
      `, [purchase.idUser, purchase.idCourses, purchase.idLessons, purchase.idInvoice, purchase.idPurchases]);

      if (response.affectedRows === 0) {
        throw new Error('Aucun achat n\'a été mis à jour');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'achat : ${error}`);
      throw error;
    }
  }

  /**
   * Delete a purchase.
   * @async
   * @param {number} purchaseId - The ID of the purchase to delete.
   * @returns {Promise<Object>} The delete operation response.
   * @throws {Error} If no purchase was deleted or if there's an error during deletion.
   */
  static async delete(purchaseId) {
    try {
      const [response] = await db.query(`
        DELETE 
        FROM purchases 
        WHERE id_purchases = ?
        `, [purchaseId]);

      if (response.affectedRows === 0) {
        throw new Error('Aucun achat n\'a été supprimé');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'achat : ${error}`);
      throw error;
    }
  }
}

module.exports = Purchase;
