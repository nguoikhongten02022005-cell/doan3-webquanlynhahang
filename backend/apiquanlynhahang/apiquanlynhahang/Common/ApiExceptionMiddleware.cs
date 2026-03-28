using System.Text.Json;
using apiquanlynhahang.Common;
using Microsoft.EntityFrameworkCore;

namespace apiquanlynhahang.Common;

public class ApiExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ApiExceptionMiddleware> _logger;

    public ApiExceptionMiddleware(RequestDelegate next, ILogger<ApiExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ApiException ex)
        {
            await GhiLoiAsync(context, ex.StatusCode, ex.Message);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Loi cap nhat co so du lieu");
            await GhiLoiAsync(context, StatusCodes.Status409Conflict, "Khong the luu du lieu vi vi pham rang buoc");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Loi khong xac dinh");
            await GhiLoiAsync(context, StatusCodes.Status500InternalServerError, "Da xay ra loi he thong");
        }
    }

    private static async Task GhiLoiAsync(HttpContext context, int statusCode, string message)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";
        var payload = JsonSerializer.Serialize(new { message });
        await context.Response.WriteAsync(payload);
    }
}
