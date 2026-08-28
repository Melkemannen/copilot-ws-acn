package com.webshop.controller

import com.webshop.model.Order
import com.webshop.service.CreateOrderItemCommand
import com.webshop.service.OrderService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

data class CreateOrderRequest(
    val customerName: String,
    val customerEmail: String,
    val items: List<OrderItemRequest>,
)

data class OrderItemRequest(
    val productId: Long,
    val quantity: Int,
)

@RestController
@RequestMapping("/api/orders")
class OrderController(
    private val orderService: OrderService,
) {
    @GetMapping
    fun getAllOrders(): ResponseEntity<List<Order>> {
        return ResponseEntity.ok(orderService.getAllOrders())
    }

    @GetMapping("/{id}")
    fun getOrderById(@PathVariable id: Long): ResponseEntity<Order> {
        return ResponseEntity.ok(orderService.getOrderById(id))
    }

    @PostMapping
    fun createOrder(@RequestBody request: CreateOrderRequest): ResponseEntity<Order> {
        val order = orderService.createOrder(
            customerName = request.customerName,
            customerEmail = request.customerEmail,
            items = request.items.map { CreateOrderItemCommand(it.productId, it.quantity) },
        )
        return ResponseEntity.status(HttpStatus.CREATED).body(order)
    }
}
