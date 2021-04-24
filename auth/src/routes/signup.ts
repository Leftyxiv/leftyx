import express from 'express';

const router = express.Router()

router.post('/api/user/signup', (req, res) => {
res.send('Hallo, wunderbar signup')
})

export { router as signupRouter };