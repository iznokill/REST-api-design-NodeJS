import { Router } from 'express'
import { echo, me } from './controller'

const router = Router()

router.get('/', me)
router.post('/echo', echo)

export default router
