﻿using ChallengeHackerNews.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace ChallengeHackerNews.Services
{
    public class HackerNewsApiService : IHackerNewsApiService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly string _hackerNewsApiUrl, _hackerNewsApiUrlById;

        
        public HackerNewsApiService(HttpClient httpClient, string hackerNewsApiUrl, string hackerNewsApiUrlById)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _hackerNewsApiUrl=hackerNewsApiUrl ?? throw new ArgumentNullException(nameof(httpClient));
            _hackerNewsApiUrlById=hackerNewsApiUrlById ?? throw new ArgumentNullException(nameof(httpClient));
        }

        public async Task<List<HackerNewsDto>> GetNewStoriesAsync()
        {
            List<HackerNewsDto> newsList = new List<HackerNewsDto>();
            try
            {
                var hackerNewsIdList = await _httpClient.GetFromJsonAsync<int[]>(_hackerNewsApiUrl);
                foreach (var hackerNewId in hackerNewsIdList) 
                {
                    var hackerNewsDetail = await _httpClient.GetFromJsonAsync<HackerNewsDto>(_hackerNewsApiUrlById.Replace("{id}", hackerNewId.ToString()));
                    if (hackerNewsDetail?.Url != null)
                        newsList.Add(hackerNewsDetail);
                }

                return newsList;
            }
            catch (HttpRequestException ex)
            {
                throw new Exception($"There was an error on the execution request with the next message: {ex.Message}");
            }
        }

        public async Task<string> GetNewStoryByIdAsync(int newsId)
        {
            string apiUrl = _hackerNewsApiUrl.Replace("{id}", newsId.ToString());
            var response = await _httpClient.GetStringAsync(apiUrl);

            return response;
        }
    }
}