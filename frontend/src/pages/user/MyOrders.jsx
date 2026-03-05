import { useState, useEffect } from 'react'
import { orderService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { ShoppingBag, Package, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

const STATUS_BADGE = {
    PENDING: { cls: 'badge-submitted', label: 'Pending' },
    CONFIRMED: { cls: 'badge-assigned', label: 'Confirmed' },
    SHIPPED: { cls: 'badge-scheduled', label: 'Shipped' },
    DELIVERED: { cls: 'badge-approved', label: 'Delivered' },
    CANCELLED: { cls: 'badge-rejected', label: 'Cancelled' },
}

const MyOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        orderService.getMyOrders()
            .then((res) => setOrders(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    return (
        <DashboardLayout pageTitle="My Orders" pageSubtitle="Assistive equipment orders">
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
                    <div className="spinner" />
                </div>
            ) : orders.length === 0 ? (
                <div className="empty-state">
                    <ShoppingBag size={48} className="empty-state-icon" />
                    <h3>No orders yet</h3>
                    <p style={{ fontSize: '14px' }}>
                        Browse <a href="/equipment" style={{ color: 'var(--color-green-700)', fontWeight: 600 }}>Assistive Equipment</a> to place your first order.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '680px' }}>
                    {orders.map((order, i) => {
                        const badge = STATUS_BADGE[order.status] || STATUS_BADGE.PENDING
                        return (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="card"
                            >
                                {/* Order header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-slate-400)', marginBottom: '2px' }}>
                                            Order ID
                                        </div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-slate-600)' }}>
                                            {order._id?.slice(-10).toUpperCase()}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                        <span className={`badge ${badge.cls}`}>{badge.label}</span>
                                        <span style={{ fontSize: '11px', color: 'var(--color-slate-400)' }}>
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Products */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                                    {(order.products || []).map((item, j) => (
                                        <div key={j} className="card-inset" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px' }}>
                                            <Package size={16} color="var(--color-slate-400)" style={{ flexShrink: 0 }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-slate-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.product?.name || 'Product'}
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-slate-400)' }}>Qty: {item.quantity}</div>
                                            </div>
                                            <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--color-slate-900)', flexShrink: 0 }}>
                                                ₹{((item.product?.discountedPrice || item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals + Shipping */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '10px' }}>
                                    {order.shippingAddress && (
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: 'var(--color-slate-500)', fontSize: '12px' }}>
                                            <MapPin size={13} style={{ marginTop: '1px', flexShrink: 0 }} />
                                            <span>
                                                {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                                            </span>
                                        </div>
                                    )}
                                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                        <div style={{ fontSize: '11px', color: 'var(--color-slate-400)', marginBottom: '2px' }}>Total</div>
                                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>
                                            ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                </div>

                                {/* Payment status */}
                                {order.paymentStatus && (
                                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', fontSize: '12px', color: 'var(--color-slate-400)' }}>
                                        Payment: <strong style={{ color: order.paymentStatus === 'PAID' ? 'var(--color-success)' : 'var(--color-warning)' }}>{order.paymentStatus}</strong>
                                        {order.razorpayOrderId && <span style={{ marginLeft: '8px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>ID: {order.razorpayOrderId}</span>}
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </DashboardLayout>
    )
}

export default MyOrders
