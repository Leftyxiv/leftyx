import express from 'express';

const router = express.Router()

router.get('/api/user/currentuser', (req, res) => {
res.send('Hallo, wunderbar')
})

export { router as currentUserRouter };