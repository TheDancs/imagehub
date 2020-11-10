﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Infrastructure.Repositories;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ImageHubService.Application.Feed.Requests.GetUserFeed
{
    public class GetUserFeedRequest : IRequest<IEnumerable<PostModel>>
    {
        public string UserId { get; }

        public GetUserFeedRequest(string userId)
        {
            UserId = userId;
        }

        public class Handler : IRequestHandler<GetUserFeedRequest, IEnumerable<PostModel>>
        {
            private readonly IConfiguration configuration;
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database, IConfiguration configuration)
            {
                this.database = database;
                this.configuration = configuration;
            }

            public async Task<IEnumerable<PostModel>> Handle(GetUserFeedRequest request, CancellationToken cancellationToken)
            {
                var posts = await database.Posts.Where(x => x.UploaderId == request.UserId)
                    .Include(y => y.Likes)
                    .Include(y => y.Uploader)
                    .ToListAsync(cancellationToken);

                return posts.Select(x => new PostModel()
                {
                    Description = x.Description,
                    Id = x.Id.ToString(),
                    Likes = x.Likes.Count,
                    PictureUrl = $"{configuration["Application:BaseUrl"]}/api/v2.0/image/{x.PictureId}",
                    UploadTime = x.UploadTime,
                    Uploader = new UserMetaModel() { Id = x.UploaderId, Name = x.Uploader.UserName }
                }); //TODO: URL
            }
        }
    }
}
