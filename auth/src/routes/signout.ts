import express from 'express';

const router = express.Router()

router.post('/api/users/signout', (req, res) => {
res.send('Hallo, wunderbar signout')
})

export { router as signoutRouter };