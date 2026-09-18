package com.webshop.service

import com.webshop.model.Order
import com.webshop.model.OrderItem
import com.webshop.repository.OrderRepository
import com.webshop.repository.ProductRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

data class CreateOrderItemCommand(
    val productId: Long,
    val quantity: Int,
)

@Service
class OrderService(
    private val orderRepository: OrderRepository,
    private val productRepository: ProductRepository,
) {
    fun getAllOrders(): List<Order> = orderRepository.findAll()

    // TODO: Use Copilot to implement order lookup logic
    // Hint: use orderRepository.findById(id).orElse(null)
    fun getOrderById(id: Long): Order? {
        TODO("Implement using Copilot")
    }

    // TODO: Use Copilot to implement order creation logic
    // It should:
    // 1. Validate that each requested product exists and has enough stock
    // 2. Create an Order with OrderItem entries
    // 3. Reduce product stock levels
    // 4. Save and return the new order
    @Transactional
    fun createOrder(
        customerName: String,
        customerEmail: String,
        items: List<CreateOrderItemCommand>,
    ): Order {
        require(items.isNotEmpty()) { "Order must contain at least one item" }

        val orderItems = mutableListOf<OrderItem>()
        var total = 0.0

        for (item in items) {
            require(item.quantity > 0) { "Quantity must be positive for product ${item.productId}" }

            val product = productRepository.findById(item.productId).orElse(null)
                ?: throw IllegalArgumentException("Product not found: ${item.productId}")

            require(product.stock >= item.quantity) {
                "Insufficient stock for product ${product.name}: requested ${item.quantity}, available ${product.stock}"
            }

            productRepository.save(product.copy(stock = product.stock - item.quantity))

            orderItems.add(
                OrderItem(
                    productId = product.id!!,
                    productName = product.name,
                    quantity = item.quantity,
                    price = product.price,
                ),
            )
            total += product.price * item.quantity
        }

        val order = Order(
            customerName = customerName,
            customerEmail = customerEmail,
            total = total,
            items = orderItems,
        )

        return orderRepository.save(order)
    }
}
