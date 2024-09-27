const Theme = require('../models/Theme');

exports.createTheme = async (req, res) => {
  try {
    const themeData = req.body;
    if (!themeData.name) {
      return res.status(400).json({ message: 'Veuillez donner un nom à votre thème' });
    }

    const existingTheme = await Theme.findByName(themeData.name);
    if (existingTheme) {
      console.error('Un thème possède déjà ce nom');
      return res.status(500).json({ message: 'Un thème possède déjà ce nom' });
    }

    const newTheme = await Theme.create(themeData);
    res.status(201).json({ message: 'Thème créé avec succès.', thème: newTheme });
  } catch (error) {
    console.error(`Erreur lors de la création du thème: ${error}`);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.findAll();
    if (themes.length === 0) {
      console.error('Aucun thème n\'a été trouvé');
      res.status(404).json({ message: 'Aucun thème n\'a été trouvé' });
    }
    res.status(200).json(themes);
  } catch (error) {
    console.error(`Erreur lors de la récupération des thèmes: ${error}`);
    res.status(500).json({ message: error.message });
  }
};
