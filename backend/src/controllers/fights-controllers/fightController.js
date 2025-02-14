const express = require('express');
const router = express.Router();
const Fight = require('../../models/Fight');
const Problem = require('../../models/Problem');

module.exports = {
    createFight: async (req, res) => {
        const { name, userId, startTime, endTime, number_of_problms } = req.body;
        try {
            const problem = await Problem.aggregate([{ $sample: { size: number_of_problms } }]);
            if (!problem || problem.length === 0) {
                return res.status(404).json({ message: 'No problems available' });
            }
            const fight = new Fight({ name, problem: problem[0]._id, users: [userId], startTime, endTime });
            await fight.save();
            res.json({ fightId: fight._id, invitationLink: `/fights/invite/${userId}/${fight._id}` });
        } catch (error) {
            res.status(500).json({ error: 'Error creating fight' });
        }
    },
    getFightDetails: async (req, res) => {
        const { fightId } = req.params;
        try {
            const fight = await Fight.findById(fightId).populate('problem').populate('users');
            if (!fight) {
                return res.status(404).json({ message: 'Fight not found' });
            }
            res.json(fight);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching fight details' });
        }
    },
    editFight: async (req, res) => {
        const { fightId } = req.params;
        const { problemId, startTime, endTime } = req.body;
        try {
            const problem = await Problem.findById(problemId);
            if (!problem) {
                return res.status(404).json({ message: 'Problem not found' });
            }
            const fight = await Fight.findByIdAndUpdate(fightId, { problem, startTime, endTime }, { new: true });
            if (!fight) {
                return res.status(404).json({ message: 'Fight not found' });
            }
            res.json(fight);
        } catch (error) {
            res.status(500).json({ error: 'Error editing fight' });
        }
    },
    acceptFight: async (req, res) => {
        const { fightId, userId } = req.body;
        try {
            const fight = await Fight.findById(fightId);
            if (!fight) {
                return res.status(404).json({ message: 'Fight not found' });
            }
            if (fight.users.includes(userId)) {
                return res.status(400).json({ message: 'User already in the fight' });
            }
            fight.users.push(userId);
            await fight.save();
            res.json(fight);
        } catch (error) {
            res.status(500).json({ error: 'Error accepting fight' });
        }
    }
}