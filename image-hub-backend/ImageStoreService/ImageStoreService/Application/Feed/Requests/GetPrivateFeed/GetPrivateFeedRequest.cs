using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Infrastructure.Repositories;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace ImageHubService.Application.Feed.Requests.GetPrivateFeed
{
    public class GetPrivateFeedRequest : IRequest<IEnumerable<PostModel>>
    {
        public string UserId { get; }

        public GetPrivateFeedRequest(string userId)
        {
            UserId = userId;
        }

        public class Handler : IRequestHandler<GetPrivateFeedRequest, IEnumerable<PostModel>>
        {
            private readonly AppIdentityDbContext database;
            private readonly IConfiguration configuration;

            public Handler(AppIdentityDbContext database, IConfiguration configuration)
            {
                this.database = database;
                this.configuration = configuration;
            }

            public async Task<IEnumerable<PostModel>> Handle(GetPrivateFeedRequest request,
                CancellationToken cancellationToken)
            {
                var friends = await database.Relationships
                    .Where(x => x.UserId1 == request.UserId || x.UserId2 == request.UserId)
                    .Select(x => x.UserId1 == request.UserId ? x.UserId2 : x.UserId1).ToListAsync(cancellationToken);

                var posts = await database.Posts.Include(x => x.Uploader).Where(x => friends.Contains(x.UploaderId) || x.UploaderId == request.UserId)
                    .Include(y => y.Likes)
                    .ToListAsync(cancellationToken);

                return posts.Select(x => new PostModel()
                {
                    Description = x.Description,
                    Id = x.Id.ToString(),
                    Likes = x.Likes.Count,
                    PictureUrl = $"{configuration["ApplicationBaseUrl"]}/api/v2.0/image/{x.PictureId}",
                    UploadTime = x.UploadTime,
                    Uploader = new UserMetaModel() { Id = x.UploaderId, Name = x.Uploader.Name }
                });
            }
        }
    }
}
