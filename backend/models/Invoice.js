const db = require('../database/database');

/**
 * Represents an Invoice.
 * @class
 */
class Invoice {
  /**
   * Create an Invoice.
   * @param {number} idUser - The user ID.
   * @param {number} price - The invoice price.
   * @param {number} [idInvoice=null] - The invoice ID.
   */
  constructor(idUser, price, idInvoice = null, created_at = null) {
    this.idInvoice = idInvoice;
    this.idUser = idUser;
    this.price = price;
    this.created_at = created_at;
  }

  /**
   * Create a new invoice.
   * @async
   * @param {Object} invoiceData - The invoice data.
   * @returns {Promise<Invoice>} The created invoice.
   * @throws {Error} If there's an error during creation.
   */
  static async create(invoiceData) {
    try {
      const newInvoice = new Invoice(...Object.values(invoiceData));
      const [response] = await db.query(`
        INSERT INTO invoices (id_user, price)
        VALUES (?, ?)
      `, [newInvoice.idUser, newInvoice.price]);
      newInvoice.idInvoice = response.insertId;
      return newInvoice;
    } catch (error) {
      console.error(`Erreur lors de la création de la facture : ${error}`);
      throw error;
    }
  }

  /**
   * Find all invoices.
   * @async
   * @returns {Promise<Invoice[]>} Array of all invoices.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id_user, price, id_invoice, created_at FROM invoices');
      return rows.map((row) => new Invoice(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la récupération de toutes les factures : ${error}`);
      throw error;
    }
  }

  /**
   * Find an invoice by ID.
   * @async
   * @param {number} invoiceId - The invoice ID.
   * @returns {Promise<Invoice|null>} The found invoice or null.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findById(invoiceId) {
    try {
      const [rows] = await db.query('SELECT id_user, price, id_invoice, created_at FROM invoices WHERE id_invoice = ?', [invoiceId]);
      return rows.length ? new Invoice(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche de la facture : ${error}`);
      throw error;
    }
  }

  /**
   * Find invoices by user ID.
   * @async
   * @param {number} userId - The user ID.
   * @returns {Promise<Invoice[]>} Array of invoices for the user.
   * @throws {Error} If there's an error during retrieval.
   */
  static async findByUserId(userId) {
    try {
      const [rows] = await db.query('SELECT id_user, price, id_invoice, created_at FROM invoices WHERE id_user = ?', [userId]);
      return rows.map((row) => new Invoice(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la recherche des factures de l'utilisateur : ${error}`);
      throw error;
    }
  }

  /**
   * Update an invoice.
   * @async
   * @param {Invoice} invoice - The invoice to update.
   * @returns {Promise<Object>} The update operation response.
   * @throws {Error} If no invoice was updated or there's an error during update.
   */
  static async update(invoice) {
    try {
      const [response] = await db.query(`
        UPDATE invoices
        SET price = ?
        WHERE id_invoice = ?
      `, [invoice.price, invoice.idInvoice]);

      if (response.affectedRows === 0) {
        throw new Error('Aucune facture n\'a été mise à jour');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la facture : ${error}`);
      throw error;
    }
  }

  /**
   * Delete an invoice.
   * @async
   * @param {number} invoiceId - The ID of the invoice to delete.
   * @returns {Promise<Object>} The delete operation response.
   * @throws {Error} If no invoice was deleted or there's an error during deletion.
   */
  static async delete(invoiceId) {
    try {
      const [response] = await db.query(`
        DELETE 
        FROM invoices 
        WHERE id_invoice = ?
      `, [invoiceId]);

      if (response.affectedRows === 0) {
        throw new Error('Aucune facture n\'a été supprimée');
      }

      return response;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la facture : ${error}`);
      throw error;
    }
  }
}

module.exports = Invoice;
