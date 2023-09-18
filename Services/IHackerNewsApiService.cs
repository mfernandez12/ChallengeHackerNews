using ChallengeHackerNews.DTOs;
using Microsoft.AspNetCore.Mvc;


namespace ChallengeHackerNews.Services
{
    public interface IHackerNewsApiService
    {
        Task<List<HackerNewsDto>> GetNewStoriesAsync();
    }
}
