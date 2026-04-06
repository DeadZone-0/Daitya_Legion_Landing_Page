import Player from "../models/Player.js";

export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find({}).sort({ matches: -1 });
    res.json(players || []);
  } catch (error) {
    console.error(`Error fetching players: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createPlayer = async (req, res) => {
  try {
    const { name, role, matches, runs, wickets, external_id } = req.body;
    let image_url = "";

    if (req.file) {
      image_url = req.file.path;
    }

    const player = new Player({
      name,
      role,
      matches,
      runs,
      wickets,
      external_id: external_id || `manual-${Date.now()}`,
      image_url,
      is_manual_override: true,
    });

    const createdPlayer = await player.save();
    res.status(201).json(createdPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const { name, role, matches, runs, wickets } = req.body;
    const player = await Player.findById(req.params.id);

    if (player) {
      player.name = name || player.name;
      player.role = role || player.role;
      player.matches = matches !== undefined ? matches : player.matches;
      player.runs = runs !== undefined ? runs : player.runs;
      player.wickets = wickets !== undefined ? wickets : player.wickets;
      player.is_manual_override = true;

      if (req.file) {
        player.image_url = req.file.path;
      }

      const updatedPlayer = await player.save();
      res.json(updatedPlayer);
    } else {
      res.status(404).json({ message: "Player not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (player) {
      await player.deleteOne();
      res.json({ message: "Player removed" });
    } else {
      res.status(404).json({ message: "Player not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
