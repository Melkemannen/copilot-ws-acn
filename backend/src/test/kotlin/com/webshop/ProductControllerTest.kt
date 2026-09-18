package com.webshop

import com.webshop.model.Order
import com.webshop.service.OrderService
import jakarta.servlet.ServletException
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.mockito.Mockito.anyList
import org.mockito.Mockito.anyString
import org.mockito.Mockito.doReturn
import org.mockito.Mockito.doThrow

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @MockBean
    lateinit var orderService: OrderService

    @Test
    fun contextLoads() {
        assertThat(mockMvc).isNotNull()
    }

    @Test
    fun `create order returns 201 and the created order`() {
        val order = Order(
            id = 42L,
            customerName = "Ada Lovelace",
            customerEmail = "ada@example.com",
            total = 19.98,
        )
        doReturn(order).`when`(orderService).createOrder(anyString(), anyString(), anyList())

        mockMvc.perform(
            post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {
                      "customerName": "Ada Lovelace",
                      "customerEmail": "ada@example.com",
                      "items": [{"productId": 1, "quantity": 2}]
                    }
                    """.trimIndent(),
                ),
        )
            .andExpect(status().isCreated)
            .andExpect(jsonPath("$.id").value(42))
            .andExpect(jsonPath("$.customerName").value("Ada Lovelace"))
            .andExpect(jsonPath("$.total").value(19.98))
    }

    @Test
    fun `create order propagates service exception`() {
        doThrow(IllegalStateException("Unable to create order"))
            .`when`(orderService).createOrder(anyString(), anyString(), anyList())

        val exception = assertThrows<ServletException> {
            mockMvc.perform(
                post("/api/orders")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                          "customerName": "Ada Lovelace",
                          "customerEmail": "ada@example.com",
                          "items": [{"productId": 1, "quantity": 2}]
                        }
                        """.trimIndent(),
                    ),
            ).andReturn()
        }

        assertThat(exception).hasRootCauseMessage("Unable to create order")
    }
}
