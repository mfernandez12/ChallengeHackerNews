using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ChallengeHackerNews.Services;
using ChallengeHackerNews.DTOs;

namespace ChallengeHackerNews.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HackerNewsController : ControllerBase
    {
        private readonly IHackerNewsApiService _hackerNewsApiService;
        private readonly IMemoryCache _cache;

        public HackerNewsController(IHackerNewsApiService hackerNewsApiService, IMemoryCache cache)
        {
            _hackerNewsApiService = hackerNewsApiService;
            _cache = cache;
        }

        [HttpGet("new-stories")]
        public async Task<IActionResult> GetNewStories()
        {
            try
            {
                if (!_cache.TryGetValue("newStories", out List<HackerNewsDto> newStories))
                {
                    newStories = await _hackerNewsApiService.GetNewStoriesAsync();

                    var cacheEntryOptions = new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(30)
                    };

                    _cache.Set("newStories", newStories, cacheEntryOptions);
                }

                return Ok(newStories);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error generating new stories: {ex.Message}");
            }
        }
    }
}
