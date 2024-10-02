const Invoice = require('../models/Invoice');

exports.createInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;
    if (!invoiceData.price || !invoiceData.idUser) {
      return res.status(400).json({ message: 'Veuillez fournir le prix et l\'ID de l\'utilisateur' });
    }

    console.log(invoiceData);
    const newInvoice = await Invoice.create(invoiceData);
    res.status(201).json({ message: 'Facture créée avec succès', invoice: newInvoice });
  } catch (error) {
    console.error(`Erreur lors de la création de la facture: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    if (invoices.length === 0) {
      return res.status(404).json({ message: 'Aucune facture n\'a été trouvée' });
    }
    res.status(200).json(invoices);
  } catch (error) {
    console.error(`Erreur lors de la récupération des factures: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error(`Erreur lors de la récupération de la facture: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

exports.getInvoicesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const invoices = await Invoice.findByUserId(userId);
    if (invoices.length === 0) {
      return res.status(404).json({ message: 'Aucune facture trouvée pour cet utilisateur' });
    }
    res.status(200).json(invoices);
  } catch (error) {
    console.error(`Erreur lors de la récupération des factures: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const invoiceData = req.body;

    const existingInvoice = await Invoice.findById(invoiceId);
    if (!existingInvoice) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    Object.assign(existingInvoice, invoiceData);
    await Invoice.update(existingInvoice);

    const updatedInvoice = await Invoice.findById(invoiceId);
    res.status(200).json({ message: 'Facture mise à jour avec succès', invoice: updatedInvoice });
  } catch (error) {
    console.error(`Erreur lors de la modification de la facture: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const existingInvoice = await Invoice.findById(invoiceId);
    if (!existingInvoice) {
      return res.status(404).json({ message: 'Facture non trouvée' });
    }

    await Invoice.delete(invoiceId);
    res.status(200).json({ message: 'Facture supprimée avec succès', invoiceDeleted: existingInvoice });
  } catch (error) {
    console.error(`Erreur lors de la suppression de la facture: ${error}`);
    res.status(500).json({ message: error.message });
  }
};
