import { useState, useEffect } from 'react'
import { productService, orderService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { ShoppingBag, ShoppingCart, Plus, Minus, X, Package } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'Mobility Aids', 'Hearing Aids', 'Visual Aids', 'Daily Living Aids', 'Communication Devices', 'Orthotics & Prosthetics']

const AssistiveEquipment = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('All')
    const [cart, setCart] = useState([])
    const [showCart, setShowCart] = useState(false)
    const [ordering, setOrdering] = useState(false)

    useEffect(() => {
        const params = {}
        if (category !== 'All') params.category = category
        productService.getAll(params)
            .then((res) => setProducts(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [category])

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.product._id === product._id)
            if (existing) return prev.map((i) => i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i)
            return [...prev, { product, quantity: 1 }]
        })
        toast.success(`${product.name} added to cart`)
    }

    const updateQty = (id, delta) => {
        setCart((prev) => prev.map((i) => i.product._id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
    }

    const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.product._id !== id))

    const total = cart.reduce((sum, i) => sum + (i.product.discountedPrice || i.product.price) * i.quantity, 0)

    const placeOrder = async () => {
        if (cart.length === 0) return
        setOrdering(true)
        try {
            await orderService.placeOrder({
                products: cart.map((i) => ({ product: i.product._id, quantity: i.quantity })),
                shippingAddress: {
                    fullName: 'From Profile',
                    addressLine1: 'Address from profile',
                    city: 'City', state: 'State', pincode: '000000',
                },
            })
            toast.success('Order placed! Payment integration coming soon.')
            setCart([])
            setShowCart(false)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Order failed')
        } finally {
            setOrdering(false)
        }
    }

    return (
        <DashboardLayout pageTitle="Assistive Equipment" pageSubtitle="Shop adaptive devices and aids">
            {/* Top bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {CATEGORIES.map((c) => (
                        <button key={c} onClick={() => setCategory(c)} style={{
                            padding: '5px 12px', borderRadius: '100px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                            border: `1.5px solid ${category === c ? 'var(--color-green-600)' : 'var(--border-color)'}`,
                            background: category === c ? 'var(--color-green-50)' : 'var(--surface-secondary)',
                            color: category === c ? 'var(--color-green-700)' : 'var(--color-slate-600)',
                            fontSize: '12px', fontWeight: 600,
                        }}>
                            {c}
                        </button>
                    ))}
                </div>
                <button onClick={() => setShowCart(true)} className="btn btn-secondary btn-sm" style={{ position: 'relative' }}>
                    <ShoppingCart size={15} />
                    Cart
                    {cart.length > 0 && (
                        <span style={{
                            position: 'absolute', top: '-6px', right: '-6px',
                            width: '18px', height: '18px', borderRadius: '50%',
                            background: 'var(--color-green-700)', color: 'white',
                            fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
                    )}
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                    <div className="spinner" />
                </div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <Package size={48} className="empty-state-icon" />
                    <h3>No products found</h3>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
                    {products.map((product) => {
                        const inCart = cart.find((i) => i.product._id === product._id)
                        const price = product.discountedPrice || product.price
                        return (
                            <div key={product._id} className="product-card">
                                <div className="product-card-image" style={{ background: 'var(--color-ivory-dark)', minHeight: '160px' }}>
                                    {product.image && product.image !== '/uploads/products/default.png' ? (
                                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Package size={40} color="var(--color-slate-300)" />
                                    )}
                                </div>
                                <div className="product-card-body">
                                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-green-600)', marginBottom: '6px' }}>
                                        {product.category}
                                    </div>
                                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3 }}>
                                        {product.name}
                                    </h3>
                                    <p style={{ fontSize: '13px', color: 'var(--color-slate-500)', marginBottom: '14px', lineHeight: 1.5, flex: 1 }}>
                                        {product.description.slice(0, 100)}…
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>
                                                ₹{price.toLocaleString('en-IN')}
                                            </span>
                                            {product.discountedPrice && (
                                                <span style={{ fontSize: '12px', color: 'var(--color-slate-400)', textDecoration: 'line-through', marginLeft: '6px' }}>
                                                    ₹{product.price.toLocaleString('en-IN')}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={!product.isAvailable || product.stock === 0}
                                            className="btn btn-primary btn-sm"
                                        >
                                            {inCart ? `In cart (${inCart.quantity})` : 'Add to Cart'}
                                        </button>
                                    </div>
                                    {product.stock === 0 && <div style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '4px' }}>Out of stock</div>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Cart panel */}
            <AnimatePresence>
                {showCart && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowCart(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }}
                        />
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.25 }}
                            style={{
                                position: 'fixed', right: 0, top: 0, bottom: 0, width: '380px', maxWidth: '100vw',
                                background: 'var(--surface-secondary)', borderLeft: '1px solid var(--border-color)',
                                zIndex: 50, display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)',
                            }}
                        >
                            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: '1.0625rem' }}>Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)</h3>
                                <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-slate-400)', padding: '4px' }}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
                                {cart.length === 0 ? (
                                    <div className="empty-state" style={{ padding: '40px 0' }}>
                                        <ShoppingCart size={32} className="empty-state-icon" />
                                        <p style={{ fontSize: '14px' }}>Your cart is empty</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {cart.map((item) => (
                                            <div key={item.product._id} className="card-inset" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 600, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {item.product.name}
                                                    </div>
                                                    <div style={{ fontSize: '13px', color: 'var(--color-green-700)', marginTop: '2px', fontWeight: 600 }}>
                                                        ₹{((item.product.discountedPrice || item.product.price) * item.quantity).toLocaleString('en-IN')}
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <button onClick={() => updateQty(item.product._id, -1)} style={{ width: '26px', height: '26px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Minus size={12} />
                                                    </button>
                                                    <span style={{ fontSize: '13px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                    <button onClick={() => updateQty(item.product._id, 1)} style={{ width: '26px', height: '26px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Plus size={12} />
                                                    </button>
                                                    <button onClick={() => removeFromCart(item.product._id)} style={{ width: '26px', height: '26px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)' }}>
                                                        <X size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {cart.length > 0 && (
                                <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <span style={{ fontWeight: 600 }}>Total</span>
                                        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 700 }}>₹{total.toLocaleString('en-IN')}</span>
                                    </div>
                                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={placeOrder} disabled={ordering}>
                                        {ordering ? <span className="spinner spinner-sm" /> : 'Place Order'}
                                    </button>
                                    <p style={{ fontSize: '11px', color: 'var(--color-slate-400)', textAlign: 'center', marginTop: '8px' }}>
                                        Razorpay payment integration available upon configuration
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </DashboardLayout>
    )
}

export default AssistiveEquipment
