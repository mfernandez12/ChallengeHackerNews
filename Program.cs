using ChallengeHackerNews.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Configuration.AddJsonFile("appsettings.json");
builder.Services.AddMemoryCache();
builder.Services.AddControllers();

var apiConfig = builder.Configuration.GetSection("ApiConfig").Get<ApiConfig>();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSingleton<IHackerNewsApiService>(sp =>
{
    var httpClient = new HttpClient
    {
        BaseAddress = new Uri(apiConfig.HackerNewsApiUrl)
    };

    return new HackerNewsApiService(httpClient, apiConfig.HackerNewsApiUrl, apiConfig.HackerNewsApiUrlById);
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.UseCors("AllowAngularApp");

app.Run();