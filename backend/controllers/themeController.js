const Theme = require('../models/Theme');

/**
 * Creates a new theme.
 * @async
 * @function createTheme
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.createTheme = async (req, res) => {
  try {
    const themeData = req.body;
    // Validate required fields
    if (!themeData.name) {
      return res.status(400).json({ message: 'Veuillez donner un nom à votre thème' });
    }

    // Check for existing theme with the same name
    const existingTheme = await Theme.findByName(themeData.name);
    if (existingTheme) {
      console.error('Un thème possède déjà ce nom');
      return res.status(500).json({ message: 'Un thème possède déjà ce nom' });
    }

    // Create new theme
    const newTheme = await Theme.create(themeData);
    res.status(201).json({ message: 'Thème créé avec succès.', thème: newTheme });
  } catch (error) {
    console.error(`Erreur lors de la création du thème: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves all themes.
 * @async
 * @function getAllThemes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.findAll();
    if (themes.length === 0) {
      console.error('Aucun thème n\'a été trouvé');
      return res.status(404).json({ message: 'Aucun thème n\'a été trouvé' });
    }
    res.status(200).json(themes);
  } catch (error) {
    console.error(`Erreur lors de la récupération des thèmes: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieves a single theme by its ID.
 * @async
 * @function getOneThemeById
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getOneThemeById = async (req, res) => {
  try {
    const { id } = req.params;
    const theme = await Theme.findById(id);
    if (!theme) {
      console.error('Aucun thème trouvé pour cette Id');
      return res.status(404).json({ message: 'Aucun thème trouvé' });
    }
    res.status(200).json(theme);
  } catch (error) {
    console.error(`Erreur lors de la récupération du thème: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Deletes a theme by its ID.
 * @async
 * @function deleteTheme
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.deleteTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const themeToDelete = await Theme.findById(id);
    if (themeToDelete) {
      await Theme.delete(themeToDelete);
      res.status(200).json({ message: 'Theme successfully delete', themeDeleted: themeToDelete });
    } else {
      console.error('Aucun thème trouvé pour cette Id');
      res.status(404).json({ message: 'Aucun thème à supprimer' });
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression du thème: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Updates a theme by its ID.
 * @async
 * @function updateTheme
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.updateTheme = async (req, res) => {
  try {
    const { id } = req.params;
    const themeData = req.body;

    // Check if new name is provided
    if (themeData.name) {
      const themeToUpdate = await Theme.findById(id);
      if (themeToUpdate) {
        await Theme.update(themeToUpdate, themeData);
        const updatedTheme = await Theme.findById(id);
        res.status(200).json({ message: 'Theme successfully updated', themeUpdated: updatedTheme });
      } else {
        console.error('Aucun thème trouvé pour cette Id');
        res.status(404).json({ message: 'Aucun thème trouvé pour cette Id' });
      }
    } else {
      console.error('Vous devez donner un nouveau nom au thème');
      res.status(400).json({ message: 'Vous devez donner un nouveau nom au thème' });
    }
  } catch (error) {
    console.error(`Erreur lors de la modification du theme: ${error}`);
    res.status(500).json({ message: error.message });
  }
};
