using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageHubService.Infrastructure.Repositories;
using ImageHubService.V2.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ImageHubService.Application.Like.Requests.GetLikes
{
    public class GetLikesRequest : IRequest<IEnumerable<LikeModel>>
    {
        public string PostId { get; }

        public GetLikesRequest(string postId)
        {
            PostId = postId;
        }

        public class Handler : IRequestHandler<GetLikesRequest, IEnumerable<LikeModel>>
        {
            private readonly AppIdentityDbContext database;

            public Handler(AppIdentityDbContext database)
            {
                this.database = database;
            }

            public async Task<IEnumerable<LikeModel>> Handle(GetLikesRequest request, CancellationToken cancellationToken)
            {
                if (Guid.TryParse(request.PostId, out var postId))
                {
                    return await database.Likes.Where(x => x.PostId == postId).Include(x => x.User).Select(x => new LikeModel()
                    { User = new UserMetaModel() { Name = x.User.Name, Id = x.User.Id, ProfilePictureUrl = x.User.ProfilePictureUrl } })
                         .ToListAsync(cancellationToken);
                }

                return new List<LikeModel>();
            }
        }
    }
}
