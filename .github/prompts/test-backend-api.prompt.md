---
name: test-backend-api
description: Generate backend API tests with MockMvc and Mockito
keywords:
  - testing
  - backend
  - kotlin
  - spring-boot
---

# Generate focused Spring Boot API tests with MockMvc, Mockito, and JUnit 5.

Use this prompt in Copilot Chat by starting your message with `/test-backend-api`:
```
/test-backend-api generate a test for POST /api/orders
```
or:
```
Use the test-backend-api prompt to generate a test for POST /api/orders
```

When `[ENDPOINT]` is provided, inspect its controller and service signatures before
writing the test. Preserve the endpoint's existing request shape, response type, and
status codes. Do not invent an HTTP status that the controller does not return. If the
endpoint does not exist yet, state the expected controller/service contract and make
the example clearly adaptable.

## Test structure

When generating a test for `[ENDPOINT]`:

Use the Arrange-Act-Assert (AAA) pattern, with visibly separate sections in each test:
1. **Arrange**: Mock the service result or exception and prepare the request path, body, and headers.
2. **Act**: Execute the endpoint through `mockMvc.perform(...)`; do not call the controller directly.
3. **Assert**: Check the HTTP response and verify the service interaction with Mockito.

Prefer `@WebMvcTest` with `@MockBean` for controller-focused tests. Match the
repository's existing test setup when the project intentionally uses
`@SpringBootTest` and `@AutoConfigureMockMvc`.

## Response validation

Validate:
- **Status code**: Assert the exact contract, such as `204 No Content` for a successful delete or `404 Not Found` when the resource is absent.
- **Response body**: Use `jsonPath` for JSON responses. For `204`, assert that no response body is returned.
- **Service interaction**: Use `verify(...)` with exact arguments where practical, and verify that the service is not called when request validation prevents the controller from handling the request.
- **Headers and content type**: Assert them when they are part of the endpoint contract.

## Error cases

Include the error cases relevant to the endpoint:
- **400 Bad Request**: Invalid path variables, malformed JSON, or invalid request fields.
- **401 Unauthorized** and **403 Forbidden**: Include these when security is configured for the route.
- **404 Not Found**: The requested resource does not exist, especially for `{id}` endpoints.
- **500 Internal Server Error**: Include this when the application maps service failures to a 500 response. If exceptions are deliberately propagated by the current application, assert the propagated exception instead of claiming a 500 response.

For delete endpoints, the minimum useful coverage is a successful deletion and a
missing-resource case. Verify the service method is called with the requested ID in
the success case.

## Example

The following example assumes the conventional contract:
`DELETE /api/products/{id}` calls `productService.deleteProduct(id)` and returns
`204 No Content`; a missing product is represented by `404 Not Found`.

```kotlin
@WebMvcTest(ProductController::class)
class ProductControllerTest {
  @Autowired
  lateinit var mockMvc: MockMvc

  @MockBean
  lateinit var productService: ProductService

  @Test
  fun `delete product returns 204 when product exists`() {
    // Arrange
    val productId = 42L
    doNothing().`when`(productService).deleteProduct(productId)

    // Act and Assert
    mockMvc.perform(delete("/api/products/{id}", productId))
      .andExpect(status().isNoContent)
      .andExpect(content().string(""))

    verify(productService).deleteProduct(productId)
  }

  @Test
  fun `delete product returns 404 when product does not exist`() {
    // Arrange
    val productId = 42L
    doThrow(ProductNotFoundException(productId))
      .`when`(productService).deleteProduct(productId)

    // Act and Assert
    mockMvc.perform(delete("/api/products/{id}", productId))
      .andExpect(status().isNotFound)

    verify(productService).deleteProduct(productId)
  }
}
```

Use the project's actual not-found exception and exception handler. If the current
controller has no delete mapping yet, first add the mapping/service method or clearly
label the generated test as a contract test that will not pass until that behavior is
implemented. Include the required imports, such as `delete`, `content`, `doNothing`,
`doThrow`, and `verify`.

---

The generated test should be complete, compilable Kotlin and limited to the requested
endpoint unless adjacent setup is required for compilation.
