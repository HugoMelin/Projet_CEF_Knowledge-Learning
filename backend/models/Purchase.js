const db = require('../database/database');

class Purchase {
  constructor(idUser, idInvoice, idCourses = null, idLessons = null, idPurchases = null) {
    this.idPurchases = idPurchases;
    this.idUser = idUser;
    this.idCourses = idCourses;
    this.idLessons = idLessons;
    this.idInvoice = idInvoice;
  }

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

      const newPurchase = new Purchase(idUser, idInvoice, idCourses, idLessons, response.insertId);
      return newPurchase;
    } catch (error) {
      console.error(`Erreur lors de la création de l'achat : ${error}`);
      throw error;
    }
  }

  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id_user, id_invoice, id_courses, id_lessons, id_purchases FROM purchases');
      return rows.map((row) => new Purchase(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la récupération de tous les achats : ${error}`);
      throw error;
    }
  }

  static async findById(purchaseId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_invoice, id_courses, id_lessons, id_purchases FROM purchases WHERE id_purchases = ?', [purchaseId]);
      return rows.length ? new Purchase(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche de l'achat : ${error}`);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const [rows] = await db.query('SELECT id_user, id_invoice, id_courses, id_lessons, id_purchases FROM purchases WHERE id_user = ?', [userId]);
      return rows.map((row) => new Purchase(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la recherche des achats de l'utilisateur : ${error}`);
      throw error;
    }
  }

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
