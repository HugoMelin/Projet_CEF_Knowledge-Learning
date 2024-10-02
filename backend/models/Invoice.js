const db = require('../database/database');

class Invoice {
  constructor(idUser, price, idInvoice = null) {
    this.idInvoice = idInvoice;
    this.idUser = idUser;
    this.price = price;
  }

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

  static async findAll() {
    try {
      const [rows] = await db.query('SELECT id_user, price, id_invoice FROM invoices');
      return rows.map((row) => new Invoice(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la récupération de toutes les factures : ${error}`);
      throw error;
    }
  }

  static async findById(invoiceId) {
    try {
      const [rows] = await db.query('SELECT id_user, price, id_invoice FROM invoices WHERE id_invoice = ?', [invoiceId]);
      return rows.length ? new Invoice(...Object.values(rows[0])) : null;
    } catch (error) {
      console.error(`Erreur lors de la recherche de la facture : ${error}`);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const [rows] = await db.query('SELECT id_user, price, id_invoice FROM invoices WHERE id_user = ?', [userId]);
      return rows.map((row) => new Invoice(...Object.values(row)));
    } catch (error) {
      console.error(`Erreur lors de la recherche des factures de l'utilisateur : ${error}`);
      throw error;
    }
  }

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
