import express from 'express'
const router = express.Router()
import { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid } from '../controllers/orderController.js'
import { protect } from '../middleware/authMiddleware.js'

// hhjg

router.route('/').post(protect, addOrderItems)
router.route('/:id').get(protect, getOrderById)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/myorders').get(protect, getMyOrders)

export default router