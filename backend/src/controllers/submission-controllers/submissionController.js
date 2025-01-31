module.exports = {
    getAllUserSubmissions: async (req, res) => {
        const { userId } = req.params;
        try {
        const submissions = await Submission.find();
        res.json(submissions);
        } catch (err) {
        res.status(500).json({ message: 'Error fetching submissions', error: err.message });
        }
    },
    
    getSubmissionById: async (req, res) => {
        const { id } = req.params;
        try {
        const submission = await Submission.findById(id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.json(submission);
        } catch (err) {
        res.status(500).json({ message: 'Error fetching submission', error: err.message });
        }
    },
}