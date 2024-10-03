const Purchase = require('../models/Purchase');

/**
 * Creates a new purchase.
 * @async
 * @function createPurchase
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.createPurchase = async (req, res) => {
  try {
    const purchaseData = req.body;
    // Validate required fields
    if (!purchaseData.idUser
      || !purchaseData.idInvoice
      || (!purchaseData.idCourses && !purchaseData.idLessons)) {
      return res.status(400).json({ message: 'Veuillez fournir l\'ID de l\'utilisateur, l\'ID de la facture, et soit l\'ID du cours, soit l\'ID de la leçon' });
    }

    // Ensure purchase is for either a course or a lesson, not both
    if (purchaseData.idCourses && purchaseData.idLessons) {
      return res.status(400).json({ message: 'Un achat ne peut concerner qu\'un cours ou une leçon, pas les deux' });
    }

    console.log(purchaseData);
    const newPurchase = await Purchase.create(purchaseData);
    res.status(201).json({ message: 'Achat enregistré avec succès', purchase: newPurchase });
  } catch (error) {
    console.error(`Erreur lors de l'enregistrement de l'achat: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves all purchases.
 * @async
 * @function getAllPurchases
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll();
    if (purchases.length === 0) {
      return res.status(404).json({ message: 'Aucun achat n\'a été trouvé' });
    }
    res.status(200).json(purchases);
  } catch (error) {
    console.error(`Erreur lors de la récupération des achats: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a purchase by its ID.
 * @async
 * @function getPurchaseById
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getPurchaseById = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return res.status(404).json({ message: 'Achat non trouvé' });
    }
    res.status(200).json(purchase);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'achat: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves purchases by user ID.
 * @async
 * @function getPurchasesByUserId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getPurchasesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const purchases = await Purchase.findByUserId(userId);
    if (purchases.length === 0) {
      return res.status(404).json({ message: 'Aucun achat trouvé pour cet utilisateur' });
    }
    res.status(200).json(purchases);
  } catch (error) {
    console.error(`Erreur lors de la récupération des achats: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Updates a purchase.
 * @async
 * @function updatePurchase
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.updatePurchase = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const purchaseData = req.body;

    const existingPurchase = await Purchase.findById(purchaseId);
    if (!existingPurchase) {
      return res.status(404).json({ message: 'Achat non trouvé' });
    }

    Object.assign(existingPurchase, purchaseData);
    await Purchase.update(existingPurchase);

    const updatedPurchase = await Purchase.findById(purchaseId);
    res.status(200).json({ message: 'Achat mis à jour avec succès', purchase: updatedPurchase });
  } catch (error) {
    console.error(`Erreur lors de la modification de l'achat: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Deletes a purchase.
 * @async
 * @function deletePurchase
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.deletePurchase = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const existingPurchase = await Purchase.findById(purchaseId);
    if (!existingPurchase) {
      return res.status(404).json({ message: 'Achat non trouvé' });
    }

    await Purchase.delete(purchaseId);
    res.status(200).json({ message: 'Achat supprimé avec succès', purchaseDeleted: existingPurchase });
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'achat: ${error}`);
    res.status(500).json({ message: error.message });
  }
};
