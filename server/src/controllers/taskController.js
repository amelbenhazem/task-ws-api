const Task = require('../models/Task');
const { emitTaskCreated, emitTaskUpdated, emitTaskDeleted } = require('../sockets/taskEvents');

// Créer une nouvelle tâche
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user._id
    });

    await task.save();
    
    // Emit socket event
    emitTaskCreated(task);
    
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer toutes les tâches
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('createdBy', 'username')
      .populate('assignedTo', 'username');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une tâche par ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('assignedTo', 'username');
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Vérifier si l'utilisateur est le créateur ou l'assigné
    if (task.createdBy.toString() !== req.user._id.toString() && 
        task.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    Object.assign(task, req.body);
    await task.save();
    
    // Emit socket event
    emitTaskUpdated(task);
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    // Vérifier si l'utilisateur est le créateur
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await task.deleteOne();
    
    // Emit socket event
    emitTaskDeleted(task._id);
    
    res.json({ message: 'Tâche supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 